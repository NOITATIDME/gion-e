import React, { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// === expo-video (최신 API) ===
import { VideoView, useVideoPlayer } from "expo-video";

import LocationModal from "../components/LocationModal";
import OutfitModal from "../components/OutfitModal";

// === SVG 날씨 아이콘 ===
import Weather1 from "../../assets/images/weather1.svg"; // sunny
import Weather2 from "../../assets/images/weather2.svg"; // cloudy
import Weather3 from "../../assets/images/weather3.svg"; // rain
import Weather4 from "../../assets/images/weather4.svg"; // night
import Weather5 from "../../assets/images/weather5.svg"; // partly
import Weather6 from "../../assets/images/weather6.svg"; // default

// === 액션 아이콘 ===
import Icon1 from "../../assets/images/icon1.svg";
import Icon2 from "../../assets/images/icon2.svg";
import Link from "../../assets/images/link.svg";

// =============================
// 타입 및 매핑
// =============================

// 하루를 아침/오후/밤 3가지로 구분
type TimeOfDay = "morning" | "afternoon" | "night";

// 날씨 condition → SVG 아이콘 변환
const getIcon = (condition: string, wSize = 39, hSize = 31) => {
  switch (condition) {
    case "sunny":
      return <Weather1 width={wSize} height={hSize} />;
    case "cloudy":
      return <Weather2 width={wSize} height={hSize} />;
    case "rain":
      return <Weather3 width={wSize} height={hSize} />;
    case "night":
      return <Weather4 width={wSize} height={hSize} />;
    case "partly":
      return <Weather5 width={wSize} height={hSize} />;
    default:
      return <Weather6 width={wSize} height={hSize} />;
  }
};

// 현재 시각의 시간대(아침/오후/밤) 판별
const getTimeOfDay = (hour: number = new Date().getHours()): TimeOfDay => {
  if (hour >= 6 && hour < 12) return "morning"; 
  if (hour >= 12 && hour < 18) return "afternoon"; 
  return "night"; 
};

// 시간대별 비디오 배경 (비디오는 임시) -> 임시로 웹에서 볼 때
const timeAssets: Record<TimeOfDay, any> = {
  morning: require("../../assets/videos/morningScene.mp4"),
  afternoon: require("../../assets/videos/afternoonScene.mp4"),
  night: require("../../assets/videos/nightScene.mp4"),
};

// 원격 영상 (Google Drive) 버전 -> 필요 시 위 코드 대신 사용 가능
// const timeAssets: Record<TimeOfDay, any> = {
//   morning: { uri: "https://drive.google.com/uc?export=download&id=1JVkJWb6_T8NUEF-BuMHZqQaM_cSBSbkI" },
//   afternoon: { uri: "https://drive.google.com/uc?export=download&id=1JVkJWb6_T8NUEF-BuMHZqQaM_cSBSbkI" },
//   night: { uri: "https://drive.google.com/uc?export=download&id=1JVkJWb6_T8NUEF-BuMHZqQaM_cSBSbkI" },
// };


// 캐릭터 타입
type CharacterType = "pig" | "rabbit" | "duck";

// 캐릭터 매핑
const characterAssets: Record<TimeOfDay, any> = {
  morning: require("../../assets/images/character2.png"),
  afternoon: require("../../assets/images/character2.png"),
  night: require("../../assets/images/character.png"),
};

// =============================
// 반응형 유틸 (폰트/아이콘 크기 조정)
// =============================
const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

const normalizeSize = (size: number) => {
  const scaleFactor = Math.min(width / 375, height / 812);
  if (width < 350) return size * 0.8;   // 작은 기기
  if (isTablet) return size * 1.1;      // 태블릿
  return size * scaleFactor;
};

// =============================
// 48시간(3시간 단위, 17개 슬롯) 시간대 생성
// =============================
const generateHourlySlots = (startDate: Date = new Date()) => {
  const slots = [];

  for (let i = 0; i < 17; i++) {
    // 기준 시간 + (3시간 * i)
    const d = new Date(startDate.getTime() + i * 3 * 60 * 60 * 1000);
    const hour = d.getHours();

    // 라벨 포맷: 첫 번째는 "지금", 이후는 "오전/오후 N시"
    let label;
    if (i === 0) {
      label = "지금";
    } else {
      const period = hour < 12 ? "오전" : "오후";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      label = `${period} ${displayHour}`;
    }

    // condition 임시 값 (API 붙이면 교체 가능)
    const conditions = ["sunny", "cloudy", "rain", "partly", "night"];
    const condition = conditions[i % conditions.length];

    slots.push({
      label,       // 시간대 라벨
      temp: 20 + (i % 10), // 예시 온도 (20~29도)
      condition,   // 날씨 상태
      low: 18,     // 최저
      high: 30,    // 최고
      hour,        // 시간 (0~23)
    });
  }

  return slots;
};

// =============================
// HomeScreen 컴포넌트
// =============================
export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [location] = useState("하남시 미사1동");  // 현재 위치 (임시)
  const [hourly, setHourly] = useState<any[]>([]); // 3시간 단위 17개 데이터
  const [selectedIdx, setSelectedIdx] = useState(0); // 선택된 인덱스

  // 현재 선택된 시간대 데이터
  const [current, setCurrent] = useState({ temp: 0, condition: "sunny" });
  const [hiLo, setHiLo] = useState({ low: 0, high: 0 });

  // 화면 처음 로드될 때 → 현재 시각 기준 48시간 데이터 생성
  useEffect(() => {
    const slots = generateHourlySlots(new Date());
    setHourly(slots);
    setCurrent({ temp: slots[0].temp, condition: slots[0].condition });
    setHiLo({ low: slots[0].low, high: slots[0].high });
  }, []);

  // 안내 문구 (현재 온도에 따라 달라짐)
  const tipText = useMemo(() => {
    const t = current.temp;
    if (t >= 33) return "🔥 매우 더워요! 수분 보충 & 최대한 실내에서 지내요.";
    if (t >= 28) return "점심시간 더위 조심해요 🧃 얇은 옷차림으로 쾌적하게!";
    if (t >= 23) return "선선해요 🙂 가벼운 겉옷 하나 챙기면 딱 좋아요.";
    if (t >= 18) return "조금 쌀쌀합니다 🧥 얇은 자켓 추천!";
    return "쌀쌀해요 🧊 따뜻한 아우터를 꼭 챙기세요.";
  }, [current.temp]);

  // 시간대 선택 시 → 현재 날씨 업데이트
  const onSelectHour = (idx: number) => {
    setSelectedIdx(idx);
    const h = hourly[idx];
    setCurrent({ temp: h.temp, condition: h.condition });
    setHiLo({ low: h.low, high: h.high });
  };

  // 현재 시간대에 따른 배경 비디오 결정
  const timeOfDay = getTimeOfDay(hourly[selectedIdx]?.hour || new Date().getHours());

  // === expo-video player 설정 ===
  const player = useVideoPlayer(timeAssets[timeOfDay], (p) => {
    p.muted = true; // 무음
    p.loop = true;  // 반복재생
  });
  // 자동 재생
  useEffect(() => {
    if (player) player.play();
  }, [player]);

  // 모달 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [outfitVisible, setOutfitVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>

        {/* ===== 비디오 배경 ===== */}
        <View style={{ ...StyleSheet.absoluteFillObject, zIndex: -1 }}>
          <VideoView player={player} style={{ flex: 1 }} nativeControls={false} />
        </View>

        {/* ===== 캐릭터 이미지 ===== */}
        <View style={styles.characterWrapper}>
          <Image
            source={characterAssets[timeOfDay]}
            style={styles.character}
            resizeMode="contain"
          />
        </View>

        {/* ===== 상단 헤더 영역 ===== */}
        <View style={styles.topHero}>
          <View style={styles.topRow}>
            {/* 위치 선택 버튼 */}
            <TouchableOpacity
              style={styles.locationWrapper}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.locationText}>{location}</Text>
              <Text style={styles.locationArrow}>›</Text>
            </TouchableOpacity>

            {/* 공유 버튼 */}
            <TouchableOpacity onPress={() => Alert.alert("공유", "공유 기능")}>
              <Link
                width={normalizeSize(21)}
                height={normalizeSize(23)}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>

          {/* 위치 모달 */}
          <LocationModal visible={modalVisible} onClose={() => setModalVisible(false)} />

          {/* 현재 온도 표시 */}
          <View style={styles.tempArea}>
            <View style={styles.tempRow}>
              {getIcon(current.condition, normalizeSize(50), normalizeSize(50))}
              <Text style={styles.nowTemp}>{current.temp}°</Text>
            </View>
            <Text style={styles.hilo}>
              <Text style={styles.low}>{hiLo.low}°</Text>
              {"  "}
              <Text style={styles.high}>{hiLo.high}°</Text>
            </Text>
          </View>
        </View>

        {/* ===== 안내 문구 ===== */}
        <View style={styles.tipBubble}>
          <Text style={styles.tipText}>{tipText}</Text>
        </View>

        {/* ===== 버튼 영역 (옷차림, 일일예보) ===== */}
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => setOutfitVisible(true)}>
            <Icon2 width={normalizeSize(58)} height={normalizeSize(58)} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("DailyForecast", {
                location: location,
                dailyData: [ // 데이터 넘기는 부분
                  { date: "오늘", min: 16, max: 17, condition: "sunny" },
                  { date: "내일", min: 21, max: 23, condition: "cloudy" },
                  { date: "모레", min: 4, max: 6, condition: "rain" },
                  { date: "8/23", min: 28, max: 31, condition: "sunny" },
                ],
              })
            }
          >
            <Icon1 width={normalizeSize(58)} height={normalizeSize(58)} />
          </TouchableOpacity>
        </View>

        {/* ===== 시간대별 스와이퍼 ===== */}
        <View style={styles.bottomPanel}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hourlyList}
          >
            {hourly.map((h, idx) => {
              const active = idx === selectedIdx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.hourCard,
                    active ? styles.hourCardActive : styles.hourCardInactive,
                  ]}
                  onPress={() => onSelectHour(idx)}
                  activeOpacity={0.9}
                >
                  {/* 시간대 라벨 */}
                  <Text
                    style={[
                      styles.hourLabel,
                      active ? styles.hourLabelActive : styles.hourLabelInactive,
                    ]}
                  >
                    {h.label}
                  </Text>
                  {/* 날씨 아이콘 */}
                  {getIcon(h.condition, normalizeSize(30), normalizeSize(24))}
                  {/* 기온 */}
                  <Text
                    style={[
                      styles.hourTemp,
                      active ? styles.hourTempActive : styles.hourTempInactive,
                    ]}
                  >
                    {h.temp}°
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ===== 옷차림 모달 ===== */}
        <OutfitModal visible={outfitVisible} onClose={() => setOutfitVisible(false)} />
      </View>
    </SafeAreaView>
  );
}

// styles
import { homeStyles as styles } from "../styles/HomeScreen.styles";