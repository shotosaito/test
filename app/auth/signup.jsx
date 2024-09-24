import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConf] = useState('');
  const [errors, setErrors] = useState(''); //ssss@gmail.com
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        'https://account-book.test/api/auth/register',
        {
          name: name,
          email: email,
          password: password,
          password_confirmation: password_confirmation,
        }
      );
      //console.log(response.data.data);

      await Promise.all([
        SecureStore.setItemAsync('token', response.data.data.token),
        SecureStore.setItemAsync('email', email),
        SecureStore.setItemAsync('password', password),
      ]);

      const [userToken, userPassword] = await Promise.all([
        SecureStore.getItemAsync('token'),
        SecureStore.getItemAsync('password'),
      ]);

      console.log(userPassword, userToken);

      if (response.data) {
        setErrors('');
      }
    } catch (error) {
      console.log('error:', typeof error.response.data);
      console.log('error:', errors);
      setErrors(error.response.data.errors);
    }
  };

  const handleLogIn = async () => {
    router.replace('/auth/login');
  };

  return (
    <View style={{ padding: 20 }}>
      <SafeAreaView>
        <Text style={{ fontSize: 20 }}>氏名</Text>
        <TextInput
          autoCapitalize="none"
          placeholder="Name"
          value={name}
          onChangeText={text => setName(text)}
        />
        <Text>{errors['name']}</Text>

        <Text style={{ fontSize: 20 }}>メールアドレス</Text>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <Text>{errors['email']}</Text>

        <Text style={{ fontSize: 20 }}>パスワード</Text>
        <TextInput
          textContentType="none"
          autoCapitalize="none"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <Text>{errors['password']}</Text>

        <Text style={{ fontSize: 20 }}>パスワードの確認</Text>
        <TextInput
          textContentType="none"
          autoCapitalize="none"
          placeholder="password_confirmation"
          secureTextEntry
          value={password_confirmation}
          onChangeText={text => setPasswordConf(text)}
        />
        <Text>{errors['password_confirmation']}</Text>

        <Pressable onPress={handleSignUp}>
          <Text style={{ fontSize: 20, color: 'red' }}>アカウント作成</Text>
        </Pressable>

        <Pressable onPress={handleLogIn}>
          <Text style={{ fontSize: 20, color: 'blue' }}>
            既に登録済みですか？
          </Text>
        </Pressable>

        <Text style={{ fontSize: 20 }}></Text>
      </SafeAreaView>
    </View>
  );
}
