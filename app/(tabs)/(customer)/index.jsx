import FontAwesome from '@expo/vector-icons/FontAwesome'; //アイコン表示用インポート
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { router, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { useCustomer } from '../../context/CustomerProvider';
import { useSession } from '../../context/SessionProvider';
//ここでdetails画面にデータのIDを渡して飛ばす
function handlePress(customer) {
  router.push({
    pathname: '/(tabs)/(customer)/details',
    params: { id: customer.id },
  });
}

//新規登録画面に遷移
function handleRegist() {
  router.push({ pathname: '/(tabs)/(customer)/regist' });
}
//印字確認アイコン
const printpic = '../assets/print.png';

function CustomerItem({ item: customer }) {
  return (
    // 文字押下時に画面遷移処理を行う
    <Pressable onPress={() => handlePress(customer)}>
      <Card containerStyle={{ padding: 0 }}>
        <ListItem>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'col',
                flexGrow: 1,
              }}
            >
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <Text style={{ flexShrink: 0, width: 100 }}>
                  {customer.id} {customer.name} {customer.honorific_display}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <Text style={{ flexShrink: 0 }}>
                  {customer.department_name}
                  {customer.department_name &&
                  customer.print_department_name === true ? (
                    <FontAwesome name="print" size={14} color="green" />
                  ) : customer.department_name &&
                    customer.print_department_name === false ? (
                    <FontAwesome name="print" size={14} color="gray" />
                  ) : null}
                </Text>
                <Text style={{ flexShrink: 0, width: 100 }}>
                  {customer.representative_name}
                  {customer.representative_name &&
                  customer.print_representative_name === true ? (
                    <FontAwesome name="print" size={14} color="green" />
                  ) : customer.representative_name &&
                    customer.print_representative_name === false ? (
                    <FontAwesome name="print" size={14} color="gray" />
                  ) : null}
                </Text>
              </View>
            </View>
            <View>
              <FontAwesome name="chevron-right" size={15} color="gray" />
            </View>
          </View>
        </ListItem>
      </Card>
    </Pressable>
  );
}

