import FontAwesome from '@expo/vector-icons/FontAwesome'; //アイコン表示用インポート
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useRouter } from 'expo-router';
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
import { useCustomer } from '../context/CustomerProvider';

export default function Index() {
  const [data, setData] = useState([]);
  //const [page, setPage] = useState(1); // ページ番号
  const [isLoading, setIsLoading] = useState(true); // データ取得中かどうか
  const [hasMore, setHasMore] = useState(true); // まだデータがあるかどうか
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(''); // エラーメッセージ用
  const flatListRef = useRef(null); // FlatListのrefを定義
  const [isFetching, setIsFetching] = useState(false); // データをロード中かどうか
  //const [totalPages, setTotalPages] = useState(1); // 総ページ数
  const [checkPage, setCheckPage] = useState(1);
  const isFocused = useIsFocused();
  const router = useRouter();

  const {
    searchText,
    text,
    setSearchText,
    setText,
    id,
    pageId,
    setId,
    scrollId,
    setScrollId,
    flg,
    setFlg,
    page,
    setPageId,
    refreshFlg,
    setPage,
  } = useCustomer();

  //   console.log(
  //     'テスト一覧:',
  //     searchText,
  //     '/',
  //     scrollId,
  //     '/',
  //     pageId,
  //     '/',
  //     refreshFlg
  //   );

  //id,    page, flg,   text,

  //   const { page, setPage } = useCustomer();
  //   const { flg, setFlg } = useCustomer();
  //   const { scrollId, setScrollId } = useCustomer();
  //   const { id, setId } = useCustomer('');

  //   const {
  //     searchText,
  //     setSearchText,
  //     page,
  //     setPage,
  //     flg,
  //     setFlg,
  //     scrollId,
  //     setScrollId,
  //     id,
  //     setId,
  //   } = useCustomer();

  //ここでdetails画面にデータのIDを渡して飛ばす
  function handlePress(customer) {
    //ここで遷移前にIDを保存
    console.log('テスト', scrollId, 'ページ', pageId);
    setId(customer.id.toString());
    //setPage(response.data.meta.from);
    router.push({
      pathname: '/(tabs)/(customer)/details/',
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

  //検索メソッド;
  const searchData = async (searchText, pageId) => {
    // console.log('検索テスト', searchText, pageId);
    try {
      await fetchData(searchText, pageId);
    } catch (error) {
      console.error('エラー', error);
    }
  };

  //検索結果を表示;

  useEffect(() => {
    // fetchData('', 1);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      searchData(searchText, pageId);
    }, 500);
  }, [searchText, pageId]);

  //検索ボックスをクリア
  const SearchReset = () => {
    //空文字に置き換え未入力に戻す
    setText('');
  };

  //初期表示メソッド

  //初期表示メソッド

  //useFocusEffect(() => {
  const fetchData = async (keyword = '', pageId = '') => {
    console.log(';aslkdfj;alskdfj;kas called', pageId);
    if (pageId == null) {
      return;
    }
    try {
      const user = await SecureStore.getItemAsync('user');
      const { token } = JSON.parse(user);
      //console.log(token, 'ggggg');
      const response = await axios.get(
        'https://account-book.test/api/customers',
        {
          params: {
            search: keyword,
            page: parseInt(pageId) ?? 1,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsLoading(false);

      //   console.log('確認用：', response.data.meta.current_page);

      //console.log(response.data.meta.from);

      const customers = response.data.data.customers;
      setPage(response.data.meta.current_page?.toString());

      if (pageId === 1) {
        //ページが1の場合最初に表示するデータを取得
        setData(customers);
        setRefreshing(false);
      } else {
        //ページが1以外の場合、取得したデータを既存データの下に追加する
        setData(prevData => [...prevData, ...customers]);
      }

      //ページネーション
      //次のページがあればtrue、なければfalse
      //   if (response.data.links.next) {
      //     setHasMore(true);
      //   } else {
      //     setHasMore(false);
      //   }
      setHasMore(response.data.links.next ? true : false);
      //setTotalPages(response.data.meta.last_page);

      //呼び出された際に返却する値

      return customers;
    } catch (error) {
      setIsLoading(false);
      //   console.log('データの取得に失敗しました。', error);
      setError('データの取得に失敗しました。');
    } finally {
      setIsLoading(false); // データ取得終了
    }
  };
  //}, []);
  // 1.

  // 2.

  // リストをスクロールしたら次のページを取得する
  //(次のページがある場合に限る・データ取得中の場合は何もしない)
  const loadMoreData = () => {
    console.log('loadMoreData', hasMore, isLoading);
    if (hasMore && !isLoading) {
      //   console.log('called');
      setPage((parseInt(pageId) + 1)?.toString());
      //   console.log('ページ追加', pageId);
    }
  };

  //下スワイプ時の処理（更新）
  const onRefresh = () => {
    //console.log('wewewewe');
    setIsLoading(true);
    setRefreshing(true);
    fetchData('', 1);
    setId('');
    setFlg('false');
  };

  //   const loadPageAndScroll = async () => {
  //     if (refreshFlg) {
  //       console.log(8998679879798);
  //       //let found = false;//目的のIDが見つかったか確認
  //       //   setIsFetching(true);
  //       console.log('asfasdfdsaf', pageId);
  //       console.log(checkPage, pageId);
  //       setFlg(false);

  //       try {
  //         while (checkPage <= pageId) {
  //           console.log('jask;dfja;skldjf;aklsjdf;laskdjf', checkPage);
  //           const customers = await fetchData('', checkPage); // fetchDataで指定ページのデータを取得
  //           //console.log('確認用1', customers);
  //           if (!customers || customers.length === 0) {
  //             console.warn('データが取得できませんでした。');
  //             break; // データがなければループを抜ける
  //           }

  //           console.log('確認用2', customers); //, customers);
  //           if (!customers || customers.length === 0) {
  //             console.warn('顧客データが取得できませんでした。');
  //             break; // データがなければループを抜ける
  //           }

  //           setCheckPage(checkPage + 1);
  //           setPage(pageId - 1); // 次のページをロード

  //           if (pageId <= 0) {
  //             break;
  //           }
  //         }
  //       } catch (error) {
  //         console.error('データ取得中にエラーが発生しました:', error);
  //       } finally {
  //         setIsFetching(false); // 例外が発生しても必ず終了処理を実行
  //         setFlg(false);

  //         // const index = customers.findIndex(item => item.id === scrollId);
  //         // console.log('========asdfasdfadsf===========');
  //         // console.log(index, scrollId);
  //         // if (index !== -1) {
  //         //   // 目的のIDが見つかったペ
  //         //   setFlg(false);
  //         //   // ージにスクロール;
  //         //   flatListRef.current.scrollToIndex({ animated: true, index });
  //         // }
  //       }
  //     }
  //   };

  //目的のIDのデータがあるページを取得し、そのページまでスクロールする
  useFocusEffect(
    useCallback(() => {
      console.log('↓===================');
      console.log('scrollId', scrollId);
      console.log('pageId', pageId);
      //   console.log('checkPage', checkPage);
      console.log('refreshFlg', refreshFlg);
      //   console.log('scrollId', scrollId);
      //   console.log('pageId', pageId);
      //   console.log('checkPage', checkPage);
      console.log('↑===================');

      const loadData = async () => {
        const customers = await fetchData('', checkPage); // fetchDataで指定ページのデータを取得
        // console.log(customers);
        // if (!customers || customers.length === 0) {
        //   console.warn('データが取得できませんでした。');
        // }
      };

      if (refreshFlg == 'true') {
        setData([]);
        try {
          console.log('jask;dfja;skldjf;called', pageId);
          while (checkPage <= parseInt(pageId) && pageId != null) {
            console.log('jask;dfja;skldjf;aklsjdf;laskdjf', checkPage);
            loadData();
            setCheckPage(checkPage + 1);

            // setPage((pageId - 1)?.toString()); // 次のページをロードss

            console.log('checkPage', checkPage, 'pageId', pageId);
            if (checkPage >= parseInt(pageId)) {
              break;
            }
          }
        } catch (error) {
          console.error('データ取得中にエラーが発生しました:', error);
        }
      }

      setFlg('false');
    }, [refreshFlg])
  );

  return (
    <SafeAreaView>
      <View style={{ padding: 15, paddingBottom: 250 }}>
        <Text style={{ fontSize: 30 }}>取引先</Text>

        <TextInput
          autoCapitalize="none"
          placeholder="取引先名で検索"
          value={searchText}
          onChangeText={searchText => setText(searchText)}
        />
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
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
