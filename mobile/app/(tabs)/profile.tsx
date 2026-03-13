import { Redirect } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import ProfileScreen from "../../src/screens/ProfileScreen";
import { View, ActivityIndicator } from "react-native";

export default function Profile() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // Jika ingin melihat profil tapi belum login, suruh login dulu
  if (!session) {
    return <Redirect href="/login" />;
  }

  return <ProfileScreen />;
}
