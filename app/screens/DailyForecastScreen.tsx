import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import {
    DailyWeather,
    fetchDailyWeatherCombined,
} from "../api/DailyWeatherService";

// 라이선스 Modal Import
import LicenseModal from "../components/LicenseModal";
import LicenseIcon from "../../assets/images/LicenseIcon.svg";

type Props = {
    route: {
        params: {
            location: string;
            dailyData: DailyWeather[];
        };
    };
};

export default function DailyForecastScreen({ route }: Props) {
    const { location, dailyData: routeDailyData } = route.params;
    const [dailyData, setDailyData] = useState<DailyWeather[]>(routeDailyData || []);
    const [selectedIdx, setSelectedIdx] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    // === 데이터 로드 ===
    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await fetchDailyWeatherCombined();
            setDailyData(data);
            setLoading(false);
        })();
    }, []);

    // === 온도별 색상 매핑 ===
    const getTempColor = (temp: number) => {
        if (temp >= 28) return "#FF4C4C"; // 빨강
        if (temp >= 23 && temp <= 27) return "#FF884C"; // 주황
        if (temp >= 20 && temp <= 22) return "#FFD700"; // 노랑
        if (temp >= 17 && temp <= 19) return "#2ECC71"; // 초록
        if (temp >= 12 && temp <= 16) return "#1E90FF"; // 파랑
        if (temp >= 5 && temp <= 11) return "#4169E1"; // 진파랑
        return "#555"; // 4 이하 회색
    };

    // === 날짜 표시 변환 ===
    const formatDateLabel = (idx: number, rawDate: string) => {
        const today = new Date();
        const target = new Date();
        target.setDate(today.getDate() + idx);
        const month = target.getMonth() + 1;
        const day = target.getDate();
        const weekNames = ["일", "월", "화", "수", "목", "금", "토"];
        const week = weekNames[target.getDay()];

        if (idx === 0) return "오늘";
        if (idx === 1) return "내일";
        if (idx === 2) return "모레";
        return `${week} ${month}.${day}`;
    };

    // YYYYMMDD → "10월 03일(금)" 변환
    function formatDateWithDay(yyyymmdd: string) {
        const y = parseInt(yyyymmdd.slice(0, 4), 10);
        const m = parseInt(yyyymmdd.slice(4, 6), 10);
        const d = parseInt(yyyymmdd.slice(6, 8), 10);
        const dateObj = new Date(y, m - 1, d);
        const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
        const dayName = dayNames[dateObj.getDay()];
        return `${m}월 ${d}일(${dayName})`;
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text>날씨 데이터를 불러오는 중...</Text>
            </View>
        );
    }

    if (dailyData.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Text>날씨 데이터를 가져올 수 없습니다.</Text>
            </View>
        );
    }

    const selectedData = dailyData[selectedIdx];
    const clickDate = selectedData.date;
    const avgTemp = ((selectedData.min + selectedData.max) / 2).toFixed(1);
    const dynamicColor = getTempColor(selectedData.max);
    const comments = ["쌀쌀해요 🧥", "가벼운 외투가 필요해요 🏠"];

    // 라이선스 고지 모달 State 정의
    const [isLicenseModalVisible, setIsLicenseModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            {/* === 상단 카드 === */}
            <View style={[styles.card, { borderColor: dynamicColor }]}>
                {/* 상단 날짜/평균 */}
                <Text style={[styles.cardTitle, { color: dynamicColor }]}>
                    {formatDateWithDay(clickDate)} 평균 {avgTemp}℃
                </Text>

                {/* 안내 문구 */}
                <View style={styles.commentRow}>
                    {comments.map((c, i) => (
                        <Text
                            key={i}
                            style={[
                                styles.comment,
                                { borderColor: dynamicColor, color: dynamicColor },
                            ]}
                        >
                            {c}
                        </Text>
                    ))}
                </View>

                {/* 테이블 헤더 */}
                <View
                    style={[styles.tableHeader, { backgroundColor: dynamicColor + "22" }]}
                >
                    <Text style={[styles.tableHeaderText, { color: dynamicColor }]}>
                        날짜
                    </Text>
                    <Text style={[styles.tableHeaderText, { color: dynamicColor }]}>
                        날씨
                    </Text>
                    <Text style={[styles.tableHeaderText, { color: dynamicColor }]}>
                        최저
                    </Text>
                    <Text style={[styles.tableHeaderText, { color: dynamicColor }]}>
                        최고
                    </Text>
                </View>

                {/* 테이블 바디 */}
                <ScrollView>
                    {dailyData.map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => setSelectedIdx(idx)}
                            style={[styles.row, selectedIdx === idx && styles.rowActive]}
                        >
                            {/* 날짜 */}
                            <View style={styles.cell}>
                                <Text style={styles.dateText}>
                                    {formatDateLabel(idx, item.date)}
                                </Text>
                            </View>

                            {/* 날씨 아이콘 */}
                            <View style={styles.cell}>
                                <Text style={styles.icon}>
                                    {item.condition === "sunny"
                                        ? "☀️"
                                        : item.condition === "cloudy"
                                            ? "☁️"
                                            : item.condition === "rain"
                                                ? "🌧️"
                                                : item.condition === "snow"
                                                    ? "❄️"
                                                    : "🌙"}
                                </Text>
                            </View>

                            {/* 최저 */}
                            <View style={styles.cell}>
                                <Text
                                    style={{
                                        color: getTempColor(item.min),
                                        fontWeight: "600",
                                    }}
                                >
                                    {item.min}°
                                </Text>
                                <Text style={styles.clothes}>{item.minClothes || "반팔티"}</Text>
                            </View>

                            {/* 최고 */}
                            <View style={styles.cell}>
                                <Text
                                    style={{
                                        color: getTempColor(item.max),
                                        fontWeight: "600",
                                    }}
                                >
                                    {item.max}°
                                </Text>
                                <Text style={styles.clothes}>{item.maxClothes || "민소매"}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* === 라이선스고지 === */}
            <View>
                <TouchableOpacity style={styles.licenseButton} onPress={() => setIsLicenseModalVisible(true)}>
                    <LicenseIcon width={24} height={24} />
                    <Text style={styles.licenseButtonText}>오픈소스 라이선스</Text>
                </TouchableOpacity>
            </View>

            <LicenseModal
                isVisible={isLicenseModalVisible}
                onClose={() => setIsLicenseModalVisible(false)}
            />
        </View>
    );
}

// === 스타일 ===
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 10,
        padding: 12,
        backgroundColor: "#fff",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        textAlign: "center",
    },
    commentRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 12,
    },
    comment: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        fontSize: 13,
        fontWeight: "500",
        borderWidth: 1,
        marginHorizontal: 4,
    },
    tableHeader: {
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    tableHeaderText: {
        flex: 1,
        textAlign: "center",
        fontWeight: "700",
    },
    row: {
        flexDirection: "row",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    rowActive: {
        backgroundColor: "#f9f9f9",
    },
    cell: {
        flex: 1,
        alignItems: "center",
    },
    dateText: {
        fontSize: 13,
        color: "#333",
    },
    icon: {
        fontSize: 18,
    },
    clothes: {
        fontSize: 12,
        color: "#888",
    },
    // 라이선스 버튼
    licenseButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        backgroundColor: "#fff",
        borderRadius: 8,
        width: "100%",
    },
    licenseButtonText: {
        fontSize: 16,
        color: "#999",
        fontWeight: "500",
        marginLeft: 8,
    },
    footer: {
        padding: 20,
        alignItems: "center",
    },
    footerText: {
        fontSize: 12,
        color: "#999",
    },
});
