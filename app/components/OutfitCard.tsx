import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OutfitCardProps {
  title: string;
  subtitle: string[];
  tops: string[];
  bottoms: string[];
  color?: string;
}

export default function OutfitCard({ title, subtitle, tops, bottoms, color = '#FF4D4F' }: OutfitCardProps) {
  return (
    <View style={[styles.card, { borderColor: color }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={[styles.title, { color }]}>{title}</Text>
        <View style={styles.subtitleRow}>
          {subtitle.map((txt, idx) => (
            <Text key={idx} style={styles.subtitle}>{txt}</Text>
          ))}
        </View>
      </View>

      {/* 표 */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: color }]}>
          <Text style={styles.tableHeaderText}>상의</Text>
          <Text style={styles.tableHeaderText}>하의</Text>
        </View>
        {Array.from({ length: Math.max(tops.length, bottoms.length) }).map((_, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.cell}>{tops[idx] || ''}</Text>
            <Text style={styles.cell}>{bottoms[idx] || ''}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',

    // ✅ 최신 boxShadow 사용
    boxShadow: '0px 3px 6px rgba(0,0,0,0.12)',
  },
  header: { padding: 12, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
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
