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
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color }]}>{title}</Text>
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

// styles
import { outfitModalStyles as styles } from '../styles/OutfitModal.styles';

