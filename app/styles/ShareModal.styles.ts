import { StyleSheet } from "react-native";

export const shareModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 20 },
  previewImage: { width: "100%", height: 400, borderRadius: 10, marginBottom: 20 },
  kakaoBtn: {
    backgroundColor: "#FEE500",
    borderRadius: 8,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  kakaoText: { fontWeight: "600", color: "#3C1E1E" },
  imageBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  imageText: { fontWeight: "600", color: "#333" },
});
