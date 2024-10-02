import { SafeAreaView, Text, View } from 'react-native';
export default function Settings() {
  const test = 'test';

  return (
    <SafeAreaView>
      <View style={{ padding: 15, paddingBottom: 250 }}>
        <Text style={{ fontSize: 30 }}>{{ test }}</Text>
      </View>
    </SafeAreaView>
  );
}
