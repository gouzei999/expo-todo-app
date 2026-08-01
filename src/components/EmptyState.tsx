import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EmptyStateProps {
  message: string;
  emoji?: string;
}

export default function EmptyState({ message, emoji = '📋' }: EmptyStateProps) {
  const lines = message.split('\n');

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      {lines.map((line, index) => (
        <Text key={index} style={styles.message}>
          {line}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
