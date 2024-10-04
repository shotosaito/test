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
//import { useSession } from '../../context/SessionProvider';
import { useStorageState } from '../../context/useStorageState';

export default function Settings() {
  //メール送信の設定
  const [mailTitle, setMailTitle] = useState('');
  const [mailBody, setMailBody] = useState('');
  const [companyId, setCompanyId] = useState();
  const [corporate_division, setCorporateDivision] = useState();
  const [tax_consumption, setTaxConsumption] = useState();
  const [tax_rate, setTaxRate] = useState();
  const [tax_rounding, setTaxRounding] = useState();
  const [tax_withholding, setTaxWithholding] = useState();
  const [[isLoading, session], setSession] = useStorageState('session');
  const [errors, setErrors] = useState('');
  //const session = useSession('session');

  const mailSession = JSON.parse(session);
  console.log('セッション1', mailSession);

  //   function saveMail(mailTitle, mailBody) {
  // 	axios
  // 	  .post('https://account-book.test/api/company', {
  // 		mail_title_template: mailTitle,
  // 		mail_body_template: mailBody,
  // 	  })
  // 	  .then(response => {
  // 		console.log('メール本文の設定', response.data);
  // 	  })
  // 	  .catch(error => {
  // 		console.log(error);
  // 	  });
  //   }

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
          //   console.log(
          //     'メール本文の設定',
          //     response.data.company.mail_title_template
          //   );
          setCompanyId(response.data.company.id);
          setMailTitle(response.data.company.mail_title_template);
          setMailBody(response.data.company.mail_body_template);
          setCorporateDivision(response.data.company.corporate_division);
          setTaxConsumption(response.data.company.tax_consumption);
          setTaxRate(response.data.company.tax_rate);
          setTaxRounding(response.data.company.tax_rounding);
          setTaxWithholding(response.data.company.tax_withholding);
          //console.log('oijiojuihiu', response.data.company);
          //console.log(companyId);
        })
        .catch(error => {
          console.log(error);
        });
    }

    console.log(mailTitle, mailBody);
  }, [session]);

  function saveMail() {
    // if (!companyId) {
    //   console.log('companyId が設定されていません');
    //   return;
    // }
    //console.log('owwaawawawa', session);
    console.log(companyId);
    axios
      .put(
        `https://account-book.test/api/company/${companyId}`,
        {
          corporate_division,
          tax_consumption,
          tax_rate,
          tax_rounding,
          tax_withholding,

          mail_title_template: mailTitle, // 更新するメールタイトル
          mail_body_template: mailBody,
        },
        {
          headers: {
            Authorization: `Bearer ${mailSession}`, // セッショントークンをヘッダーに追加
          },
        }
      )
      .then(response => {
        //console.log('メールが更新されました:', response.data);
        Alert.alert('更新しました');
        if (response.data) {
          setErrors('');
        }
      })
      .catch(error => {
        setErrors(error.response.data.errors);
        console.log('更新に失敗しました:', error);
      });
  }

  return (
    <SafeAreaView>
      <View style={{ padding: 15, paddingBottom: 250 }}>
        <Text style={{ fontSize: 35 }}>メール本文の設定</Text>

        <Text style={{ fontSize: 20 }}>件名[必須]</Text>

        <TextInput
          value={mailTitle}
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 10,
          }}
          onChangeText={text => setMailTitle(text)}
        />
        <Text style={{ color: 'red' }}>{errors['mail_title_template']}</Text>

        <Text style={{ fontSize: 20 }}>本文[必須]</Text>

        <TextInput
          value={mailBody}
          multiline // 複数行入力
          scrollEnabled={true} // 長文の際にスクロール可能にする
          style={{
            height: 400,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 10,
          }}
          onChangeText={text => setMailBody(text)}
        />
        <Text style={{ color: 'red' }}>{errors['mail_body_template']}</Text>
        <Button title="更新" onPress={saveMail} />
      </View>
    </SafeAreaView>
  );
}
