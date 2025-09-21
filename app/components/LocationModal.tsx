import React, { useEffect, useRef } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function LocationModal({ visible, onClose }: Props) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}   // ✅ 풀스크린 모달
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>위치 설정</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* 검색창 */}
        <TextInput
          ref={inputRef}
          style={styles.search}
          placeholder="지역(구/동)을 입력해주세요."
          placeholderTextColor="#999"
        />

        {/* 스크롤 리스트 */}
        <ScrollView contentContainerStyle={styles.list}>
          <TouchableOpacity style={styles.item}>
            <Text>📍 현재 위치</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text>하남시 미사1동</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text>서울시 반포동</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text>부산시 범일동</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  search: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    margin: 20,
  },
  list: { paddingBottom: 40 },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
