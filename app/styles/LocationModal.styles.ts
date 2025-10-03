import { StyleSheet } from "react-native";

export const locationModalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "600" },
  close: { fontSize: 20, color: "#333" },

  list: { paddingBottom: 40 },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

searchRow: {
  flexDirection: "row",
  alignItems: "center",
  marginHorizontal: 20,
  marginVertical: 10,
},

searchWrapper: {
  flexDirection: "row",
  alignItems: "center",   // ✅ 세로 중앙 정렬 핵심
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  marginHorizontal: 20,
  marginVertical: 10,
  paddingHorizontal: 8,
  height: 44,             // 높이 고정
},

search: {
  flex: 1,
  fontSize: 16,
  paddingVertical: 0,     // 세로 padding 제거
},

iconLeft: {
  justifyContent: "center",
  alignItems: "center",
  marginRight: 8,
},

iconRight: {
  justifyContent: "center",
  alignItems: "center",
  marginLeft: 8,
},

itemRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 15,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},
itemText: {
  fontSize: 16,
  color: "#333",
  flex: 1,          // ✅ 텍스트가 밀려도 남을 수 있도록
  marginRight: 10,
},

});
