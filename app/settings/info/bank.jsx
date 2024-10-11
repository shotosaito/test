import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { ProgressBar } from 'react-native-paper';
import { useStorageState } from '../../context/useStorageState';
import { bankSettingsState } from '../../models/settingsModel';

export default function Bank() {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    bank_name: '',
    branch_name: '',
    account_type: '',
    account_number: '',
    account_name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // 送信中かどうかを管理
  const [progress, setProgress] = useState(0);
  const [[isLoading, session], setSession] = useStorageState('session');
  const [bankInput, setBankInput] = useState('BankSettingsState');
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [step, setStep] = useState(1); // 現在のステップを管理

  //console.log('kokoko', session);
  const bankSession = JSON.parse(session);
  console.log('呼び出し', bankSettingsState);

  console.log('bankSession', bankSession);
  // 振込先リストを取得

  useEffect(() => {
    const bankData = async () => {
      if (!bankSession) {
        console.log('セッションがありません');
        return;
      }
      try {
        const response = await axios.get(
          'https://account-book.test/api/banks',
          {
            headers: {
              Authorization: `Bearer ${bankSession}`,
            },
          }
        );
        setData(response.data.data.banks);
        console.log('取得ダータ', response.data.data.banks);
      } catch (error) {
        console.error('エラー', error);
        setError('データの取得に失敗しました');
      }
    };

    bankData();
  }, [bankSession]); // 空の依存配列で初回レンダー時のみ実行

  //リストアイテム設定

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * React FlatListのレンダー関数
   * @param {{ item: { bank_name: string } }} props
   * @returns {React.ReactElement}
   */
  /******  eab74378-a503-4314-8dce-45414f9f30fc  *******/

  // フォームの入力を管理する関数
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 次のステップに進む関数
  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      setProgress((step + 1) / 3); // 進捗バーの更新
    } else {
      handleFormSubmit(); // 最後のステップでは送信処理
    }
  };

  // 前のステップに戻る関数
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress((step - 1) / 3); // 進捗バーの更新
    }
  };

  // フォームの送信処理
  const handleFormSubmit = () => {
    console.log('振込先情報:', formData);
    setModalVisible(false); // モーダルを閉じる
  };

  function bankList({ item }) {
    return (
      // 文字押下時に画面遷移処理を行う
      <Pressable onPress={() => handlePress(data)}>
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
                    {item.bank_name}
                  </Text>
                  <Text style={{ flexShrink: 0, width: 100 }}>
                    {item.branch_name}
                  </Text>
                  <Text style={{ flexShrink: 0, width: 100 }}>
                    {item.account_type}
                  </Text>
                  <Text style={{ flexShrink: 0, width: 100 }}>
                    {item.account_number}
                  </Text>
                  <Text style={{ flexShrink: 0, width: 100 }}>
                    {item.account_name}
                  </Text>
                </View>
              </View>
            </View>
            <View></View>
          </ListItem>
        </Card>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      {/* 振込先リスト画面 */}

      <Button title="新規振込先" onPress={() => setModalVisible(true)} />

      <FlatList
        data={data} //APIから取得したデータ
        keyExtractor={data => data.id.toString()}
        renderItem={bankList}
        ListEmptyComponent={() => <Text>取引先はありません。</Text>}
      />

      {/* モーダル */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Androidでバックボタンを押した際の動作
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>金融機関選択 {step}/3</Text>
            {/* 進捗バー */}
            <ProgressBar progress={progress} color={'#007AFF'} />

            {/* 各ステップの内容 */}
            {step === 1 && (
              <View>
                <Text>金融機関名を入力してください</Text>
                <TextInput
                  style={styles.input}
                  value={formData.bank_name}
                  onChangeText={text => handleInputChange('bank_name', text)}
                />
              </View>
            )}
            {step === 2 && (
              <View>
                <Text>口座番号を入力してください</Text>
                <TextInput
                  style={styles.input}
                  value={formData.branch_name}
                  onChangeText={text => handleInputChange('branch_name', text)}
                />
              </View>
            )}
            {step === 3 && (
              <View>
                <Text>口座種別を入力してください</Text>

                <Text>口座番号を入力してください</Text>
                <TextInput
                  style={styles.input}
                  value={formData.account_number}
                  onChangeText={text =>
                    handleInputChange('account_number', text)
                  }
                />
                <Text>口座名義を入力してください</Text>
                <TextInput
                  style={styles.input}
                  value={formData.account_name}
                  onChangeText={text => handleInputChange('account_name', text)}
                />
              </View>
            )}

            {/* ナビゲーションボタン */}
            <View style={styles.buttonContainer}>
              {step > 1 && <Button title="戻る" onPress={handlePrevStep} />}
              <Button
                title={step === 3 ? '登録' : '次へ'}
                onPress={handleNextStep}
              />
            </View>

            {/* モーダルを閉じるボタン */}
            <Button title="キャンセル" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 背景を半透明に
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
