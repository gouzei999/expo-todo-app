import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';
import WeeklyScreen from '../screens/WeeklyScreen';
import CompletedScreen from '../screens/CompletedScreen';

const Tab = createBottomTabNavigator();
const ICON_SIZE = 26;
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 80;

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
            paddingBottom: Platform.OS === 'ios' ? 28 : 16,
            paddingTop: 10,
            height: TAB_BAR_HEIGHT,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
        }}
      >
        <Tab.Screen
          name="Weekly"
          component={WeeklyScreen}
          options={{
            tabBarLabel: '本周任务',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: ICON_SIZE, color }}>📋</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Completed"
          component={CompletedScreen}
          options={{
            tabBarLabel: '已完成',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: ICON_SIZE, color }}>✅</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
