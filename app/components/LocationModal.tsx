import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ClearIcon from "../../assets/images/close.svg";  
import SearchIcon from "../../assets/images/search.svg";  

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function LocationModal({ visible, onClose }: Props) {
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState("");        // 입력값
  const [results, setResults] = useState<any[]>([]); // 검색 결과

  const { kakaoApiUrl, kakaoApiKey } = Constants.expoConfig?.extra ?? {};
  const insets = useSafeAreaInsets();

  const searchAddress = async () => {
    if (!query) return;

    try {
      const response = await fetch(
        `${kakaoApiUrl}?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `KakaoAK ${kakaoApiKey}`, // 👉 REST API 키 입력
          },
        }
      );

      const data = await response.json();
      console.log(data);

      if (data.documents) {
        setResults(data.documents);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      presentationStyle="fullScreen" // 👈 SafeArea 정상 적용됨
    >
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={['bottom', 'left', 'right']}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>위치 설정</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.iconLeft}>
            <TouchableOpacity
              onPress={() => {
                if (query.length > 0) searchAddress();
              }}
              activeOpacity={query.length > 0 ? 0.7 : 1}
            >
              <SearchIcon
                width={18}
                height={18}
                fill={query.length > 0 ? "#333" : "#ccc"}
              />
            </TouchableOpacity>
          </View>

          <TextInput
            ref={inputRef}
            style={styles.search}
            placeholder="지역(구/동)을 입력해주세요."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={searchAddress}
          />

          {query.length > 0 && (
            <View style={styles.iconRight}>
              <TouchableOpacity onPress={() => setQuery("")}>
                <ClearIcon width={18} height={18} fill="#999" />
              </TouchableOpacity>
            </View>
          )}
        </View>


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
