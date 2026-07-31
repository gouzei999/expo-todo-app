import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types/task';
import { CATEGORIES } from '../constants';
import { formatShortDateTime } from '../utils/dateFormatter';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onLongPress?: (task: Task) => void;
  onMoveUp?: (task: Task) => void;
  onMoveDown?: (task: Task) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function TaskCard({
  task,
  onToggleComplete,
  onLongPress,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: TaskCardProps) {
  const categoryLabel = CATEGORIES.find((c) => c.key === task.category)?.label || '';

  return (
    <View style={[styles.container, { backgroundColor: task.backgroundColor }]}>
      {/* Checkbox */}
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggleComplete(task.id)}
      >
        <View style={[styles.checkboxInner, task.isCompleted && styles.checkboxChecked]}>
          {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      {/* Content */}
      <TouchableOpacity
        style={styles.content}
        onPress={() => onToggleComplete(task.id)}
        onLongPress={() => onLongPress?.(task)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.title, task.isCompleted && styles.titleCompleted]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.category}>{categoryLabel}</Text>
          {task.completedAt && (
            <Text style={styles.completedTime}>
              完成于 {formatShortDateTime(task.completedAt)}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Reorder Buttons */}
      {(onMoveUp || onMoveDown) && (
        <View style={styles.reorderButtons}>
          <TouchableOpacity
            style={[styles.reorderBtn, isFirst && styles.reorderBtnDisabled]}
            onPress={() => onMoveUp?.(task)}
            disabled={isFirst}
          >
            <Text style={[styles.reorderArrow, isFirst && styles.reorderArrowDisabled]}>▲</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.reorderBtn, isLast && styles.reorderBtnDisabled]}
            onPress={() => onMoveDown?.(task)}
            disabled={isLast}
          >
            <Text style={[styles.reorderArrow, isLast && styles.reorderArrowDisabled]}>▼</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  category: {
    fontSize: 12,
    color: '#888',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  completedTime: {
    fontSize: 11,
    color: '#AAA',
  },
  reorderButtons: {
    marginLeft: 4,
    gap: 4,
  },
  reorderBtn: {
    width: 32,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
  },
  reorderBtnDisabled: {
    backgroundColor: '#FAFAFA',
    opacity: 0.4,
  },
  reorderArrow: {
    fontSize: 11,
    color: '#666',
  },
  reorderArrowDisabled: {
    color: '#CCC',
  },
});
