import { StyleSheet } from 'react-native';

export const licenseModalStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: { 
        fontSize: 18,
        flex: 1, 
        fontWeight: '600',
        // 💡 핵심: 텍스트 자체를 가운데 정렬합니다.
        textAlign: 'center' 
    },
    icon: {marginRight: 8,},    
    close: { fontSize: 20, color: '#333' },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: '#fff' },
    listContainer: { flex: 1, marginTop: 10 },
    licenseItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    name: { fontSize: 16, fontWeight: '600' },
    version: { fontSize: 12, color: '#666' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
});

