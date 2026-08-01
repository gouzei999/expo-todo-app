import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { Category } from '../types/task';
import { CATEGORIES, DEFAULT_BACKGROUND_COLOR } from '../constants';
import ColorPicker from './ColorPicker';

interface TaskFormProps {
  visible: boolean;
  initialCategory: Category;
  onClose: () => void;
  onSubmit: (title: string, category: Category, backgroundColor: string) => void;
  editingTask?: {
    id: string;
    title: string;
    category: Category;
    backgroundColor: string;
  } | null;
}

export default function TaskForm({
  visible,
  initialCategory,
  onClose,
  onSubmit,
  editingTask,
}: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(initialCategory);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BACKGROUND_COLOR);

  const isEditing = editingTask != null;

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCategory(editingTask.category);
      setBackgroundColor(editingTask.backgroundColor);
    } else {
      setTitle('');
      setCategory(initialCategory);
      setBackgroundColor(DEFAULT_BACKGROUND_COLOR);
    }
  }, [editingTask, initialCategory, visible]);

  const handleSubmit = () => {
    if (title.trim().length === 0) return;
    onSubmit(title.trim(), category, backgroundColor);
    setTitle('');
    setCategory(initialCategory);
    setBackgroundColor(DEFAULT_BACKGROUND_COLOR);
  };

  const handleClose = () => {
    setTitle('');
    setCategory(initialCategory);
    setBackgroundColor(DEFAULT_BACKGROUND_COLOR);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>{isEditing ? '编辑任务' : '新增任务'}</Text>

            {/* Title Input */}
            <Text style={styles.label}>任务名称</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="输入任务内容..."
              placeholderTextColor="#CCC"
              autoFocus
              maxLength={100}
            />

            {/* Category Selector */}
            <Text style={styles.label}>分类</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryBtn,
                    category === cat.key && styles.categoryBtnActive,
                  ]}
                  onPress={() => setCategory(cat.key)}
                >
                  <Text
                    style={[
                      styles.categoryBtnText,
                      category === cat.key && styles.categoryBtnTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Color Picker */}
            <ColorPicker
              selectedColor={backgroundColor}
              onSelectColor={setBackgroundColor}
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, title.trim().length === 0 && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={title.trim().length === 0}
            >
              <Text style={styles.submitBtnText}>{isEditing ? '保存修改' : '确认添加'}</Text>
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  categoryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  categoryBtnActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryBtnText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  categoryBtnTextActive: {
    color: '#FFF',
  },
  submitBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    backgroundColor: '#B0C4DE',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
