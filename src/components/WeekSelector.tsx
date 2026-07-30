import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getPreviousWeek, getNextWeek, formatWeekLabel } from '../utils/weekHelper';

interface WeekSelectorProps {
  currentWeekStart: Date;
  onWeekChange: (newWeekStart: Date) => void;
}

export default function WeekSelector({ currentWeekStart, onWeekChange }: WeekSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrow}
        onPress={() => onWeekChange(getPreviousWeek(currentWeekStart))}
      >
        <Text style={styles.arrowText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.label}>{formatWeekLabel(currentWeekStart)}</Text>
      <TouchableOpacity
        style={styles.arrow}
        onPress={() => onWeekChange(getNextWeek(currentWeekStart))}
      >
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  arrow: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  arrowText: {
    fontSize: 24,
    color: '#333',
    fontWeight: '300',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
});
