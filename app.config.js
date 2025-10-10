import { AccessibilityInfo } from "react-native";

export default ({ config }) => {
  return {
    ...config,
    name: "gion-e",
    slug: "gion-e",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    extra: {
      weatherApiUrl: process.env.WEATHER_API_URL,
      weatherApiKey: process.env.WEATHER_API_KEY,
      dailyMidTaApiUrl: process.env.DAILY_WEATHER_MID_API_URL,
      dailyMidLandFcstApiUrl: process.env.DAILY_WEATHER_MID_LAND_API_URL,
      dailyWeatherApiKey: process.env.DAILY_WEATHER_API_KEY,
      kakaoApiUrl: process.env.KAKAO_API_URL,
      kakaoApiKey: process.env.KAKAO_API_KEY,
      eas: {
        projectId: "d296c919-7648-4e2f-9f21-d4ff845b14d0" // ✅ 필수
      }
    },
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["assets/**/*"],
    ios: {
      supportsTablet: true,
      infoPlist: { // ios 위치 허용 추가
        NSLocationWhenInUseUsageDescription:
          "이 앱은 위치 기반 서비스를 제공하기 위해 위치 접근 권한이 필요합니다.",
      },
    },
    android: {
      package: "com.anonymous.gione",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions:["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"] // aos 위치 허용 추가
    },
    web: {
      favicon: "./assets/favicon.png"
    },

    // ✅ EAS Update 설정 추가
    updates: {
      url: "https://u.expo.dev/d296c919-7648-4e2f-9f21-d4ff845b14d0"
    },
    runtimeVersion: {
      policy: "appVersion"
    }
  };
};
