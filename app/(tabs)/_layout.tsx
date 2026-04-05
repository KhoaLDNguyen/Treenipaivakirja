import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4FC3F7',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#1E1E2E',
          borderTopColor: '#333',
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#1E1E2E',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Treenit',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Lisää',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Tilastot',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Tutki',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="edit"
        options={{
          href: null,
          title: 'Muokkaa',
        }}
      />
    </Tabs>
  );
}