import { router, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons/';
import { translate } from '@/app/services/translate';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';

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
          tabBarLabel: translate('navbar.home'),
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                router.navigate('/(modals)/user/role-selection');
              }}
              style={{ marginRight: 15 }}
            >
              <MaterialCommunityIcons name="account-cog-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: translate('navbar.explore'),
          tabBarIcon: ({ size, color }) => <Ionicons name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="coaches"
        options={{
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
