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
      transparent={false}
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

// styles
import { locationModalStyles as styles } from '../styles/LocationModal.styles';
