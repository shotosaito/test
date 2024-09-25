import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import {
  createContext,
  useContext,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { useStorageState } from './useStorageState';

const CustomerContext = createContext<{
  searchText: string | null;
  setSearchText: (text: string) => void;
}>({
  searchText: '',
  setSearchText: () => {},
});

export function useCustomer() {
  const value = useContext(CustomerContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useCustomer must be wrapped in a <CustomerProvider />');
    }
  }
  return value;
}

export function CustomerProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useStorageState('session');
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();
  const [errors, setErrors] = useState('');
  const [hasMore, setHasMore] = useState(true); // まだデータがあるかどうか
  const [totalPages, setTotalPages] = useState(1); // 総ページ数
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null); // FlatListのrefを定義
  const [searchData, setSearchData] = useStorageState('search');
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useStorageState('search');

  return (
    <CustomerContext.Provider
      value={{
        //初期画面用  別になくてもよい
        //     fetchData: (searchText: string, page: 1, session: string) => {
        //       //const response = axios.get(
        //       axios
        //         .get('https://account-book.test/api/customers', {
        //           params: {
        //             search: searchText,
        //             page: page,
        //           },
        //           headers: {
        //             Authorization: `Bearer ${session}`,
        //           },
        //         })
        //         .then(async response => {
        //           try {
        //             const customers = response.data.data.customers;
        //           } catch (error) {
        //             setIsLoading(false);
        //             setErrors(errors);
        //           } finally {
        //             setIsLoading(false);
        //           }
        //         });
        //     },
        searchText,
        setSearchText,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
