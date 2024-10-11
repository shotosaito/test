import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

//import { Button } from 'react-native-paper';

export default function newBank() {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
  });

  // フォームの入力を管理する関数
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // フォームの送信処理
  const handleFormSubmit = () => {
    console.log('振込先情報:', formData);
    setModalVisible(false); // モーダルを閉じる
  };

  return (
    <View style={styles.container}>
      {/* 振込先リスト画面 */}
      <Text>登録振込先</Text>
      <Button title="新規振込先" onPress={() => setModalVisible(true)} />

      {/* モーダル */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Androidでバックボタンを押した際の動作
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新規振込先登録</Text>

            {/* 振込先名の入力 */}
            <TextInput
              style={styles.input}
              placeholder="振込先名"
              value={formData.bankName}
              onChangeText={text => handleInputChange('bankName', text)}
            />

            {/* 口座番号の入力 */}
            <TextInput
              style={styles.input}
              placeholder="口座番号"
              value={formData.accountNumber}
              keyboardType="numeric"
              onChangeText={text => handleInputChange('accountNumber', text)}
            />

            {/* フォーム送信ボタン */}
            <Button title="登録" onPress={handleFormSubmit} />

            {/* モーダルを閉じるボタン */}
            <Button title="閉じる" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
