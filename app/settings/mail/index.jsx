import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, View } from 'react-native';

export default function Settings() {
  //メール送信の設定
  const [mailTitle, setMailTitle] = useState('');
  const [mailText, setMailText] = useState('');

  return (
    <SafeAreaView>
      <View style={{ padding: 15, paddingBottom: 250 }}>
        <Text style={{ fontSize: 30 }}>test</Text>

        <Text style={{ fontSize: 35 }}>メール本文の設定</Text>
        <Text style={{ fontSize: 13 }}>件名[必須]</Text>

        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={setMailTitle}
          value={mailTitle}
        />
        <Text style={{ fontSize: 13 }}>本文[必須]</Text>

        <TextInput
          style={{ height: 400, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={setMailText}
          value={mailText}
        />
      </View>
    </SafeAreaView>
  );
}
