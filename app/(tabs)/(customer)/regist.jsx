import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function Details() {
  const router = useRouter();
  const params = useLocalSearchParams(); //データのID取得

  const [name, setName] = useState('');
  const [honorific, setHonorific] = useState('1');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [department_name, setDepartmentName] = useState('');
  const [print_department_name, setDepartmentCheck] = useState(false);
  const [representative_name, setRepresentativeName] = useState('');
  const [print_representative_name, setRepresentativeCheck] = useState(false);
  const [errors, setErrors] = useState('');

  const handleSave = async () => {
    // 入力データをAPIに送信
    try {
      const userData = await SecureStore.getItemAsync('user');
      const { token } = JSON.parse(userData);

      const response = await axios.post(
        `https://account-book.test/api/customers`,
        {
          name,
          email,
          honorific,
          code,
          department_name,
          representative_name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // トークンをヘッダーに追加
          },
        }
      );
      Alert.alert('登録しました');

      router.back(); //登録後一覧に戻る

      if (response.data) {
        setErrors('');
      }
    } catch (error) {
      setErrors(error.response.data.errors);
      console.log(error.response.data.errors);
    }
  };

  const style = {
    width: '80%',
    height: 20,
    paddingHorizontal: 10,
    borderWidth: 0.2,
    borderColor: 'gray',
    fontSize: 13,
  };

  return (
    <View style={{ padding: 15 }}>
      <Text>取引先名[必須]</Text>
      <TextInput
        style={style}
        value={name}
        onChangeText={setName}
        placeholder="取引先名"
      />
      <Text style={{ color: 'red' }}>{errors['name']}</Text>

      <Text>敬称</Text>
      <RNPickerSelect
        items={[
          { label: '御中', value: '1' },
          { label: '様', value: '2' },
          { label: '敬称なし', value: '3' },
        ]}
        onValueChange={value => {
          setHonorific(value);
        }}
        value={honorific}
        placeholder={{}}
        style={{ inputIOS: { paddingHorizontal: 10 } }}
      />
      <Text style={{ color: 'red' }}>{errors['honorific']}</Text>

      <Text>メールアドレス</Text>
      <TextInput
        style={style}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <Text style={{ color: 'red' }}>{errors['email']}</Text>
      <Text>取引先コード</Text>
      <TextInput
        style={style}
        value={code}
        onChangeText={setCode}
        placeholder="取引先コード"
      />
      <Text style={{ color: 'red' }}>{errors['code']}</Text>
      <Text>部署名/事業部名</Text>
      <TextInput
        style={style}
        value={department_name}
        onChangeText={setDepartmentName}
        placeholder="部署名/事業部名"
      />

      <View
        style={{
          flexDirection: 'row',
          top: 10,
          left: 10,
          alignItems: 'center',
          gap: 8,
        }}
      >
        <CheckBox
          //style={{ width: 5, height: 5 }}
          disabled={false}
          boxType="square"
          tintColor="#888"
          onTintColor="#0b0"
          onCheckColor="#0d0"
          animationDuration={0.1}
          value={print_department_name}
          onValueChange={newValue => setDepartmentCheck(newValue)}
        />
        <Text>印字する</Text>
      </View>

      <Text style={{ color: 'red' }}>{errors['department_name']}</Text>
      <Text>担当者名</Text>
      <TextInput
        style={style}
        value={representative_name}
        onChangeText={setRepresentativeName}
        placeholder="担当者名"
      />

      <View
        style={{
          flexDirection: 'row',
          top: 10,
          left: 10,
          alignItems: 'center',
          gap: 8,
        }}
      >
        <CheckBox
          disabled={false}
          boxType="square"
          tintColor="#888"
          onTintColor="#0b0"
          onCheckColor="#0d0"
          animationDuration={0.1}
          value={print_representative_name}
          onValueChange={newValue => setRepresentativeCheck(newValue)}
        />
        <Text>印字する</Text>
      </View>

      <Text style={{ color: 'red' }}>{errors['representative_name']}</Text>
      <Button title="登録" onPress={handleSave} />
    </View>
  );
}
