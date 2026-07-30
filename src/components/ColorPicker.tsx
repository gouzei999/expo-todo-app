import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { PRESET_COLORS } from '../utils/colors';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export default function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>背景颜色</Text>
      <View style={styles.row}>
        {PRESET_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorDot,
              { backgroundColor: color },
              selectedColor === color && styles.selected,
            ]}
            onPress={() => onSelectColor(color)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#DDD',
  },
  selected: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
});
