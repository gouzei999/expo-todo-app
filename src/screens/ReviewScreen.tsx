import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useTaskStore } from '../store/TaskStore';
import { CATEGORIES } from '../constants';
import { formatDateTime } from '../utils/dateFormatter';

type RootStackParamList = {
  MainTabs: undefined;
  Review: { taskId: string };
};

export default function ReviewScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Review'>>();
  const navigation = useNavigation();
  const { taskId } = route.params;

  const tasks = useTaskStore((s) => s.tasks);
  const hardDeleteTask = useTaskStore((s) => s.hardDeleteTask);
  const toggleComplete = useTaskStore((s) => s.toggleComplete);

  const task = tasks.find((t) => t.id === taskId);

  const categoryLabel = task
    ? CATEGORIES.find((c) => c.key === task.category)?.label || ''
    : '';

  const handleDelete = useCallback(() => {
    if (!task) return;
    Alert.alert(
      '彻底删除任务',
      `确定要永久删除「${task.title}」吗？此操作不可恢复。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认删除',
          style: 'destructive',
          onPress: () => {
            hardDeleteTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  }, [task, hardDeleteTask, navigation]);

  const handleRestore = useCallback(() => {
    if (!task) return;
    Alert.alert('恢复任务', `将「${task.title}」恢复为未完成状态？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '确认恢复',
        onPress: () => {
          toggleComplete(task.id);
          navigation.goBack();
        },
      },
    ]);
  }, [task, toggleComplete, navigation]);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>任务不存在或已被删除</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Task Detail Card */}
      <View style={[styles.card, { backgroundColor: task.backgroundColor }]}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>分类</Text>
            <Text style={styles.metaValue}>{categoryLabel}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>创建时间</Text>
            <Text style={styles.metaValue}>
              {formatDateTime(task.createdAt)}
            </Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>完成时间</Text>
            <Text style={styles.metaValue}>
              {task.completedAt
                ? formatDateTime(task.completedAt)
                : '—'}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>所属周</Text>
            <Text style={styles.metaValue}>{task.weekStart}</Text>
          </View>
        </View>
      </View>

      {/* Review Section */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>📝 复盘</Text>
        <Text style={styles.reviewHint}>
          复盘完成后，你可以选择恢复任务继续跟进，或彻底删除此任务。
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore}>
          <Text style={styles.restoreBtnText}>🔄 恢复任务</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>🗑️ 彻底删除</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backBtnText}>返回已完成列表</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
  },
  notFound: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 100,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  },
  reviewSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  reviewHint: {
    fontSize: 14,
    color: '#888',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  restoreBtn: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  restoreBtnText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backBtnText: {
    fontSize: 15,
    color: '#007AFF',
  },
});
