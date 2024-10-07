import { Stack } from 'expo-router';
import React from 'react';
import { SessionProvider } from '../context/SessionProvider';
// import { AppProvider } from './context/AppContext';
// import { ExpoRoot } from 'expo-router';

// export default function App(){
// 	return (
// 		<AppProvider>
// 		</AppProvider>
// 		<ExpoRoot />
// 	);
// }
export default function SettingsLayout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="info" options={{ headerShown: false }} />
        <Stack.Screen name="mail" options={{ headerShown: false }} />
        <Stack.Screen name="tax" options={{ headerShown: false }} />
      </Stack>
    </SessionProvider>
  );
}
