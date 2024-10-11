import { Stack } from 'expo-router';
import React from 'react';
// import { SessionProvider } from '../../context/SessionProvider';
// import { AppProvider } from './context/AppContext';
// import { ExpoRoot } from 'expo-router';

// export default function App(){
// 	return (
// 		<AppProvider>
// 		</AppProvider>
// 		<ExpoRoot />
// 	);
// }
export default function NewBank() {
  return (
    <Stack>
      <Stack.Screen name="newBank" options={{ headerShown: false }} />
    </Stack>
  );
}
