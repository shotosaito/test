import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, Text } from 'react-native';
import { useSession } from '../context/SessionProvider';

const signOut = () => useSession();

export default function HandleLogOut() {
  const router = useRouter();
  //const { signOut } = useSession();
  const handleSignOut = async () => {
    signOut();
    console.log('ログアウトしました。');
  };

  return (
    <SafeAreaView>
      {/* <Pressable
        onPress={() => {
          handleSignOut();
          router.push('/auth/login');
        }}
      >
        <Text>ログアウト</Text>
      </Pressable> */}
      <Pressable onPress={handleSignOut}>
        <Text style={{ fontSize: 20, color: 'parple' }}>サインアウト</Text>
      </Pressable>
    </SafeAreaView>
  );
}
