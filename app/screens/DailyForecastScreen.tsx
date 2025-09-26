import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';

//라이선스 Modal Import
import LicenseModal from '../components/LicenseModal'
import LicenseIcon from '../../assets/images/LicenseIcon.svg'

export type DailyWeather = {
    date: string;
    min: number;
    max: number;
    condition: string;
    minClothes?: string;
    maxClothes?: string;
};

type Props = {
    route: {
        params: {
            location: string;
            dailyData: DailyWeather[];
        };
    };
};

export default function DailyForecastScreen({ route }: Props) {
    const { location, dailyData } = route.params;
    const [selectedIdx, setSelectedIdx] = useState<number>(0);

    // === 온도별 색상 매핑 ===
    const getTempColor = (temp: number) => {
        if (temp >= 28) return '#FF0000'; // 빨강
        if (temp >= 23 && temp <= 27) return '#FAEBD7'; // 상아색
        if (temp >= 20 && temp <= 22) return '#FFD700'; // 노랑
        if (temp >= 17 && temp <= 19) return '#2ECC71'; // 초록
        if (temp >= 12 && temp <= 16) return '#87CEEB'; // 하늘색
        if (temp >= 9 && temp <= 11) return '#0000FF'; // 파랑
        if (temp >= 5 && temp <= 8) return '#000080'; // 남색
        return '#808080'; // 4 이하 회색
    };

    const selectedData = dailyData[selectedIdx];
    const avgTemp = ((selectedData.min + selectedData.max) / 2).toFixed(1);
    const dynamicColor = getTempColor(selectedData.max);

    const comments = ['쌀쌀해요 🧥', '가벼운 외투가 필요해요 🏠'];

    // 라이선스 고지 모달 State 정의
    const [isLicenseModalVisible, setIsLicenseModalVisible] = useState(false);

    // 모달을 열고 닫는 함수
    const openLicenseModal = () => setIsLicenseModalVisible(true);
    const closeLicenseModal = () => setIsLicenseModalVisible(false);
    
    return (
        <View style={styles.container}>
            {/* === 전체 카드 === */}
            <View style={[styles.card, { borderColor: dynamicColor }]}>
                {/* 상단 - 날짜/평균 */}
                <Text style={[styles.cardTitle, { color: dynamicColor }]}>
                    {selectedData.date} 평균 {avgTemp}℃
                </Text>

                {/* 안내 문구 */}
                <View style={styles.commentRow}>
                    {comments.map((c, i) => (
                        <Text
                            key={i}
                            style={[styles.comment, { borderColor: dynamicColor }]}
                        >
                            {c}
                        </Text>
                    ))}
                </View>

                {/* 테이블 헤더 */}
                <View
                    style={[styles.tableHeader, { backgroundColor: dynamicColor + '22' }]} // 연한색
                >
                    <Text style={[styles.tableHeaderText, { color: dynamicColor }]}>
                        날짜
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
                            style={[
                                styles.row,
                                selectedIdx === idx && styles.rowActive,
                            ]}
                        >
                            {/* 날짜 + 아이콘 */}
                            <View style={styles.cell}>
                                <Text>{item.date}</Text>
                                <Text>
                                    {item.condition === 'sunny'
                                        ? '☀️'
                                        : item.condition === 'cloudy'
                                            ? '☁️'
                                            : item.condition === 'rain'
                                                ? '🌧️'
                                                : '🌙'}
                                </Text>
                            </View>

                            {/* 최저 */}
                            <View style={styles.cell}>
                                <Text style={{ color: getTempColor(item.min) }}>
                                    {item.min}°
                                </Text>
                                <Text style={styles.clothes}>
                                    {item.minClothes || '반팔티'}
                                </Text>
                            </View>

                            {/* 최고 */}
                            <View style={styles.cell}>
                                <Text style={{ color: getTempColor(item.max) }}>
                                    {item.max}°
                                </Text>
                                <Text style={styles.clothes}>
                                    {item.maxClothes || '민소매'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            {/* === 라이선스고지  === */}
            <View>
                <TouchableOpacity style={styles.licenseButton} onPress={openLicenseModal}>
                    <LicenseIcon width={24} height={24} />
                    <Text style={styles.licenseButtonText}>오픈소스 라이선스</Text>
                </TouchableOpacity>
            </View>

            {/* <LicenseModal visible={licenseModalVisible} onClose={closeLicenseModal} /> */}
            <LicenseModal 
                isVisible={isLicenseModalVisible} // 현재 상태를 모달에 전달
                onClose={closeLicenseModal}      // 닫기 함수를 모달에 전달
            />
        </View>
    );
}

// === 스타일 ===
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 12 },

    // 큰 카드
    card: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
    },

    // 상단
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    commentRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    comment: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        fontSize: 13,
        fontWeight: '500',
        borderWidth: 1,
    },

    // 테이블
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    tableHeaderText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '700',
    },

    row: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    rowActive: { backgroundColor: '#f9f9f9' },

    cell: { flex: 1, alignItems: 'center' },
    clothes: { fontSize: 12, color: '#888' },

    // 라이선스 버튼
 licenseButton: {
        flexDirection: 'row',       // 아이콘 + 텍스트 한 줄
        justifyContent: 'center',   // 전체 가운데 정렬
        alignItems: 'center',       // 수직 가운데
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
        borderRadius: 8,
        width: '100%',
    },

    licenseButtonText: {
        fontSize: 16,
        color: '#999',
        fontWeight: '500',
        marginLeft: 8,              // 아이콘과 텍스트 간격
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#999',
    },
});
