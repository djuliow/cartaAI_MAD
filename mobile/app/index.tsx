import { Redirect } from "expo-router";

export default function Index() {
  // Langsung arahkan ke pintu masuk utama (Tabs)
  // Pengguna bisa melihat Beranda tanpa harus login
  return <Redirect href="/(tabs)" />;
}
