import { Stack } from 'expo-router';
import React from 'react';
import { CustomerProvider } from '../context/CustomerProvider';
// import { AppProvider } from './context/AppContext';
// import { ExpoRoot } from 'expo-router';

// export default function App(){
// 	return (
// 		<AppProvider>
// 		</AppProvider>
// 		<ExpoRoot />
// 	);
// }
export default function CustomerLayout() {
  return (
    <CustomerProvider>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="details" />
        <Stack.Screen name="regist" />
      </Stack>
    </CustomerProvider>
  );
}
