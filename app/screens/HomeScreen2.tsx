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
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { homeStyles as styles } from "../styles/HomeScreen.styles";

// === expo-video 최신 API ===
import { VideoView, useVideoPlayer } from "expo-video";

// === 모달 ===
import LocationModal from "../components/LocationModal";
import OutfitModal from "../components/OutfitModal";

// === SVG 날씨 아이콘 ===
import Weather1 from "../../assets/images/weather1.svg"; // sunny
import Weather2 from "../../assets/images/weather2.svg"; // cloudy
import Weather3 from "../../assets/images/weather6.svg"; // rain
import Weather4 from "../../assets/images/weather4.svg"; // night
import Weather5 from "../../assets/images/weather5.svg"; // partly
import Weather6 from "../../assets/images/weather6.svg"; // default

// === 액션 아이콘 ===
import Icon1 from "../../assets/images/icon2.svg";
import Icon2 from "../../assets/images/icon1.svg";
import Link from "../../assets/images/link.svg";

// === 날씨 API 서비스 ===
import { fetchWeatherData } from "../api/weatherService";

// =============================
// 타입 및 매핑
// =============================
type TimeOfDay = "morning" | "afternoon" | "night";

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

// 시간대 판별
const getTimeOfDay = (hour: number = new Date().getHours()): TimeOfDay => {
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    return "night";
};

// 시간대별 비디오 배경 (mp4)
const timeAssets: Record<TimeOfDay, any> = {
    morning: {
        uri: "https://drive.google.com/uc?export=download&id=1JVkJWb6_T8NUEF-BuMHZqQaM_cSBSbkI",
    },
    afternoon: {
        uri: "https://drive.google.com/uc?export=download&id=1JVkJWb6_T8NUEF-BuMHZqQaM_cSBSbkI",
    },
    night: {
        uri: "https://drive.google.com/uc?export=download&id=1JVkJWb6_T8NUEF-BuMHZqQaM_cSBSbkI",
    },
};

// =============================
// 반응형 유틸
// =============================
const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

const normalizeSize = (size: number) => {
    const scaleFactor = Math.min(width / 375, height / 812);
    if (width < 350) return size * 0.8;
    if (isTablet) return size * 1.1;
    return size * scaleFactor;
};

