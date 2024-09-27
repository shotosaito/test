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
import { useCustomer } from '../../context/CustomerProvider';

export default function Index() {
  const [data, setData] = useState([]);
  //const [page, setPage] = useState(1); // ページ番号
  const [isLoading, setIsLoading] = useState(true); // データ取得中かどうか
  const [hasMore, setHasMore] = useState(true); // まだデータがあるかどうか
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(''); // エラーメッセージ用
  const flatListRef = useRef(null); // FlatListのrefを定義
  const [isFetching, setIsFetching] = useState(false); // データをロード中かどうか
  const [totalPages, setTotalPages] = useState(1); // 総ページ数
  const isFocused = useIsFocused();
  const router = useRouter();

  const { searchText, setSearchText } = useCustomer('searchText');
  const { page, setPage } = useCustomer('page');
  const { flg, setFlg } = useCustomer('flg');
  const { scrollId, setScrollId } = useCustomer('id');
  const { id, setId } = useCustomer('id');

  //ここでdetails画面にデータのIDを渡して飛ばす
  function handlePress(customer) {
    console.log('一覧確認', flg, id, page, scrollId);

    //ここで遷移前にIDを保存
    console.log('テスト', customer.id, 'ページ', page);
    setId(customer.id);
    setPage(page);
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
  const searchData = async (searchText, page) => {
    try {
      await fetchData(searchText, page), [searchText, page];
    } catch (error) {
      console.error('エラー', error);
    }
  };

  //検索結果を表示;

  useEffect(() => {
    setTimeout(() => {
      searchData(searchText, page);
    }, 500);
  }, [searchText, page]);

  //検索ボックスをクリア
  const SearchReset = () => {
    //空文字に置き換え未入力に戻す
    setText('');
  };

  //初期表示メソッド

  //初期表示メソッド

  //useFocusEffect(() => {
  const fetchData = async (keyword = '', page = '') => {
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

      //呼び出された際に返却する値
      return customers;

      //   const selectedId = router.params?.selectedId;
      //   // **ここからが追記部分**
      //   if (selectedId) {
      //     // 目的のIDが現在のページのデータに含まれているかチェック
      //     const index = customers.findIndex(item => item.id === selectedId);
      //     if (index !== -1) {
      //       // 目的のIDが見つかったらその位置にスクロール
      //       flatListRef.current.scrollToIndex({
      //         animated: true,
      //         index: data.length - customers.length + index, // グローバルなインデックス
      //       });
      //     } else if (hasMore) {
      //       // 次のページが存在する場合は次のページをロード
      //       fetchData(keyword, page + 1);
      //     }
      //   }
    } catch (error) {
      setIsLoading(false);
      console.log('データの取得に失敗しました。', error);
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
    //console.log('loadMoreData', hasMore, isLoading);
    if (hasMore && !isLoading) {
      //   signOut();
      //console.log('called');
      setPage(prevPage => prevPage + 1);
    }
  };

  //下スワイプ時の処理（更新）
  const onRefresh = () => {
    //console.log('wewewewe');
    setIsLoading(true);
    setRefreshing(true);
    setPage(1);
    fetchData('', 1);
    setId('');
  };

  //目的のIDのデータがあるページを取得し、そのページまでスクロールする
  useFocusEffect(
    useCallback(() => {
      const loadPageAndScroll = async () => {
        if (flg && id) {
          let checkPage = 1; //ページ初期値
          //let found = false;//目的のIDが見つかったか確認
          setIsFetching(true);
          try {
            while (checkPage <= page) {
              const response = await fetchData('', checkPage); // fetchDataで指定ページのデータを取得
              //console.log('確認用1', response);
              if (!response || response.length === 0 || checkPage == page) {
                console.warn('データが取得できませんでした。');
                break; // データがなければループを抜ける
              }
              const customers = response;
              console.log('確認用2'); //, customers);
              if (!customers || customers.length === 0) {
                console.warn('顧客データが取得できませんでした。');
                break; // データがなければループを抜ける
              }

              const index = customers.findIndex(item => item.id === id);
              if (index !== -1) {
                // 目的のIDが見つかったページにスクロール
                flatListRef.current.scrollToIndex({ animated: true, index });
                break;
              }
              checkPage++; // 次のページをロード
            }
          } catch (error) {
            console.error('データ取得中にエラーが発生しました:', error);
          } finally {
            setIsFetching(false); // 例外が発生しても必ず終了処理を実行
          }
        }
      };

      loadPageAndScroll();
    }, [flg, id, page])
  );

  return (
    <SafeAreaView>
      <View style={{ padding: 15, paddingBottom: 250 }}>
        <Text style={{ fontSize: 30 }}>取引先</Text>

        <TextInput
          autoCapitalize="none"
          placeholder="取引先名で検索"
          value={searchText}
          onChangeText={text => setText(text)}
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
