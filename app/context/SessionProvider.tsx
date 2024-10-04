import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';
import { useStorageState } from './useStorageState';

//関数のタイプと初期値をまとめて定義
const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  error: string | null;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  error: null,
});

// This hook can be used to access the user info.
//useSessionでまとめて呼び出せる
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const navigation = useNavigation();
  const router = useRouter();
  const [errors, setErrors] = useState('');
  return (
    <AuthContext.Provider
      value={{
        signIn: (email: string, password: string) => {
          axios
            .post('https://account-book.test/api/sanctum/token', {
              email,
              password,
            })

            .then(async response => {
              try {
                const user = {
                  token: response.data.token,
                };

                console.log(user.token);

                setSession(JSON.stringify(user.token));
              } catch (error) {
                console.log(error);
              }
              if (response.data) {
              }
            })
            .catch(error => {
              console.log('error:', error.response.data.errors);

              setErrors(error.response.data.errors);
            });
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
