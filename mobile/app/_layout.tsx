import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { DarkModeProvider } from "../src/context/DarkModeContext";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../src/context/AuthContext";

function RootLayoutNav() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="register" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="update-password" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <RootLayoutNav />
      </DarkModeProvider>
    </AuthProvider>
  );
}
