import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = (user) => {
    if (!user) {
      setUserProfile(null);
      return;
    }
    supabase
      .from('tbl_user')
      .select('*, tbl_t_subs(*)')
      .eq('id_user', user.id)
      .eq('tbl_t_subs.is_active', true)
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching user profile:", error);
          setUserProfile({ subscription_status: 'free' });
        } else if (data) {
          // Jika ada data di tbl_t_subs yang is_active=true, maka premium
          const isActiveSub = data.tbl_t_subs && data.tbl_t_subs.length > 0;
          setUserProfile({
            ...data,
            subscription_status: isActiveSub ? 'premium' : 'free'
          });
        } else {
          setUserProfile({ subscription_status: 'free' });
        }
      })
      .catch(e => {
        console.error("Exception fetching user profile:", e);
        setUserProfile({ subscription_status: 'free' });
      });
  };

  const refreshProfile = () => {
    if (session?.user) {
      fetchUserProfile(session.user);
    }
  };

  useEffect(() => {
    // Initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchUserProfile(session?.user);
      setLoading(false);
    });

    // Set up listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchUserProfile(session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user: session?.user,
    userProfile,
    refreshProfile,
    loading,
    logout: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
