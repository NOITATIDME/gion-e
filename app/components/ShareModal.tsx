// ShareModal.tsx
import React, { useRef, useState } from "react";
import { View, Modal, Image, TouchableOpacity, Text } from "react-native";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { shareModalStyles as styles } from "../styles/ShareModal.styles";
// import { sendKakaoLink } from "./utils/kakaoShare"; // 카카오톡 공유 유틸

type Props = {
  visible: boolean;
  onClose: () => void;
  imageUri: string | null;   // ✅ props 타입에 포함
};


export default function ShareModal({ visible, onClose, imageUri /*, homeRef*/ }: Props) {
  const [captureUri, setCaptureUri] = useState<string | null>(null);

//   const handleCapture = async () => {
//     if (homeRef.current) {
//       const uri = await homeRef.current.capture();
//       setCaptureUri(uri);
//     }
//   };

  const shareAsImage = async () => {
    if (imageUri) {  // ✅ 이제 정상 작동
      await Sharing.shareAsync(imageUri);
    }
  };


//   const handleKakaoShare = async () => {
//     if (!captureUri) return;
//     await sendKakaoLink(captureUri);
//   };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      {/* 미리보기 */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: "100%", height: 400 }} />
      ) : (
        <Text>이미지 없음</Text>
      )}
    </Modal>
  );
}
