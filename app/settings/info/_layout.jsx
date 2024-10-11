import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Button, useWindowDimensions } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import Bank from './bank';
import Index from './index';
import Report from './report';

//タブと画面の紐付け
const renderScene = SceneMap({
  index: Index,
  report: Report,
  bank: Bank,
});

export default function InfoLayout() {
  const layout = useWindowDimensions(); // 画面のサイズを取得
  const navigation = useNavigation();

  const [index, setIndex] = React.useState(0); // 現在選択されているタブのインデックスを管理
  const [routes] = React.useState([
    { key: 'index', title: '基本情報' },
    { key: 'report', title: '帳票情報' },
    { key: 'bank', title: '振込先' },
  ]);

  // タブのインデックスに応じてステータスバーのボタンを更新
  React.useLayoutEffect(() => {
    console.log('インデックス', routes[index].key);
    console.log('index', index);
    // navigation.setOptions({
    //   title: 'asdfdass',
    //   headerRight: () => (
    //     <Button
    //       onPress={() => navigation.navigate('newBank')} // 新規振込先作成画面に遷移
    //       title="新規振込先"
    //       color="#007AFF" // ボタンの色
    //     />
    //   ),
    // });

    navigation.setOptions({
      headerRight: () =>
        index === 2 ? (
          <Button
            onPress={() => navigation.navigate('newBank')} // 新規振込先作成画面に遷移
            title="新規振込先"
            color="#007AFF" // ボタンの色
          />
        ) : null,
    });
    // if (index === 2) {
    //   // 振込先タブが選択された場合のみボタンを表示

    //   console.log('ボタン表示');
    // } else {
    //   // 他のタブの場合はボタンを非表示にする
    //   //   navigation.setOptions({
    //   //     title: '登録振込先',
    //   //     headerRight: () => (
    //   //       <Button
    //   //         onPress={() => navigation.navigate('newBank')} // 新規振込先作成画面に遷移
    //   //         title="新規振込先"
    //   //         color="#007AFF" // ボタンの色
    //   //       />
    //   //     ),
    //   //   });
    // }
  }, [navigation, index, routes]); // index の変更を監視

  return (
    <TabView
      onIndexChangeq={setIndex}
      navigationState={{ index, routes }} // 現在のタブのインデックスとルート情報を渡す
      renderScene={renderScene} // 表示する画面（シーン）を指定
      onIndexChange={setIndex} // タブが変更された時に呼ばれる
      initialLayout={{ width: layout.width }} // 初期のレイアウト幅を画面の幅に設定
    />
  );
}
