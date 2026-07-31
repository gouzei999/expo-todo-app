import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTaskStore } from '../store/TaskStore';
import { Task } from '../types/task';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { CATEGORIES } from '../constants';
import { formatDateTime } from '../utils/dateFormatter';

export default function CompletedScreen() {
  const completedTasks = useTaskStore((s) => s.getCompletedTasks());
  const hardDeleteTask = useTaskStore((s) => s.hardDeleteTask);
  const toggleComplete = useTaskStore((s) => s.toggleComplete);
  const tasks = useTaskStore((s) => s.tasks);

  const [reviewTaskId, setReviewTaskId] = useState<string | null>(null);
  const reviewTask = reviewTaskId ? tasks.find((t) => t.id === reviewTaskId) : null;

  const openReview = useCallback((task: Task) => {
    setReviewTaskId(task.id);
  }, []);

  const closeReview = useCallback(() => {
    setReviewTaskId(null);
  }, []);

  const handleRestore = useCallback(() => {
    if (!reviewTask) return;
    Alert.alert('恢复任务', `将「${reviewTask.title}」恢复为未完成状态？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '确认恢复',
        onPress: () => {
          toggleComplete(reviewTask.id);
          closeReview();
        },
      },
    ]);
  }, [reviewTask, toggleComplete, closeReview]);

  const handleDelete = useCallback(() => {
    if (!reviewTask) return;
    Alert.alert(
      '彻底删除任务',
      `确定要永久删除「${reviewTask.title}」吗？此操作不可恢复。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认删除',
          style: 'destructive',
          onPress: () => {
            hardDeleteTask(reviewTask.id);
            closeReview();
          },
        },
      ]
    );
  }, [reviewTask, hardDeleteTask, closeReview]);

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskCard
        task={item}
        onToggleComplete={() => openReview(item)}
        onLongPress={() => openReview(item)}
      />
    ),
    [openReview]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>已完成任务</Text>
        <Text style={styles.subtitle}>
          共 {completedTasks.length} 项 · 点击进入复盘
        </Text>
      </View>

      {completedTasks.length === 0 ? (
        <EmptyState message="还没有已完成的任务\n完成任务后会出现在这里" emoji="🎉" />
      ) : (
        <FlatList
          data={completedTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Review Modal */}
      <Modal visible={reviewTask !== null} animationType="slide">
        {reviewTask && (
          <ScrollView style={styles.modalContainer} contentContainerStyle={styles.modalContent}>
            {/* Task Detail Card */}
            <View
              style={[
                styles.card,
                { backgroundColor: reviewTask.backgroundColor || '#FFF' },
              ]}
            >
              <Text style={styles.cardTitle}>{reviewTask.title}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>分类</Text>
                  <Text style={styles.metaValue}>
                    {CATEGORIES.find((c) => c.key === reviewTask.category)?.label || ''}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>创建时间</Text>
                  <Text style={styles.metaValue}>{formatDateTime(reviewTask.createdAt)}</Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>完成时间</Text>
                  <Text style={styles.metaValue}>
                    {reviewTask.completedAt ? formatDateTime(reviewTask.completedAt) : '—'}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>所属周</Text>
                  <Text style={styles.metaValue}>{reviewTask.weekStart}</Text>
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

            <TouchableOpacity style={styles.backBtn} onPress={closeReview}>
              <Text style={styles.backBtnText}>返回已完成列表</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 40,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalContent: {
    padding: 16,
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
  cardTitle: {
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
