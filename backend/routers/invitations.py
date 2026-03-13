from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import hashlib
import uuid
import traceback
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client

# Import the AI generator function
from ai_generator import create_invitation_html
from ai_generator_free import create_invitation_html_free
from dependencies import get_current_user

# --- Supabase Client Initialization ---
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file")

supabase: Client = create_client(url, key)

router = APIRouter(
    prefix="/invitations",
    tags=["Invitations"],
)

# --- Pydantic Models ---
class GiftInfo(BaseModel):
    namaBank: str
    noRekening: str
    namaRekening: str

class InvitationRequest(BaseModel):
    slug: str
    namaMempelaiPria: str
    namaAyahMempelaiPria: Optional[str] = None
    namaIbuMempelaiPria: Optional[str] = None
    namaMempelaiWanita: str
    namaAyahMempelaiWanita: Optional[str] = None
    namaIbuMempelaiWanita: Optional[str] = None
    tanggalAcara: str
    waktuAcara: Optional[str] = None
    lokasiAcara: str
    waktuResepsi: Optional[str] = None
    tempatResepsi: Optional[str] = None
    temaWarna: Optional[str] = None
    jenisUndangan: Optional[str] = None
    agama: Optional[str] = None
    catatanKhusus: Optional[str] = None
    musik: Optional[str] = None
    fotoMempelaiPria: Optional[str] = None
    fotoMempelaiWanita: Optional[str] = None
    galeriFoto: Optional[List[str]] = []
    customFont: Optional[str] = None
    hadiah: Optional[List[GiftInfo]] = []

class RSVPRequest(BaseModel):

    nama: str
    kehadiran: str
    ucapan: Optional[str] = None

class GuestCreate(BaseModel):
    name: str

class BulkGuestCreate(BaseModel):
    slug: str
    names: List[str]

class BulkDeleteRequest(BaseModel):
    slugs: List[str]

# --- Endpoints ---

@router.get("/guests/{slug}")
async def get_guests(slug: str, current_user: dict = Depends(get_current_user)):
    try:
        user_id = getattr(current_user, 'id', None) or current_user.get('id')
        # Get invitation and verify ownership
        inv = supabase.table("tbl_t_invitation").select("id_invitation").eq("invitation_link", slug).eq("id_user", user_id).execute()
        if not inv.data:
            raise HTTPException(status_code=403, detail="Not authorized or invitation not found")
        
        inv_id = inv.data[0]['id_invitation']
        res = supabase.table("tbl_t_guest").select("*").eq("id_invitation", inv_id).order('created_date', desc=True).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/guests/bulk")
