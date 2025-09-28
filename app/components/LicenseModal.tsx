import React from 'react';
import { 
    View, Text, StyleSheet, ScrollView, 
    TouchableOpacity, Modal, Alert, Button, 
    SafeAreaView
} from 'react-native'; 
import rawLicenses from '../../assets/jsons/license-data.json';

interface LicenseModalProps {
  isVisible: boolean;   // 모달 열림 여부
  onClose: () => void;  // 모달 닫기 함수
}

const LicenseModal: React.FC<LicenseModalProps> = ({ isVisible, onClose }) => { 

  // JSON 객체를 배열로 변환
  // Object.entries() 사용, key는 "패키지명@버전", value는 라이선스 정보 객체
  const licenses = Object.entries(rawLicenses).map(([key, value]: [string, any]) => ({
    name: key,
    license: value.licenses ?? 'N/A',
    repository: value.repository ?? value.url ?? '없음',
    publisher: value.publisher ?? '없음',
    email: value.email ?? '없음',
    licenseText: value.licenseFile ?? '라이선스 파일 없음'
  }));

  // 각 라이선스 클릭 시 상세 Alert 표시
  const handleLicensePress = (licenseItem: any) => {
    Alert.alert(
      licenseItem.name,
      `라이선스: ${licenseItem.license}\n` +
      `출처: ${licenseItem.repository}\n` +
      `발행자: ${licenseItem.publisher}\n` +
      `Email: ${licenseItem.email}\n` +
      `파일: ${licenseItem.licenseText}`,
      [{ text: "확인" }]
    );
  };

  // 데이터 유효성 확인
  const isValidLicenses = Array.isArray(licenses) && licenses.length > 0;

  return (
    <Modal
      animationType="slide"   // 모달 열릴 때 슬라이드 애니메이션
      transparent={false}     // 배경 투명 여부
      visible={isVisible}     // 모달 표시 여부
      onRequestClose={onClose} // Android 뒤로가기 버튼 동작
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>오픈소스 라이선스</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>

          {isValidLicenses ? (
              // ScrollView로 라이선스 리스트 렌더링
              <ScrollView style={styles.listContainer}>
                  {licenses.map((item: any, index: number) => (
                      <TouchableOpacity 
                          key={index} 
                          style={styles.licenseItem} 
                          onPress={() => handleLicensePress(item)} // 클릭 시 상세 Alert
                      >
                          <Text style={styles.name}>{item.name}</Text>
                          <Text style={styles.version}>{item.license}</Text>
                      </TouchableOpacity>
                  ))}
              </ScrollView>
          ) : (
              // 데이터 없을 때
              <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>데이터가 없습니다.</Text>
              </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};


// styles
import { licenseModalStyles as styles } from '../styles/LicenseModal.styles';

export default LicenseModal;

