import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import WeeklyScreen from '../screens/WeeklyScreen';
import CompletedScreen from '../screens/CompletedScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#E5E5E5',
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tab.Screen
          name="Weekly"
          component={WeeklyScreen}
          options={{
            tabBarLabel: '本周任务',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>📋</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Completed"
          component={CompletedScreen}
          options={{
            tabBarLabel: '已完成',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>✅</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
