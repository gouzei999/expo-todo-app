import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WeeklyScreen from '../screens/WeeklyScreen';
import CompletedScreen from '../screens/CompletedScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.icon, { color }]}>{emoji}</Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: '#E5E5E5',
              height: 90,
              paddingBottom: 20,
              paddingTop: 12,
              backgroundColor: '#F0F4FF',
            },
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: '700',
              marginTop: 4,
            },
          }}
        >
          <Tab.Screen
            name="Weekly"
            component={WeeklyScreen}
            options={{
              tabBarLabel: '本周任务',
              tabBarIcon: ({ color }) => <TabIcon emoji="📋" color={color} />,
            }}
          />
          <Tab.Screen
            name="Completed"
            component={CompletedScreen}
            options={{
              tabBarLabel: '已完成',
              tabBarIcon: ({ color }) => <TabIcon emoji="✅" color={color} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  iconWrap: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    lineHeight: 32,
  },
});
