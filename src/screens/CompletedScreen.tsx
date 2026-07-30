import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTaskStore } from '../store/TaskStore';
import { Task } from '../types/task';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { CATEGORIES } from '../constants';

type RootStackParamList = {
  MainTabs: undefined;
  Review: { taskId: string };
};

export default function CompletedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const completedTasks = useTaskStore((s) => s.getCompletedTasks());

  const handlePress = useCallback(
    (task: Task) => {
      navigation.navigate('Review', { taskId: task.id });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskCard
        task={item}
        onToggleComplete={() => handlePress(item)}
        onLongPress={() => handlePress(item)}
      />
    ),
    [handlePress]
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
});