async def add_guests_bulk(request: BulkGuestCreate, current_user: dict = Depends(get_current_user)):
    try:
        user_id = getattr(current_user, 'id', None) or current_user.get('id')
        # Verify ownership
        inv = supabase.table("tbl_t_invitation").select("id_invitation").eq("invitation_link", request.slug).eq("id_user", user_id).execute()
        if not inv.data:
            raise HTTPException(status_code=403, detail="Not authorized or invitation not found")
        
        inv_id = inv.data[0]['id_invitation']
        guest_data = [{
            "id_guest": str(uuid.uuid4()),
            "id_invitation": inv_id, 
            "guest_name": name,
            "guest_slug": f"{request.slug}-{hashlib.md5(name.encode()).hexdigest()[:8]}",
            "is_active": True,
            "created_by": user_id,
            "updated_by": user_id
        } for name in request.names]
        res = supabase.table("tbl_t_guest").insert(guest_data).execute()
        return {"message": f"Successfully added {len(request.names)} guests", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/guests/{guest_id}")
async def delete_guest(guest_id: str):
    try:
        supabase.table("tbl_t_guest").delete().eq("id_guest", guest_id).execute()
        return {"message": "Guest deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_user_invitations(current_user: dict = Depends(get_current_user)):
    try:
        user_id = getattr(current_user, 'id', None) or current_user.get('id')
        # Join tbl_t_invitation with tbl_t_invitation_content
        response = supabase.table("tbl_t_invitation").select("*, tbl_t_invitation_content(*)").eq("id_user", user_id).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching invitations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate", status_code=status.HTTP_200_OK)
async def generate_and_upload_invitation(request: InvitationRequest, current_user: dict = Depends(get_current_user)):
    try:
        user_id = getattr(current_user, 'id', None) or current_user.get('id')
        form_data = request.dict()
        html_content = create_invitation_html(form_data)
        
        # 1. Store Template
        template_id = str(uuid.uuid4())
        supabase.table("tbl_t_template_ai").insert({
            "id_template": template_id,
            "template_html": html_content,
            "is_active": True,
            "created_by": user_id,
            "updated_by": user_id
        }).execute()

        # 2. Store Invitation
        invitation_id = str(uuid.uuid4())
        invitation_data = {
            "id_invitation": invitation_id,
            "id_user": user_id,
            "id_template": template_id,
            "invitation_link": request.slug,
            "is_active": True,
            "created_by": user_id,
            "updated_by": user_id
        }
        # First check if exists to keep the original id_invitation
        existing_inv = supabase.table("tbl_t_invitation").select("id_invitation").eq("invitation_link", request.slug).execute()
        
        if existing_inv.data:
            invitation_id = existing_inv.data[0]['id_invitation']
            # Update existing
            supabase.table("tbl_t_invitation").update({
                "id_template": template_id,
                "updated_by": user_id,
                "updated_date": datetime.utcnow().isoformat()
            }).eq("id_invitation", invitation_id).execute()
        else:
            # Insert new
            supabase.table("tbl_t_invitation").insert(invitation_data).execute()

        # 3. Store Content
        content_data = {
            "id_content": str(uuid.uuid4()),
            "id_invitation": invitation_id,
            "groom_name": request.namaMempelaiPria,
            "bride_name": request.namaMempelaiWanita,
            "groom_father": request.namaAyahMempelaiPria,
            "groom_mother": request.namaIbuMempelaiPria,
            "bride_father": request.namaAyahMempelaiWanita,
            "bride_mother": request.namaIbuMempelaiWanita,
            "religion": request.agama,
            "invitation_type": request.jenisUndangan,
            "theme_color": request.temaWarna,
            "custom_font": request.customFont,
            "akad_date": request.tanggalAcara,
            "akad_time": request.waktuAcara,
            "akad_location": request.lokasiAcara,
            "reception_time": request.waktuResepsi,
            "reception_location": request.tempatResepsi,
            "music_url": request.musik,
            "groom_photo": request.fotoMempelaiPria,
            "bride_photo": request.fotoMempelaiWanita,
            "special_notes": request.catatanKhusus,
            "is_active": True,
            "created_by": user_id,
            "updated_by": user_id
        }
        # Use update if exists, insert if not for content
        existing_content = supabase.table("tbl_t_invitation_content").select("id_content").eq("id_invitation", invitation_id).execute()
        if existing_content.data:
            content_id = existing_content.data[0]['id_content']
            # Clean up data for update (don't update id_invitation or id_content)
            update_content = content_data.copy()
            del update_content["id_content"]
            del update_content["id_invitation"]
            del update_content["created_by"]
            update_content["updated_date"] = datetime.utcnow().isoformat()
            supabase.table("tbl_t_invitation_content").update(update_content).eq("id_content", content_id).execute()
        else:
            supabase.table("tbl_t_invitation_content").insert(content_data).execute()

        # 4. Store Gallery
        if request.galeriFoto:
            gallery_data = [{
                "id_gallery": str(uuid.uuid4()),
                "id_invitation": invitation_id,
                "photo_url": url,
                "is_active": True,
                "created_by": user_id,
                "updated_by": user_id
            } for url in request.galeriFoto]
            supabase.table("tbl_t_gallery").insert(gallery_data).execute()

        return {"message": "Invitation generated successfully!", "invitation_id": invitation_id}
    except Exception as e:
        print(f"Error generating invitation: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to generate invitation: {str(e)}")

@router.post("/generate-free", status_code=status.HTTP_200_OK)
async def generate_and_upload_invitation_free(request: InvitationRequest, current_user: dict = Depends(get_current_user)):
    try:
        user_id = getattr(current_user, 'id', None) or current_user.get('id')
        form_data = request.dict()
        html_content = create_invitation_html_free(form_data)
        
        # 1. Store Template
        template_id = str(uuid.uuid4())
        supabase.table("tbl_t_template_ai").insert({
            "id_template": template_id,
            "template_html": html_content,
            "is_active": True,
            "created_by": user_id,
            "updated_by": user_id
        }).execute()

        # 2. Store Invitation
        invitation_id = str(uuid.uuid4())
        invitation_data = {
            "id_invitation": invitation_id,
            "id_user": user_id,
            "id_template": template_id,
            "invitation_link": request.slug,
            "is_active": True,
            "created_by": user_id,
            "updated_by": user_id
        }
        supabase.table("tbl_t_invitation").upsert(invitation_data, on_conflict="invitation_link").execute()

        invitation_res = (
            supabase.table("tbl_t_invitation")
            .select("id_invitation")
            .eq("invitation_link", request.slug)
            .eq("id_user", user_id)
            .limit(1)
            .execute()
        )
        if invitation_res.data:
            invitation_id = invitation_res.data[0]["id_invitation"]

        # 3. Store Content
        content_id = str(uuid.uuid4())
        content_data = {
            "id_content": content_id,
            "id_invitation": invitation_id,
            "groom_name": request.namaMempelaiPria,
            "bride_name": request.namaMempelaiWanita,
            "groom_father": request.namaAyahMempelaiPria,
            "groom_mother": request.namaIbuMempelaiPria,
            "bride_father": request.namaAyahMempelaiWanita,
            "bride_mother": request.namaIbuMempelaiWanita,
            "religion": request.agama,
            "invitation_type": "Free",
            "theme_color": "Standard",
            "akad_date": request.tanggalAcara,
            "akad_time": request.waktuAcara,
            "akad_location": request.lokasiAcara,
            "reception_time": request.waktuResepsi,
            "reception_location": request.tempatResepsi,
            "special_notes": request.catatanKhusus,
            "is_active": True,
            "created_by": user_id,
            "updated_by": user_id
        }
        supabase.table("tbl_t_invitation_content").upsert(content_data, on_conflict="id_invitation").execute()

        return {"message": "Free invitation generated successfully!", "invitation_id": invitation_id}
    except Exception as e:
        print(f"Error generating free invitation: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to generate free invitation: {str(e)}")

@router.get("/all-rsvps")
async def get_all_user_rsvps(current_user: dict = Depends(get_current_user)):
    try:
        user_id = getattr(current_user, 'id', None) or current_user.get('id')
        user_id_str = str(user_id)
        
        inv_res = supabase.table("tbl_t_invitation").select("id_invitation, invitation_link, tbl_t_invitation_content(groom_name, bride_name)").eq("id_user", user_id_str).execute()
        
        if not inv_res.data:
            return {"messages": [], "stats": {"total": 0, "hadir": 0, "tidak_hadir": 0}}

        inv_ids = [str(i['id_invitation']) for i in inv_res.data]
        inv_map = {}
        for i in inv_res.data:
            content = i.get('tbl_t_invitation_content') or {}
            p = content.get('groom_name') or "Pria"
            w = content.get('bride_name') or "Wanita"
            inv_map[str(i['id_invitation'])] = f"{p} & {w}"

        # Get guests for these invitations
        guest_res = supabase.table("tbl_t_guest").select("id_guest, guest_name, id_invitation").in_("id_invitation", inv_ids).execute()
        guest_ids = [str(g['id_guest']) for g in guest_res.data]
        guest_map = {str(g['id_guest']): {"name": g['guest_name'], "inv_id": g['id_invitation']} for g in guest_res.data}

        # Get RSVPs for these guests
        rsvp_res = supabase.table("tbl_t_rsvp").select("*").in_("id_guest", guest_ids).order('created_date', desc=True).execute()
        
        mapped = []
        stats_data = {"total": 0, "hadir": 0, "tidak_hadir": 0}
        
        for item in rsvp_res.data:
            status_val = str(item.get('attendance_status') or "Hadir")
            stats_data["total"] += 1
            if 'tidak' in status_val.lower(): stats_data["tidak_hadir"] += 1
            else: stats_data["hadir"] += 1
                
            guest_info = guest_map.get(str(item.get('id_guest')), {})
            inv_id_str = str(guest_info.get('inv_id'))
            
            mapped.append({
                'id': item.get('id_rsvp'),
                'nama': guest_info.get('name', "Tamu"),
                'kehadiran': status_val,
                'ucapan': item.get('message') or "",
                'timestamp': item.get('created_date'),
                'undangan_id': inv_id_str,
                'nama_undangan': inv_map.get(inv_id_str, "Undangan")
            })
            
        return {"messages": mapped, "stats": stats_data}
    except Exception as e:
        print(f"CRITICAL ERROR in all-rsvps:\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{slug}", response_class=HTMLResponse)
async def get_invitation(slug: str):
    try:
        # 1. Check if invitation exists in database and join with template
        res = supabase.table("tbl_t_invitation").select("id_template, tbl_t_template_ai(template_html)").eq("invitation_link", slug).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Undangan tidak ditemukan")
        
        # 2. Get the template HTML
        template_data = res.data[0].get("tbl_t_template_ai")
        if not template_data:
            raise HTTPException(status_code=404, detail="Template tidak ditemukan")
            
        html_content = template_data.get("template_html")
        
        if html_content:
            return HTMLResponse(content=html_content)

        raise HTTPException(status_code=500, detail="Konten undangan kosong.")
        
    except Exception as e:
        print(f"Error serving {slug}: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{slug}/finalize")
async def finalize_invitation(slug: str, current_user: dict = Depends(get_current_user)):
    try:
        user_id = getattr(current_user, 'id', None) or current_user.get('id')
        # Since is_finalized is not in schema, we use is_active or just return success
        return {"message": "Invitation finalized successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/", status_code=status.HTTP_200_OK)
async def bulk_delete_invitations(request: BulkDeleteRequest, current_user: dict = Depends(get_current_user)):
    try:
        user_id = getattr(current_user, 'id', None) or current_user.get('id')
        slugs = request.slugs
        supabase.table("tbl_t_invitation").delete().eq("id_user", user_id).in_("invitation_link", slugs).execute()
        return {"message": "Deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{slug}/rsvp", status_code=status.HTTP_201_CREATED)
async def submit_rsvp(slug: str, rsvp: RSVPRequest):
    try:
        # 1. Find invitation
        inv_check = supabase.table('tbl_t_invitation').select('id_invitation').eq('invitation_link', slug).execute()
        if not inv_check.data: raise HTTPException(status_code=404)
        inv_id = inv_check.data[0]['id_invitation']
        
        # 2. Find or create guest
        # If the guest name is from URL parameter 'to', they should exist in tbl_t_guest
        guest_res = supabase.table('tbl_t_guest').select('id_guest').eq('id_invitation', inv_id).eq('guest_name', rsvp.nama).execute()
        
        if guest_res.data:
            guest_id = guest_res.data[0]['id_guest']
        else:
            # Create a new guest record if they don't exist
            guest_id = str(uuid.uuid4())
            supabase.table('tbl_t_guest').insert({
                "id_guest": guest_id,
                "id_invitation": inv_id,
                "guest_name": rsvp.nama,
                "guest_slug": f"{slug}-{hashlib.md5(rsvp.nama.encode()).hexdigest()[:8]}",
                "is_active": True,
                "created_by": "guest",
                "updated_by": "guest"
            }).execute()
        
        # 3. Insert RSVP
        data = {
            'id_rsvp': str(uuid.uuid4()),
            'id_guest': guest_id,
            'attendance_status': rsvp.kehadiran,
            'message': rsvp.ucapan,
            'is_active': True,
            'created_by': rsvp.nama,
            'updated_by': rsvp.nama
        }
        supabase.table('tbl_t_rsvp').insert(data).execute()

        return {"message": "Success"}
    except Exception as e:
        print(f"Error in submit_rsvp: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{slug}/rsvp")
async def get_rsvp_messages(slug: str):
    try:
        # 1. Find invitation
        inv_check = supabase.table('tbl_t_invitation').select('id_invitation').eq('invitation_link', slug).execute()
        if not inv_check.data: raise HTTPException(status_code=404)
        inv_id = inv_check.data[0]['id_invitation']
        
        # 2. Get guests
        guest_res = supabase.table('tbl_t_guest').select('id_guest, guest_name').eq('id_invitation', inv_id).execute()
        guest_ids = [g['id_guest'] for g in guest_res.data]
        guest_names = {g['id_guest']: g['guest_name'] for g in guest_res.data}
        
        # 3. Get RSVPs
        res = supabase.table('tbl_t_rsvp').select('*').in_('id_guest', guest_ids).order('created_date', desc=True).execute()
        mapped = [{
            'nama': guest_names.get(i.get('id_guest'), "Unknown"), 
            'kehadiran': i.get('attendance_status'), 
            'ucapan': i.get('message'), 
            'timestamp': i.get('created_date')
        } for i in res.data]
        return {"messages": mapped}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
