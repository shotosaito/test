import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useStorageState } from '../../context/useStorageState';
import { ReportSettingsState } from '../../models/settingsModel';

export default function Index() {
  const [inputs, setInputs] = useState(ReportSettingsState);
  const [[isLoading, session], setSession] = useStorageState('session');
  const infoSession = JSON.parse(session);
  const [errors, setErrors] = useState('');

  const [preview, setPreview] = useState('');

  //console.log('自社セッション', infoSession);

  const handleInputs = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  useEffect(() => {
    if (infoSession) {
      axios
        .get('https://account-book.test/api/company', {
          headers: {
            Authorization: `Bearer ${infoSession}`, // セッショントークンをヘッダーに追加
          },
        })
        .then(response => {
          //console.log('自社', response.data);
          setInputs({
            ...inputs,
            ...response.data.company,
          });
        })
        .catch(error => {
          setErrors(error.response.data.errors);
          console.log('エラーーー', error);
        });
    }
  }, [session]);

  const handleInputChange = (name, value) => {
    setInputs(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // 変換されたデータを取得してプレビューを更新する関数
  const generatePreview = async () => {
    try {
      //console.log('初期', inputs.document_code_rule);
      const response = await axios.get(
        `https://account-book.test/api/companies/${inputs.id}/generate-code`,
        {
          params: {
            rule: inputs.document_code_rule,
          },
          headers: {
            Authorization: `Bearer ${infoSession}`, // セッショントークンをヘッダーに追加
          },
        }
      );
      setPreview(response.data.code); // プレビューを更新
    } catch (error) {
      console.log('プレビュー生成エラー:', error);
      setErrors('プレビューの取得に失敗しました');
    }
  };

  useEffect(() => {
    if (inputs.document_code_rule) {
      generatePreview();
    }
  }, [inputs.document_code_rule]);

  async function saveInfo() {
    try {
      const response = await axios.put(
        `https://account-book.test/api/company/${inputs.id}`,
        {
          corporate_division: inputs.corporate_division,
          mail_title_template: inputs.mail_title_template,
          mail_body_template: inputs.mail_body_template,
          tax_consumption: inputs.tax_consumption,
          tax_rate: inputs.tax_rate,
          tax_rounding: inputs.tax_rounding,
          tax_withholding: inputs.tax_withholding,
          document_code_rule: preview,
          remarks_delivery: inputs.remarks_delivery,
          remarks_estimate: inputs.remarks_estimate,
          remarks_invoice: inputs.remarks_invoice,
          remarks_purchase_order: inputs.remarks_purchase_order,
          remarks_receipt: inputs.remarks_receipt,
        },
        {
          headers: {
            Authorization: `Bearer ${infoSession}`, // セッショントークンをヘッダーに追加
          },
        }
      );

      //.then(response => {
      console.log('帳票が更新されました:', response.data);
      Alert.alert('更新しました');
      if (response.data) {
        setErrors('');
      }
    } catch (error) {
      //)
      // エラーハンドリング
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
        console.log('エラー', error.response.data.errors);
      } else {
        console.log('更新に失敗しました:', error);
      }
    }
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 15, paddingBottom: 250 }}>
          <Text>ロゴ</Text>
          <Text>陰影</Text>
          <Text>帳票番号の採番</Text>
          <TextInput
            value={inputs.document_code_rule}
            onChangeText={text => handleInputChange('document_code_rule', text)}
            placeholder="例) {Y}{M}{D}-01"
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
          ></TextInput>

          <Text>プレビュー：{preview}</Text>

          <Text>請求書備考</Text>
          <TextInput
            value={inputs.remarks_invoice}
            onChangeText={text => handleInputs(text, 'remarks_invoice')}
            multiline
            style={{
              height: 200,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
          ></TextInput>
          <Text>見積書備考</Text>
          <TextInput
            value={inputs.remarks_estimate}
            onChangeText={text => handleInputs(text, 'remarks_estimate')}
            multiline
            style={{
              height: 200,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
          ></TextInput>
          <Text>発注書備考</Text>
          <TextInput
            value={inputs.remarks_purchase_order}
            onChangeText={text => handleInputs(text, 'remarks_purchase_order')}
            multiline
            style={{
              height: 200,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
          ></TextInput>
          <Text>納品書備考</Text>
          <TextInput
            value={inputs.remarks_delivery}
            onChangeText={text => handleInputs(text, 'remarks_delivery')}
            multiline
            style={{
              height: 200,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
          ></TextInput>
          <Text>領収書備考</Text>
          <TextInput
            value={inputs.remarks_receipt}
            onChangeText={text => handleInputs(text, 'remarks_receipt')}
            multiline
            style={{
              height: 200,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
          ></TextInput>

          <Button title="更新" onPress={saveInfo} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
