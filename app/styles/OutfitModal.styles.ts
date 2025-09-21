import { StyleSheet } from 'react-native';

export const outfitModalStyles = StyleSheet.create({
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

    card: {
        borderWidth: 1.5,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
        overflow: 'hidden',

        // ✅ 최신 boxShadow 사용
        boxShadow: '0px 3px 6px rgba(0,0,0,0.12)',
    },

    cardHeader: { padding: 12, alignItems: 'center' },
    cardTitle: { fontSize: 18, fontWeight: '700' },
    subtitleRow: { flexDirection: 'row', marginTop: 6 },
    subtitle: {
        backgroundColor: '#fff1f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        fontSize: 14,
        marginHorizontal: 4,
    },
    table: { borderTopWidth: 1, borderColor: '#eee' },
    tableRow: { flexDirection: 'row' },
    tableHeader: { justifyContent: 'space-between', padding: 8 },
    tableHeaderText: { color: '#fff', fontWeight: '600', flex: 1, textAlign: 'center' },
    cell: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 8,
        fontSize: 14,
        borderTopWidth: 1,
        borderColor: '#f0f0f0',
    },
});
