import React, { useEffect, useRef } from 'react';
import {
  Modal,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import OutfitCard from './OutfitCard';

type Props = {
  visible: boolean;
  onClose: () => void;
  currentTemp?: number; // ✅ 현재 온도 (부모에서 넘겨주기)
};

const data = [
  {
    title: '28°C 이상',
    min: 28,
    max: 999,
    subtitle: ['더워요 🥵', '땀나요 💦'],
    tops: ['민소매', '반팔티', '민소매 원피스', '린넨 소재'],
    bottoms: ['반바지', '짧은 치마'],
    color: '#FF6B6B',
  },
  {
    title: '23~27°C',
    min: 23,
    max: 27,
    subtitle: ['따뜻해요 😊', '얇은 티셔츠 👕'],
    tops: ['반팔', '얇은 셔츠', '린넨 셔츠'],
    bottoms: ['슬랙스', '면바지', '반바지'],
    color: '#FFAB8E',
  },
  {
    title: '20~22°C',
    min: 20,
    max: 22,
    subtitle: ['선선해요 🤝', '가벼워요 ✔️'],
    tops: ['긴팔 티셔츠', '셔츠', '가디건', '맨투맨', '후드티'],
    bottoms: ['면바지', '슬랙스', '청바지'],
    color: '#FFD58C',
  },
  {
    title: '17~19°C',
    min: 17,
    max: 19,
    subtitle: ['살짝 쌀쌀해요 🍂', '가벼운 자켓이 필요해요 🧥'],
    tops: ['얇은 니트', '맨투맨', '후드티', '가디건', '청자켓', '야상', '점퍼'],
    bottoms: ['청바지', '슬랙스', '면바지'],
    color: '#B8E994',
  },
  {
    title: '12~16°C',
    min: 12,
    max: 16,
    subtitle: ['조금 쌀쌀해요 🍃', '겹쳐 입기 좋아요 👌'],
    tops: ['셔츠', '니트', '맨투맨', '후드티', '자켓', '트렌치코트'],
    bottoms: ['청바지', '슬랙스', '면바지'],
    color: '#8FCACA',
  },
  {
    title: '9~11°C',
    min: 9,
    max: 11,
    subtitle: ['가을 느낌이에요 🍁', '코트 추천드려요 🧥'],
    tops: ['자켓', '야상', '트렌치코트', '니트', '가디건'],
    bottoms: ['청바지', '슬랙스', '면바지'],
    color: '#6FCADA',
  },
  {
    title: '5~8°C',
    min: 5,
    max: 8,
    subtitle: ['꽤나 춥네요 ❄️', '코트와 경량패딩 필요해요 🧥'],
    tops: ['자켓', '야상', '트렌치코트', '니트', '가디건', '코트', '가죽자켓'],
    bottoms: ['청바지', '슬랙스', '면바지'],
    color: '#6093D0',
  },
  {
    title: '4°C 이하',
    min: -50,
    max: 4,
    subtitle: ['매우 추워요 🥶', '방한용품 필수! 🧣'],
    tops: ['패딩', '두꺼운 코트', '목폴라', '기모 제품'],
    bottoms: ['기모 청바지', '두꺼운 바지'],
    color: '#4A6FA5',
  },
];

export default function OutfitModal({ visible, onClose, currentTemp = 9 }: Props) {
  const listRef = useRef<FlatList>(null);

  // 현재 온도에 해당하는 index 찾기
  const targetIndex = data.findIndex(d => currentTemp >= d.min && currentTemp <= d.max);

  useEffect(() => {
    if (visible && targetIndex >= 0 && listRef.current) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({ index: targetIndex, animated: true });
      }, 300); // 모달 애니메이션 끝난 뒤 실행
    }
  }, [visible, targetIndex]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safe}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>기온별 옷차림 추천</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* 리스트 */}
        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <OutfitCard
              title={item.title}
              subtitle={item.subtitle}
              tops={item.tops}
              bottoms={item.bottoms}
              color={item.color}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator
          initialScrollIndex={targetIndex >= 0 ? targetIndex : 0} // 초기 위치
          getItemLayout={(_, index) => ({
            length: 200, // 카드 높이 대략값 (OutfitCard 높이 맞게 수정 필요)
            offset: 280 * index,
            index,
          })}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: '600' },
  close: { fontSize: 20, color: '#333' },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});