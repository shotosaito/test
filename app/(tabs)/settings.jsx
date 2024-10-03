import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Button, SafeAreaView, View } from 'react-native';
import { useSession } from '../context/SessionProvider';

export default function Settings() {
  const { signOut } = useSession();
  const router = useRouter();
  function MailSetting() {
    router.push({
      pathname: '../../settings/mail',
    });
  }

  function TaxSetting() {
    router.push({
      pathname: '../settings/tax',
    });
  }

  function SignOutAlert() {
    Alert.alert('ログアウト', 'ログアウトしてもよろしいでしょうか', [
      {
        text: 'キャンセル',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => signOut(),
      },
    ]);
  }

  return (
    <SafeAreaView>
      <View style={{ padding: 15, paddingBottom: 250 }}>
        <Button title="メール本文の設定" onPress={MailSetting} />

        <Button title="課税設定" onPress={TaxSetting} />

        <Button title="ログアウト" onPress={SignOutAlert} />
      </View>
    </SafeAreaView>
  );
}
