import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Redirect } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { CustomerLayout } from '../(tabs)/(customer)/_layout';
import { SettingsLayout } from '../(tabs)/(settings)/_layout';
import { useSession } from '../context/SessionProvider';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { session, isLoading } = useSession();
  const Tab = createBottomTabNavigator();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  console.log('session', session);

  if (!session) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="customer"
        component={CustomerLayout}
        options={{
          title: 'customer',
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'code-slash' : 'code-slash-outline'}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="settings"
        component={SettingsLayout}
        options={{
          title: 'settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cog' : 'cog-outline'} color={color} />
          ),
        }}
      />
      {/* </Tabs> */}
    </Tab.Navigator>
  );
}
