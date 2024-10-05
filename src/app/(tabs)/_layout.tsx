import { router, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons/';
import { translate } from '@/app/services/translate';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';
import React from 'react';
import { spacing } from '@/constants/spacing';

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarLabelStyle: {
          fontFamily: 'mon-sb',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          title: translate(`home_screen.header`),
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'mon-b',
            fontWeight: 'bold',
            fontStyle: 'italic',
            fontSize: spacing.lg,
          },
          tabBarLabel: translate('navbar.home'),
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          tabBarLabel: translate('navbar.activities'),
          tabBarIcon: ({ size, color }) => <Ionicons name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="coaches"
        options={{
          headerShown: true,
          title: translate(`coaches_screen.header`),
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          tabBarLabel: translate('navbar.coaches'),
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="badge-account-horizontal-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: translate('navbar.profile'),
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
