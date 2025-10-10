// LocationCheckScreen.tsx
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// === 네비게이션 타입 ===
import { RootStackParamList } from '../types/type';

export default function LocationCheckScreen() {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "LocationCheck">;

  const navigation = useNavigation<NavigationProp>(); // ✅ 제네릭으로 연결

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const current = await Location.getCurrentPositionAsync({});
        console.log("📍 위치:", current);
      }

      // ✅ 이제 타입 오류 없이 작동
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text>위치 권한 확인 중...</Text>
    </View>
  );
}
