import { StyleSheet } from 'react-native';

export const dailyForecastStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    location: { fontSize: 16, fontWeight: '500' },
    title: { fontSize: 18, fontWeight: '600' },
    close: { fontSize: 20, color: '#333' },

    summaryBox: {
        borderWidth: 1,
        borderColor: '#b5e0b7',
        backgroundColor: '#f6fff6',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    summaryText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    tipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tipBadge: {
        backgroundColor: '#fff',
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 12,
    },

    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
    },
    th: { flex: 1, textAlign: 'center', fontWeight: '600' },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    rowActive: { backgroundColor: '#f5f5f5' },
    td: { flex: 1, textAlign: 'center' },

    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    footerText: { fontSize: 14, fontWeight: '500' },
    subtitle: { fontSize: 16 },
    tableHeaderText: { fontWeight: 'bold' },
    cell: { fontSize: 14 },
});