// =============================
// HomeScreen
// =============================
export default function HomeScreen() {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const [location, setLocation] = useState("내 위치"); // 위치명 (기본값)
    const [current, setCurrent] = useState({ temp: 0, condition: "sunny" });
    const [hiLo, setHiLo] = useState({ low: 0, high: 0 });
    const [hourly, setHourly] = useState<any[]>([]);
    const [daily, setDaily] = useState<Record<string, { low: number; high: number }>>({});
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [loading, setLoading] = useState(true);

    // 안내 문구
    const tipText = useMemo(() => {
        const t = current.temp;
        if (t >= 33) return "🔥 매우 더워요! 수분 보충 & 최대한 실내에서 지내요.";
        if (t >= 28) return "점심시간 더위 조심해요 🧃 얇은 옷차림으로 쾌적하게!";
        if (t >= 23) return "선선해요 🙂 가벼운 겉옷 하나 챙기면 딱 좋아요.";
        if (t >= 18) return "조금 쌀쌀합니다 🧥 얇은 자켓 추천!";
        return "쌀쌀해요 🧊 따뜻한 아우터를 꼭 챙기세요.";
    }, [current.temp]);

    // 시간 선택 시 데이터 변경
    const onSelectHour = (idx: number) => {
        setSelectedIdx(idx);
        const h = hourly[idx];
        setCurrent({ temp: h.temp, condition: h.condition });
        if (daily[h.date]) {
            setHiLo(daily[h.date]);
        }
    };

    // === 현재 시간을 가장 가까운 3시간 단위로 보정 ===
    const getClosestIndex = (hourlyData: any[]) => {
        if (!hourlyData || hourlyData.length === 0) return 0;
        const now = new Date();
        const currentHour = now.getHours();
        const roundedHour = Math.round(currentHour / 3) * 3;

        let closestIdx = 0;
        let minDiff = Infinity;
        hourlyData.forEach((h, idx) => {
            const diff = Math.abs(h.hour - roundedHour);
            if (diff < minDiff) {
                minDiff = diff;
                closestIdx = idx;
            }
        });
        return closestIdx;
    };

    // 현재 시간대 자산 결정
    const timeOfDay = getTimeOfDay(hourly[selectedIdx]?.hour);

    // === expo-video player 설정 ===
    const player = useVideoPlayer(timeAssets[timeOfDay], (p) => {
        p.muted = true;
        p.loop = true;
    });

    useEffect(() => {
        if (player) {
            player.play();
        }
    }, [player]);

    // 모달 상태
    const [modalVisible, setModalVisible] = useState(false);
    const [outfitVisible, setOutfitVisible] = useState(false);

    // === 날씨 데이터 가져오기 ===
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { hourly, daily } = await fetchWeatherData();

                if (hourly.length > 0) {
                    setHourly(hourly);
                    setDaily(daily);

                    // 3시간 단위 보정된 인덱스 찾기
                    const idx = getClosestIndex(hourly);
                    setSelectedIdx(idx);

                    const h = hourly[idx];
                    setCurrent({ temp: h.temp, condition: h.condition });
                    setHiLo(daily[h.date]);
                }
            } catch (err) {
                Alert.alert("날씨 데이터를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={{ color: "#fff", marginTop: 10 }}>날씨 데이터를 불러오는 중...</Text>
                </View>
            </SafeAreaView>
        );
    }

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
                        source={require("../../assets/images/character.png")}
                        style={styles.character}
                        resizeMode="contain"
                    />
                </View>

                {/* ===== 상단 헤더 ===== */}
                <View style={styles.topHero}>
                    <View style={styles.topRow}>
                        <TouchableOpacity style={styles.locationWrapper} onPress={() => setModalVisible(true)}>
                            <Text style={styles.locationText}>{location}</Text>
                            <Text style={styles.locationArrow}>›</Text>
                        </TouchableOpacity>

                        {/* 공유 버튼 */}
                        <TouchableOpacity onPress={() => Alert.alert("공유", "공유 기능")}>
                            <Link width={normalizeSize(21)} height={normalizeSize(23)} style={styles.headerIcon} />
                        </TouchableOpacity>
                    </View>

                    {/* 위치 모달 */}
                    <LocationModal visible={modalVisible} onClose={() => setModalVisible(false)} />

                    {/* 현재 온도 */}
                    <View style={styles.tempArea}>
                        <View style={styles.tempRow}>
                            {getIcon(current.condition, normalizeSize(50), normalizeSize(50))}
                            <Text style={styles.nowTemp}>{current.temp}°</Text>
                        </View>
                        <Text style={styles.hilo}>
                            <Text style={styles.low}>{hiLo.low}°</Text> <Text style={styles.high}>{hiLo.high}°</Text>
                        </Text>
                    </View>
                </View>

                {/* 안내 문구 */}
                <View style={styles.tipBubble}>
                    <Text style={styles.tipText}>{tipText}</Text>
                </View>

                {/* 버튼 영역 */}
                <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => setOutfitVisible(true)}>
                        <Icon1 width={normalizeSize(58)} height={normalizeSize(58)} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("DailyForecast", {
                                location: location,
                                dailyData: hourly.slice(0, 5).map((h) => ({
                                    date: h.label,
                                    min: h.low,
                                    max: h.high,
                                    condition: h.condition,
                                })),
                            })
                        }
                    >
                        <Icon2 width={normalizeSize(58)} height={normalizeSize(58)} />
                    </TouchableOpacity>
                </View>

                {/* 시간대별 스와이퍼 */}
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
                                    style={[styles.hourCard, active ? styles.hourCardActive : styles.hourCardInactive]}
                                    onPress={() => onSelectHour(idx)}
                                    activeOpacity={0.9}
                                >
                                    <Text
                                        style={[
                                            styles.hourLabel,
                                            active ? styles.hourLabelActive : styles.hourLabelInactive,
                                        ]}
                                    >
                                        {h.label}
                                    </Text>
                                    {getIcon(h.condition, normalizeSize(30), normalizeSize(24))}
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

                {/* 옷차림 모달 */}
                <OutfitModal visible={outfitVisible} onClose={() => setOutfitVisible(false)} />
            </View>
        </SafeAreaView>
    );
}
 