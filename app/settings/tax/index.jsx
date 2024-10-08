import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
//import { useSession } from '../../context/SessionProvider';
import { useStorageState } from '../../context/useStorageState';
import { SettingsState } from '../../models/settingsModel';

export default function Settings() {
  //課税設定
  //   const { session, isLoading, errors, signIn, signOut } = useSession();
  //   const [checkedA, setCheckedA] = useState('消費税0');
  //   const [checkedB, setCheckedB] = useState('消費税端数処理0');
  //   const [checkedC, setCheckedC] = useState('源泉徴収0');
  //   const [mail_title_template, setMailTitle] = useState('');
  //   const [mail_body_template, setMailBody] = useState('');
  //   const [companyId, setCompanyId] = useState();
  //   const [corporate_division, setCorporateDivision] = useState();
  //   const [tax_consumption, setTax_consumption] = useState('');
  //   const [tax_rate, setTax_rate] = useState('');
  //   const [tax_rounding, setTax_rounding] = useState('');
  //   const [tax_withholding, setTax_withholding] = useState('');
  const [[isLoading, session], setSession] = useStorageState('session');
  const [inputs, setInputs] = useState(SettingsState);
  const [errors, setErrors] = useState('');

  const taxSession = JSON.parse(session);
  console.log('セッション1', taxSession);

  const handleInputs = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  useEffect(() => {
    if (taxSession) {
      axios
        .get('https://account-book.test/api/company', {
          headers: {
            Authorization: `Bearer ${taxSession}`, // セッショントークンをヘッダーに追加
          },
        })
        .then(response => {
          console.log('課税設定', response.data.company);
          setInputs({
            ...inputs,
            ...response.data.company,
          });
          //   console.log(
          //     '課税設定',
          //     response.data.company.tax_rate,
          //     response.data.company.tax_consumption,
          //     response.data.company.tax_rounding,
          //     response.data.company.tax_withholding
          //   );
          //   setCompanyId(response.data.company.id);
          //   setMailTitle(response.data.company.mail_title_template);
          //   setMailBody(response.data.company.mail_body_template);
          //   setCorporateDivision(response.data.company.corporate_division);

          //   setMailTitle(response.data.company.mail_title_template);
          //   setMailBody(response.data.company.mail_body_template);
          //   setCorporateDivision(response.data.company.corporate_division);
          //   setCompanyId(response.data.company.id);
          //   setTax_rate(response.data.company.tax_rate);
          //   setTax_consumption(response.data.company.tax_consumption); //消費税
          //   setTax_rounding(response.data.company.tax_rounding); //消費税端数処理
          //   setTax_withholding(response.data.company.tax_withholding); //源泉徴収
          //   //console.log(companyId);
          console.log('保存したデータ', inputs);
        })
        .catch(error => {
          setErrors(error.response.data.errors);
          console.log('エラーーー', error);
        });
    }
  }, [session]);

  //   console.log(
  //     'わわわわあw',
  //     tax_consumption,
  //     tax_rate,
  //     tax_rounding,
  //     tax_withholding
  //   );

  function saveTax() {
    // console.log(
    //   '保存前',
    //   tax_consumption,
    //   tax_rate,
    //   tax_rounding,
    //   tax_withholding
    // );
    axios
      .put(
        `https://account-book.test/api/company/${inputs.id}`,
        {
          corporate_division: inputs.corporate_division,
          tax_consumption: inputs.tax_consumption,
          tax_rate: inputs.tax_rate,
          tax_rounding: inputs.tax_rounding,
          tax_withholding: inputs.tax_withholding,
          mail_title_template: inputs.mail_title_template,
          mail_body_template: inputs.mail_body_template,
        },
        {
          headers: {
            Authorization: `Bearer ${taxSession}`, // セッショントークンをヘッダーに追加
          },
        }
      )
      .then(response => {
        console.log('課税が更新されました:', response.data);
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
        <Text style={{ fontSize: 35 }}>課税設定</Text>
        <Text style={{ fontSize: 20 }}>消費税</Text>
        <Text style={{ color: 'red' }}>{errors['tax_consumption']}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="1"
            status={inputs.tax_consumption === 1 ? 'checked' : 'unchecked'}
            onPress={() => handleInputs(1, 'tax_consumption')}
          />
          <Text>税別表示</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="2"
            status={inputs.tax_consumption === 2 ? 'checked' : 'unchecked'}
            onPress={() => handleInputs(2, 'tax_consumption')}
          />
          <Text>税込表示</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="3"
            status={inputs.tax_consumption === 3 ? 'checked' : 'unchecked'}
            onPress={() => handleInputs(3, 'tax_consumption')}
          />
          <Text>税込表示（免税）</Text>
        </View>

        <Text style={{ fontSize: 20 }}>消費税端数処理</Text>

        <Text style={{ color: 'red' }}>{errors['tax_rounding']}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="1"
            status={inputs.tax_rounding === 1 ? 'checked' : 'unchecked'}
            onPress={() => handleInputs(1, 'tax_rounding')}
          />
          <Text>切捨て</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="2"
            status={inputs.tax_rounding === 2 ? 'checked' : 'unchecked'}
            onPress={() => handleInputs(2, 'tax_rounding')}
          />
          <Text>切上げ</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="3"
            status={inputs.tax_rounding === 3 ? 'checked' : 'unchecked'}
            onPress={() => handleInputs(3, 'tax_rounding')}
          />
          <Text>四捨五入</Text>
        </View>

        <Text style={{ fontSize: 20 }}>源泉徴収</Text>

        <Text style={{ color: 'red' }}>{errors['tax_withholding']}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="1"
            status={inputs.tax_withholding === 1 ? 'checked' : 'unchecked'}
            onPress={() => handleInputs(1, 'tax_withholding')}
          />
          <Text>なし</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="2"
            status={inputs.tax_withholding === 2 ? 'checked' : 'unchecked'}
            onPress={() => handleInputs(2, 'tax_withholding')}
          />
          <Text>あり(10.21％復興税)</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="3"
            status={inputs.tax_withholding === 3 ? 'checked' : 'unchecked'}
            onPress={() => handleInputs(3, 'tax_withholding')}
          />
          <Text>あり(10％)</Text>
        </View>
        <Button title="更新" onPress={saveTax} />
      </View>
    </SafeAreaView>
  );
}
