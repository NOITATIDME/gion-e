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
import { outfitData } from '../data/outfitData';

type Props = {
  visible: boolean;
  onClose: () => void;
  currentTemp?: number; // 현재 온도 (부모에서 넘겨주기)
};

export default function OutfitModal({ visible, onClose, currentTemp = 9 }: Props) {
  const listRef = useRef<FlatList>(null);

  // 현재 온도에 해당하는 index 찾기
  const targetIndex = outfitData.findIndex(d => currentTemp >= d.min && currentTemp <= d.max);

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
          data={outfitData}
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

// styles
import { outfitModalStyles as styles } from '../styles/OutfitModal.styles';
