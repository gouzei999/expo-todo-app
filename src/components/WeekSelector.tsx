import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  getPreviousWeek,
  getNextWeek,
  getWeekEnd,
  formatDate,
  getCurrentWeekStart,
} from '../utils/weekHelper';

interface WeekSelectorProps {
  currentWeekStart: Date;
  onWeekChange: (newWeekStart: Date) => void;
}

function isSameWeek(a: Date, b: Date): boolean {
  return formatDate(a) === formatDate(b);
}

export default function WeekSelector({ currentWeekStart, onWeekChange }: WeekSelectorProps) {
  const isCurrent = isSameWeek(currentWeekStart, getCurrentWeekStart());
  const end = getWeekEnd(currentWeekStart);
  const m = currentWeekStart.getMonth() + 1;
  const d = currentWeekStart.getDate();
  const em = end.getMonth() + 1;
  const ed = end.getDate();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrow}
        onPress={() => onWeekChange(getPreviousWeek(currentWeekStart))}
      >
        <Text style={styles.arrowText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.label}>
        {isCurrent ? '本周' : `${m}/${d}-${em}/${ed}`}
      </Text>
      <TouchableOpacity
        style={[styles.arrow, isCurrent && styles.arrowDisabled]}
        onPress={() => {
          if (!isCurrent) onWeekChange(getNextWeek(currentWeekStart));
        }}
        disabled={isCurrent}
      >
        <Text style={[styles.arrowText, isCurrent && styles.arrowTextDisabled]}>›</Text>
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
  arrowDisabled: {
    backgroundColor: '#FAFAFA',
  },
  arrowText: {
    fontSize: 24,
    color: '#333',
    fontWeight: '300',
  },
  arrowTextDisabled: {
    color: '#CCC',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
