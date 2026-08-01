import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';
import WeeklyScreen from '../screens/WeeklyScreen';
import CompletedScreen from '../screens/CompletedScreen';

const Tab = createBottomTabNavigator();
const TAB_ICON_SIZE = 28;

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
            paddingBottom: 20,
            paddingTop: 12,
            height: Platform.OS === 'ios' ? 90 : 80,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '600',
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="Weekly"
          component={WeeklyScreen}
          options={{
            tabBarLabel: '本周任务',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: TAB_ICON_SIZE, color, lineHeight: TAB_ICON_SIZE + 4 }}>
                📋
              </Text>
            ),
          }}
        />
        <Tab.Screen
          name="Completed"
          component={CompletedScreen}
          options={{
            tabBarLabel: '已完成',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: TAB_ICON_SIZE, color, lineHeight: TAB_ICON_SIZE + 4 }}>
                ✅
              </Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
