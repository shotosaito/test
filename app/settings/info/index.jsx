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
import { RadioButton } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { useStorageState } from '../../context/useStorageState';
import { SettingsState } from '../../models/settingsModel';

export default function Index() {
  //   const [companyId, setCompanyId] = useState();
  //   const [corporate_division, setCorporate_division] = useState(); //事業形態
  //   const [name, setName] = useState(''); //会社名
  //   const [closing_month, setClosing_month] = useState(''); //決算月
  //   const [qualified_invoice_issuer_code, setQualified_invoice_issuer_code] =
  // useState(''); //インボイス
  //   const [department_name, setDepartment_name] = useState(''); //部署名
  //   const [representative_name, setRepresentative_name] = useState(''); //担当者名
  //   const [postal_code, setPostal_code] = useState(''); //郵便番号
  //   const [address_street_1, setAddress_street_1] = useState(''); //住所
  //   const [address_street_2, setAddress_street_2] = useState(''); //ビル名
  //   const [email, setEmail] = useState(''); //メールアドレス
  //   const [tel, setTel] = useState(''); //電話番号
  //   const [mail_title_template, setMailTitle] = useState('');
  //   const [mail_body_template, setMailBody] = useState('');
  //   const [tax_consumption, setTaxConsumption] = useState('');
  //   const [tax_rate, setTaxRate] = useState('');
  //   const [tax_rounding, setTaxRounding] = useState('');
  //   const [tax_withholding, setTaxWithholding] = useState('');
  const [inputs, setInputs] = useState(SettingsState);
  const [[isLoading, session], setSession] = useStorageState('session');
  const infoSession = JSON.parse(session);
  const [errors, setErrors] = useState('');

  console.log('自社セッション', infoSession);

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
          console.log('自社', response.data);
          setInputs({
            ...inputs,
            ...response.data.company,
          });

          //   setCompanyId(response.data.company.id);
          //   setCorporate_division(response.data.company.corporate_division); //事業形態
          //   setName(response.data.company.name); //会社名
          //   setQualified_invoice_issuer_code(
          // response.data.company.qualified_invoice_issuer_code
          //); //インボイス
          //   setDepartment_name(response.data.company.department_name); //部署名
          //   setRepresentative_name(response.data.company.representative_name); //担当者名
          //   setPostal_code(response.data.company.postal_code); //郵便番号
          //   setAddress_street_1(response.data.company.address_street_1); //住所
          //   setAddress_street_2(response.data.company.address_street_2); //ビル名
          //   setEmail(response.data.company.email); //メールアドレス
          //   setTel(response.data.company.tel); //電話番号

          //   setMailTitle(response.data.company.mail_title_template);
          //   setMailBody(response.data.company.mail_body_template);
          //   setTaxConsumption(response.data.company.tax_consumption);
          //   setTaxRate(response.data.company.tax_rate);
          //   setTaxRounding(response.data.company.tax_rounding);
          //   setTaxWithholding(response.data.company.tax_withholding);

          //console.log(companyId);
        })
        .catch(error => {
          setErrors(error.response.data.errors);
          console.log('エラーーー', error);
        });
    }
  }, [session]);

  function saveInfo() {
    console.log(
      'saveInfo',
      inputs.corporate_division,
      inputs.name,
      inputs.closing_month,
      inputs.qualified_invoice_issuer_code,
      inputs.department_name,
      inputs.representative_name,
      inputs.postal_code,
      inputs.address_street_1,
      inputs.address_street_2,
      inputs.email,
      inputs.tel
    );
    axios
      .put(
        `https://account-book.test/api/company/${inputs.id}`,
        {
          corporate_division: inputs.corporate_division,
          name: inputs.name,
          closing_month: inputs.closing_month,
          qualified_invoice_issuer_code: inputs.qualified_invoice_issuer_code,
          department_name: inputs.department_name,
          representative_name: inputs.representative_name,
          postal_code: inputs.postal_code,
          address_street_1: inputs.address_street_1,
          address_street_2: inputs.address_street_2,
          email: inputs.email,
          tel: inputs.tel,
          mail_title_template: inputs.mail_title_template,
          mail_body_template: inputs.mail_body_template,
          tax_consumption: inputs.tax_consumption,
          tax_rate: inputs.tax_rate,
          tax_rounding: inputs.tax_rounding,
          tax_withholding: inputs.tax_withholding,
        },
        {
          headers: {
            Authorization: `Bearer ${infoSession}`, // セッショントークンをヘッダーに追加
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
        console.log('エラー', errors);
        console.log('更新に失敗しました:', error);
      });
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 15, paddingBottom: 250 }}>
          <Text style={{ fontSize: 35 }}>自社情報の編集</Text>
          <Text style={{ fontSize: 20 }}>事業形態</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              value="1"
              status={inputs.corporate_division === 1 ? 'checked' : 'unchecked'}
              onPress={() => handleInputs(1, 'corporate_division')}
            />
            <Text>法人</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              value="2"
              status={inputs.corporate_division === 2 ? 'checked' : 'unchecked'}
              onPress={() => handleInputs(2, 'corporate_division')}
            />
            <Text>個人事業主・フリーランス・その他</Text>
          </View>

          {inputs.corporate_division === 1 ? (
            <>
              <Text style={{ fontSize: 20 }}>会社名[必須]</Text>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 20 }}>屋号</Text>
            </>
          )}
          <TextInput
            value={inputs.name}
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
            placeholder="会社名"
            onChangeText={text => handleInputs(text, 'name')}
          />
          <Text style={{ color: 'red' }}>{errors['name']}</Text>

          {inputs.corporate_division === 1 && (
            // 親要素で囲まないと条件を適用できません。
            <>
              <Text style={{ fontSize: 20 }}>決算月</Text>
              <RNPickerSelect
                items={[
                  { label: '1月', value: '1' },
                  { label: '2月', value: '2' },
                  { label: '3月', value: '3' },
                  { label: '4月', value: '4' },
                  { label: '5月', value: '5' },
                  { label: '6月', value: '6' },
                  { label: '7月', value: '7' },
                  { label: '8月', value: '8' },
                  { label: '9月', value: '9' },
                  { label: '10月', value: '10' },
                  { label: '11月', value: '11' },
                  { label: '12月', value: '12' },
                ]}
                onValueChange={value => {
                  handleInputs(value, 'closing_month');
                }}
                value={inputs.closing_month}
                placeholder={{}}
                style={{ inputIOS: { paddingHorizontal: 10 } }}
              />
            </>
          )}
          <Text style={{ color: 'red' }}>{errors['honorific']}</Text>

          <Text style={{ fontSize: 20 }}>登録番号</Text>
          <TextInput
            value={inputs.qualified_invoice_issuer_code}
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
            placeholder="例) T0000000000000"
            onChangeText={text =>
              handleInputs(text, 'qualified_invoice_issuer_code')
            }
          />
          <Text style={{ color: 'red' }}>
            {errors['qualified_invoice_issuer_code']}
          </Text>

          {inputs.corporate_division === 1 && (
            <>
              <Text style={{ fontSize: 20 }}>部署名/事業部名</Text>
              <TextInput
                value={inputs.department_name}
                style={{
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  padding: 10,
                }}
                onChangeText={text => handleInputs(text, 'department_name')}
              />
              <Text style={{ color: 'red' }}>{errors['department_name']}</Text>
            </>
          )}

          <Text style={{ fontSize: 20 }}>担当者名</Text>
          <TextInput
            value={inputs.representative_name}
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
            onChangeText={text => handleInputs(text, 'representative_name')}
          />
          <Text style={{ color: 'red' }}>{errors['representative_name']}</Text>

          <Text style={{ fontSize: 20 }}>郵便番号</Text>
          <TextInput
            value={inputs.postal_code}
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
            placeholder="例) 000−0000"
            onChangeText={text => handleInputs(text, 'postal_code')}
          />
          <Text style={{ color: 'red' }}>{errors['postal_code']}</Text>

          <Text style={{ fontSize: 20 }}>住所</Text>
          <TextInput
            value={inputs.address_street_1}
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
            placeholder="例) 〇〇県△△市□□町 1-2-3"
            onChangeText={text => handleInputs(text, 'address_street_1')}
          />
          <Text style={{ color: 'red' }}>{errors['address_street_1']}</Text>

          <Text style={{ fontSize: 20 }}>ビル名/階/部屋番号など</Text>
          <TextInput
            value={inputs.address_street_2}
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
            placeholder="例) サンプルビル 3F"
            onChangeText={text => handleInputs(text, 'address_street_2')}
          />
          <Text style={{ color: 'red' }}>{errors['address_street_2']}</Text>

          <Text style={{ fontSize: 20 }}>メールアドレス</Text>
          <TextInput
            value={inputs.email}
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
            placeholder="example@account-book.jp"
            onChangeText={text => handleInputs(text, 'email')}
          />
          <Text style={{ color: 'red' }}>{errors['email']}</Text>

          <Text style={{ fontSize: 20 }}>TEL</Text>
          <TextInput
            value={inputs.tel}
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              padding: 10,
            }}
            placeholder="例) 03-0000-0000"
            onChangeText={text => handleInputs(text, 'tel')}
          />
          <Text style={{ color: 'red' }}>{errors[inputs.tel]}</Text>

          <Button title="更新" onPress={saveInfo} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
