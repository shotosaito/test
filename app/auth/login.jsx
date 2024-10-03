import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import { useSession } from '../context/SessionProvider';

export default function HomeScreen() {
  const [email, setEmail] = useState('testtest@gmail.com');
  const [password, setPassword] = useState('testtest');
  //const [errors, setErrors] = useState('');
  const router = useRouter();

  //SessionProviderで記述した関数を呼び出す
  const { session, isLoading, errors, signIn, signOut } = useSession();

  //useEffect(() => {
  const loginUserData = async () => {
    try {
      const user = await SecureStore.getItemAsync('user');
      //console.log(user);
      if (user) {
        const [userEmail, userPassword] = await Promise.all([
          //email,
          //password,
          SecureStore.getItemAsync('email'),
          SecureStore.getItemAsync('password'),
        ]);
        setEmail(userEmail);
        setPassword(userPassword);
      }
      console.log('ログイン状態を保存しました。');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (session) {
      console.log('既存のセッションが存在します:', session);
      router.replace('/(tabs)/customers');
      return;
    }
  }, [session]);

  const handleLogin = async () => {
    //signOut();
    signIn(email, password);

    console.log('session', session);

    // console.log('ログインしました。');
    // router.replace('/(tabs)/(customer)');
    //     axios
    //       .post('https://account-book.test/api/sanctum/token', { email, password })
    //       .then(async response => {
    //         try {
    //           const user = {
    //             token: response.data.token,
    //             password: response.data.password,
    //           };

    //           await SecureStore.setItemAsync('user', JSON.stringify(user));

    //           const userData = await SecureStore.getItemAsync('user');
    //           const { token, password } = JSON.parse(userData);
    //         } catch (error) {
    //           console.log(error);
    //         }
    //         if (response.data) {
    //           setErrors('');
    //         }
    //       })
    //       .catch(error => {
    //         console.log('error:', typeof error.response.data);
    //         console.log('error:', errors);
    //         setErrors(error.response.data.errors);
    //       });
  };

  const handleSignOut = async () => {
    signOut();
    console.log('ログアウトしました。');
  };

  const handleSignUp = async () => {
    router.replace('/auth/signup');
  };

  //   useEffect(() => {
  //     const checkSession = async () => {
  //       if (isLoading) {
  //         return;
  //       }

  //       if (session) {
  //         // セッションがある場合は一覧画面へ遷移
  //         navigation.replace('ListScreen'); // replaceを使用してログイン画面を履歴に残さない
  //       } else {
  //         // セッションがない場合はログイン画面に留まる
  //         navigation.replace('LoginScreen');
  //       }
  //     };

  //     checkSession();
  //   }, [session, isLoading]);

  //   if (isLoading) {
  //     // ローディング状態を表示
  //     return (
  //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //         <ActivityIndicator size="large" />
  //         <Text>セッションを確認中...</Text>
  //       </View>
  //     );
  //   }

  return (
    <SafeAreaView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20 }}>メールアドレス</Text>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <Text>{errors && errors['email']}</Text>

        <Text style={{ fontSize: 20 }}>パスワード</Text>
        <TextInput
          autoCapitalize="none"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <Text>{errors && errors['password']}</Text>

        <Pressable onPress={loginUserData}>
          <Text style={{ fontSize: 20, color: 'blue' }}>
            ログイン状態を保存する
          </Text>
        </Pressable>

        <Pressable onPress={handleLogin}>
          <Text style={{ fontSize: 20, color: 'red' }}>ログイン</Text>
        </Pressable>

        <Pressable onPress={handleSignOut}>
          <Text style={{ fontSize: 20, color: 'parple' }}>サインアウト</Text>
        </Pressable>

        <Pressable onPress={handleSignUp}>
          <Text style={{ fontSize: 20, color: 'orange' }}>新規登録</Text>
        </Pressable>

        <Text style={{ fontSize: 20 }}></Text>
      </View>
    </SafeAreaView>
  );
}
