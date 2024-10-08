import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useStorageState } from '../../context/useStorageState';
import { SettingsState } from '../../models/settingsModel';

export default function Settings() {
  //メール送信の設定
  //   const [mail_title_template, setmail_title_template] = useState('');
  //   const [mail_body_template, setmail_body_template] = useState('');
  //   const [companyId, setCompanyId] = useState();
  //   const [corporate_division, setCorporateDivision] = useState();
  //   const [tax_consumption, setTaxConsumption] = useState();
  //   const [tax_rate, setTaxRate] = useState();
  //   const [tax_rounding, setTaxRounding] = useState();
  //   const [tax_withholding, setTaxWithholding] = useState();
  const [errors, setErrors] = useState('');
  const [[isLoading, session], setSession] = useStorageState('session');
  //const [SettingsState] = useSettingsState('');

  console.log('呼び出し', SettingsState);

  //   const mailState = {
  //     mail_title_template: '',
  //     mail_body_template: '',
  //     companyId: '',
  //     corporate_division: '',
  //     tax_consumption: '',
  //     tax_rate: '',
  //     tax_rounding: '',
  //     tax_withholding: '',
  //     errors: '',
  //   };

  const [inputs, setInputs] = useState(SettingsState);

  //   const handleInputs = (value, name) => {
  //     setInputs(inputs => ({
  //       ...inputs,
  //       [name]: value,
  //     }));
  //   };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  const mailSession = JSON.parse(session);
  console.log('セッション1', mailSession);

  // メールタイトルを更新する関数

  useEffect(() => {
    if (mailSession) {
      axios
        .get('https://account-book.test/api/company', {
          headers: {
            Authorization: `Bearer ${mailSession}`, // セッショントークンをヘッダーに追加
          },
        })
        .then(response => {
          console.log('取得したデータ', response.data.company);
          console.log('エラー', response.data.errors);
          //   setCompanyId(response.data.company.id);
          //   setmail_title_template(response.data.company.mail_title_template);
          //   setmail_body_template(response.data.company.mail_body_template);
          //   setCorporateDivision(response.data.company.corporate_division);
          //   setTaxConsumption(response.data.company.tax_consumption);
          //   setTaxRate(response.data.company.tax_rate);
          //   setTaxRounding(response.data.company.tax_rounding);
          //   setTaxWithholding(response.data.company.tax_withholding);

          setInputs({
            ...inputs,
            ...response.data.company,
            // mail_title_template: response.data.company.mail_title_template,
            // mail_body_template: response.data.company.mail_body_template,
            // corporate_division: response.data.company.corporate_division,
            // tax_consumption: response.data.company.tax_consumption,
            // tax_rate: response.data.company.tax_rate,
            // tax_rounding: response.data.company.tax_rounding,
            // tax_withholding: response.data.company.tax_withholding,
          });
          console.log('保存したデータ', inputs);
        })
        .catch(errors => {
          console.log(errors);
        });
    }

    //console.log(mail_title_template, mail_body_template);
  }, [session]);

  function saveMail() {
    //console.log(inputs.id);
    axios
      .put(
        `https://account-book.test/api/company/${inputs.id}`,
        {
          corporate_division: inputs.corporate_division,
          tax_consumption: inputs.tax_consumption,
          tax_rate: inputs.tax_rate,
          tax_rounding: inputs.tax_rounding,
          tax_withholding: inputs.tax_withholding,

          mail_title_template: inputs.mail_title_template, // 更新するメールタイトル
          mail_body_template: inputs.mail_body_template,
        },
        {
          headers: {
            Authorization: `Bearer ${mailSession}`, // セッショントークンをヘッダーに追加
          },
        }
      )
      .then(response => {
        console.log('メールが更新されました:', response.data);
        Alert.alert('更新しました');
        if (response.data) {
          setErrors('');
        }
      })
      .catch(error => {
        setErrors(error.response.data.errors);
        console.log('エラー', errors);
        console.log('更新に失敗しました:', error);
      });
  }

  return (
    <SafeAreaView>
      <View style={{ padding: 15, paddingBottom: 250 }}>
        <Text style={{ fontSize: 35 }}>メール本文の設定</Text>

        <Text style={{ fontSize: 20 }}>件名[必須]</Text>

        <TextInput
          value={inputs.mail_title_template}
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 10,
          }}
          onChangeText={text => handleOnchange(text, 'mail_title_template')}
        />
        <Text style={{ color: 'red' }}>{errors['mail_title_template']}</Text>

        <Text style={{ fontSize: 20 }}>本文[必須]</Text>

        <TextInput
          value={inputs.mail_body_template}
          multiline // 複数行入力
          scrollEnabled={true} // 長文の際にスクロール可能にする
          style={{
            height: 400,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 10,
          }}
          onChangeText={text => handleOnchange(text, 'mail_body_template')}
        />
        <Text style={{ color: 'red' }}>{errors['mail_body_template']}</Text>
        <Button title="更新" onPress={saveMail} />
      </View>
    </SafeAreaView>
  );
}