export default function Index() {
  const { signOut } = useSession();

  const [data, setData] = useState([]);
  //const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1); // ページ番号
  const [isLoading, setIsLoading] = useState(true); // データ取得中かどうか
  const [hasMore, setHasMore] = useState(true); // まだデータがあるかどうか
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(''); // エラーメッセージ用
  const flatListRef = useRef(null); // FlatListのrefを定義
  const [isFetching, setIsFetching] = useState(false); // データをロード中かどうか
  const [totalPages, setTotalPages] = useState(1); // 総ページ数
  const [params, setParams] = useState({});
  const isFocused = useIsFocused();
  const router = useRouter();

  const { setSearchText, searchText } = useCustomer();

  useEffect(() => {
    if (router.params?.refresh && router.params?.selectedId) {
      // 画面に戻ってきたときにデータを更新
      fetchData(router.params.selectedId);
    }
  }, [router.params?.refresh, router.params?.selectedId]);

  //検索メソッド;
  const searchData = async (searchText, page) => {
    fetchData(searchText, page), [searchText, page];
    console.log('fetchData', fetchData);
  };

  //   function searchWord() {
  //     setSearchText(searchText);
  //   }
  //検索結果を表示;
  useEffect(
    (searchText, page) => {
      searchData();
      console.log('sasa', searchText);
    },
    [searchText, page]
  );

  //検索ボックスをクリア
  const SearchReset = () => {
    setSearchText('');
    fetchData('', 1);
  };

  //初期表示メソッド
  const fetchData = async (keyword = '', page = 1) => {
    console.log('fetchData', keyword, page);

    try {
      const user = await SecureStore.getItemAsync('user');
      const { token } = JSON.parse(user);
      //console.log(token, 'ggggg');
      const response = await axios.get(
        'https://account-book.test/api/customers',
        {
          params: {
            search: keyword,
            page: page,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsLoading(false);

      const customers = response.data.data.customers;

      if (page === 1) {
        //ページが1の場合最初に表示するデータを取得
        setData(customers);
        setRefreshing(false);
      } else {
        //ページが1以外の場合、取得したデータを既存データの下に追加する
        setData(prevData => [...prevData, ...customers]);
      }

      //ページネーション
      //次のページがあればtrue、なければfalse
      if (response.data.links.next) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      setHasMore(response.data.links.next ? true : false);
      setTotalPages(response.data.meta.last_page);

      const selectedId = router.params?.selectedId;
      // **ここからが追記部分**
      if (selectedId) {
        // 目的のIDが現在のページのデータに含まれているかチェック
        const index = customers.findIndex(item => item.id === selectedId);
        if (index !== -1) {
          // 目的のIDが見つかったらその位置にスクロール
          flatListRef.current.scrollToIndex({
            animated: true,
            index: data.length - customers.length + index, // グローバルなインデックス
          });
        } else if (hasMore) {
          // 次のページが存在する場合は次のページをロード
          fetchData(keyword, page + 1);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log('データの取得に失敗しました。', error);
      setError('データの取得に失敗しました。');
    } finally {
      setIsLoading(false); // データ取得終了
    }
  };

  // リストをスクロールしたら次のページを取得する
  //(次のページがある場合に限る・データ取得中の場合は何もしない)
  const loadMoreData = () => {
    //console.log('loadMoreData', hasMore, isLoading);
    if (hasMore && !isLoading) {
      //   signOut();
      console.log('called');
      setPage(prevPage => prevPage + 1);
    }
  };

  //リフレッシュ時の処理
  const onRefresh = () => {
    setIsLoading(true);
    setRefreshing(true);
    setPage(1);
    fetchData('', 1);
  };

  //   useEffect(() => {
  //     if (isFocused) {
  //       const testee = fetchData('', 1); // 初回データを取得
  //     }
  //   }, [isFocused]);

  useEffect(() => {
    if (router.params?.selectedId) {
      const index = data.findIndex(
        item => item.id === router.params?.selectedId
      );
      if (index !== -1) {
        flatListRef.current?.scrollToIndex({ animated: true, index });
      }
    }
    [router.params?.selectedId];
  });

  useFocusEffect(
    useCallback(() => {
      if (router.params?.reflesh && router.params?.selectedId) {
        fetchData('', 1);
        const index = data.findIndex(
          item => item.id === router.params.selectedId
        );
        if (index !== -1 && flatListRef.current) {
          flatListRef.current.scrollToIndex({ animated: true, index });
        }
      }
    }, [router.params?.refresh, router.params?.selectedId, data])
  );

  //目的のIDのデータがあるページを取得し、そのページまでスクロールする
  useFocusEffect(
    useCallback(() => {
      const params = router.params; //渡されたやつが入ってほしい
      console.log('router.params', params);
      const loadPageAndScroll = async () => {
        if (router.params?.refresh && router.params?.selectedId) {
          let page = 1;
          let found = false;

          while (!found && page <= totalPages) {
            setIsFetching(true);
            const response = await fetchData('', page); // fetchDataで指定ページのデータを取得

            // 現在のページデータにselectedIdが含まれているかチェック
            const index = response.data.findIndex(
              item => item.id === router.params.selectedId
            );
            if (index !== -1) {
              // 目的のIDが見つかったページにスクロール
              if (flatListRef.current) {
                flatListRef.current.scrollToIndex({ animated: true, index });
              }
              found = true;
            } else {
              page++; // 次のページをロード
            }
            setIsFetching(false);
          }
        }
      };

      loadPageAndScroll();
    }, [router.params?.refresh, router.params?.selectedId, totalPages])
  );

  return (
    <SafeAreaView>
      <View style={{ padding: 15, paddingBottom: 250 }}>
        <Text style={{ fontSize: 30 }}>取引先</Text>

        <TextInput
          autoCapitalize="none"
          placeholder="取引先名で検索"
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />

        <Pressable onPress={SearchReset}>
          <Text style={{ fontSize: 20, color: 'blue' }}>リセット</Text>
        </Pressable>

        <Button title="取引先を登録" onPress={handleRegist} />

        <FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={CustomerItem}
          ListEmptyComponent={() => <Text>取引先はありません。</Text>}
          refreshControl={
            //下にスクロールした時にリフレッシュする
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMoreData} // スクロールが終わったときに追加データを取得
          onEndReachedThreshold={0.1} // スクロール位置の閾値。0.5はスクロール位置がリストの50%のときに発動
          //ローディング中の表示
          ListFooterComponent={() =>
            hasMore && <ActivityIndicator size="large" color="#0000ff" />
          }
        />
      </View>
    </SafeAreaView>
  );
}
