import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types/task';
import { CATEGORIES } from '../constants';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onLongPress?: (task: Task) => void;
  drag?: () => void;
  isActive?: boolean;
}

export default function TaskCard({
  task,
  onToggleComplete,
  onLongPress,
  drag,
  isActive,
}: TaskCardProps) {
  const categoryLabel = CATEGORIES.find((c) => c.key === task.category)?.label || '';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: task.backgroundColor },
        isActive && styles.active,
      ]}
      onPress={() => onToggleComplete(task.id)}
      onLongPress={() => onLongPress?.(task)}
      activeOpacity={0.7}
      delayLongPress={drag ? 200 : 500}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggleComplete(task.id)}
      >
        <View style={[styles.checkboxInner, task.isCompleted && styles.checkboxChecked]}>
          {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
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
              完成于 {new Date(task.completedAt).toLocaleString('zh-CN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>
      </View>

      {drag && (
        <TouchableOpacity
          style={styles.dragHandle}
          onLongPress={drag}
          delayLongPress={0}
        >
          <Text style={styles.dragHandleText}>⋮⋮</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
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
  active: {
    shadowOpacity: 0.2,
    elevation: 8,
    transform: [{ scale: 1.02 }],
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
  dragHandle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dragHandleText: {
    fontSize: 18,
    color: '#CCC',
    letterSpacing: 2,
  },
});
