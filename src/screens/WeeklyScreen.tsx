import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { useTaskStore } from '../store/TaskStore';
import { Category, Task } from '../types/task';
import { formatDate, getCurrentWeekStart } from '../utils/weekHelper';
import { CATEGORIES } from '../constants';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import WeekSelector from '../components/WeekSelector';
import EmptyState from '../components/EmptyState';

export default function WeeklyScreen() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getCurrentWeekStart());
  const [activeCategory, setActiveCategory] = useState<Category>('work');
  const [formVisible, setFormVisible] = useState(false);

  const weekStartStr = formatDate(currentWeekStart);

  const addTask = useTaskStore((s) => s.addTask);
  const toggleComplete = useTaskStore((s) => s.toggleComplete);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const moveTask = useTaskStore((s) => s.moveTask);
  const tasks = useTaskStore((s) => s.getActiveTasksByCategory(weekStartStr, activeCategory));

  const handleWeekChange = useCallback((newWeekStart: Date) => {
    setCurrentWeekStart(newWeekStart);
  }, []);

  const handleToggleComplete = useCallback(
    (id: string) => {
      Alert.alert('完成任务', '确认标记此任务为已完成？', [
        { text: '取消', style: 'cancel' },
        {
          text: '确认完成',
          onPress: () => toggleComplete(id),
        },
      ]);
    },
    [toggleComplete]
  );

  const handleLongPress = useCallback(
    (task: Task) => {
      Alert.alert('操作任务', task.title, [
        { text: '取消', style: 'cancel' },
        {
          text: '删除任务',
          style: 'destructive',
          onPress: () => {
            Alert.alert('确认删除', '删除后无法恢复', [
              { text: '取消', style: 'cancel' },
              {
                text: '确认删除',
                style: 'destructive',
                onPress: () => deleteTask(task.id),
              },
            ]);
          },
        },
      ]);
    },
    [deleteTask]
  );

  const handleMoveUp = useCallback(
    (task: Task) => {
      moveTask(task.id, task.weekStart, task.category, 'up');
    },
    [moveTask]
  );

  const handleMoveDown = useCallback(
    (task: Task) => {
      moveTask(task.id, task.weekStart, task.category, 'down');
    },
    [moveTask]
  );

  const handleAddTask = useCallback(
    (title: string, category: Category, backgroundColor: string) => {
      addTask(title, category, weekStartStr, backgroundColor);
      setFormVisible(false);
    },
    [addTask, weekStartStr]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Task; index: number }) => (
      <TaskCard
        task={item}
        onToggleComplete={handleToggleComplete}
        onLongPress={handleLongPress}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        isFirst={index === 0}
        isLast={index === tasks.length - 1}
      />
    ),
    [handleToggleComplete, handleLongPress, handleMoveUp, handleMoveDown, tasks.length]
  );

  return (
    <View style={styles.container}>
      {/* Week Selector */}
      <WeekSelector currentWeekStart={currentWeekStart} onWeekChange={handleWeekChange} />

      {/* Category Tabs */}
      <View style={styles.tabBar}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.tab, activeCategory === cat.key && styles.tabActive]}
            onPress={() => setActiveCategory(cat.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeCategory === cat.key && styles.tabTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      {tasks.length === 0 ? (
        <EmptyState message={`暂无${activeCategory === 'work' ? '工作' : '生活'}任务\n点击右下角 + 添加`} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setFormVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Task Form Modal */}
      <TaskForm
        visible={formVisible}
        initialCategory={activeCategory}
        onClose={() => setFormVisible(false)}
        onSubmit={handleAddTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#F5F5F5',
  },
  tabActive: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFF',
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 30,
    color: '#FFF',
    fontWeight: '300',
  },
});
