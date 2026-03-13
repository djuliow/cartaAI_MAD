import { Redirect } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import FreeGeneratorScreen from "../../src/screens/FreeGeneratorScreen";
import PremiumGeneratorScreen from "../../src/screens/PremiumGeneratorScreen";
import { View, ActivityIndicator } from "react-native";

export default function Generator() {
  const { session, loading, userProfile } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // Jika ingin buat undangan tapi belum login, suruh login dulu
  if (!session) {
    return <Redirect href="/login" />;
  }

  if (userProfile?.subscription_status === "premium") {
    return <PremiumGeneratorScreen />;
  }

  return <FreeGeneratorScreen />;
}
