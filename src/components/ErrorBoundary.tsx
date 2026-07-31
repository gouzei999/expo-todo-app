import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, we can't console.log, but the error is shown on screen
  }

  render() {
    if (this.state.hasError) {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.title}>发生错误</Text>
          <Text style={styles.message}>
            {this.state.error?.message || '未知错误'}
          </Text>
          {this.state.error?.stack && (
            <View style={styles.stackContainer}>
              <Text style={styles.stackText} selectable>
                {this.state.error.stack}
              </Text>
            </View>
          )}
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFF',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: '#E53935',
    textAlign: 'center',
    marginBottom: 20,
  },
  stackContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  stackText: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
