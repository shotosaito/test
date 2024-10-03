import React, { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useSession } from '../../context/SessionProvider';

export default function Settings() {
  //課税設定
  const { session, isLoading, errors, signIn, signOut } = useSession();
  const [checkedA, setCheckedA] = useState('消費税0');
  const [checkedB, setCheckedB] = useState('消費税端数処理0');
  const [checkedC, setCheckedC] = useState('源泉徴収0');

  return (
    <SafeAreaView>
      <View style={{ padding: 15, paddingBottom: 250 }}>
        <Text style={{ fontSize: 30 }}>test</Text>

        <Text style={{ fontSize: 35 }}>課税設定</Text>
        <Text style={{ fontSize: 20 }}>消費税</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="消費税0"
            status={checkedA === '消費税0' ? 'checked' : 'unchecked'}
            onPress={() => setCheckedA('消費税0')}
          />
          <Text>税別表示</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="消費税1"
            status={checkedA === '消費税1' ? 'checked' : 'unchecked'}
            onPress={() => setCheckedA('消費税1')}
          />
          <Text>税込表示</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="消費税2"
            status={checkedA === '消費税2' ? 'checked' : 'unchecked'}
            onPress={() => setCheckedA('消費税2')}
          />
          <Text>税込表示（免税）</Text>
        </View>

        <Text style={{ fontSize: 20 }}>消費税端数処理</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="消費税端数処理0"
            status={checkedB === '消費税端数処理0' ? 'checked' : 'unchecked'}
            onPress={() => setCheckedB('消費税端数処理0')}
          />
          <Text>切捨て</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="消費税端数処理1"
            status={checkedB === '消費税端数処理1' ? 'checked' : 'unchecked'}
            onPress={() => setCheckedB('消費税端数処理1')}
          />
          <Text>切上げ</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="消費税端数処理2"
            status={checkedB === '消費税端数処理2' ? 'checked' : 'unchecked'}
            onPress={() => setCheckedB('消費税端数処理2')}
          />
          <Text>四捨五入</Text>
        </View>

        <Text style={{ fontSize: 20 }}>源泉徴収</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="源泉徴収0"
            status={checkedC === '源泉徴収0' ? 'checked' : 'unchecked'}
            onPress={() => setCheckedC('源泉徴収0')}
          />
          <Text>なし</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="源泉徴収1"
            status={checkedC === '源泉徴収1' ? 'checked' : 'unchecked'}
            onPress={() => setCheckedC('源泉徴収1')}
          />
          <Text>あり(10.21％復興税)</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton
            value="源泉徴収2"
            status={checkedC === '源泉徴収2' ? 'checked' : 'unchecked'}
            onPress={() => setCheckedC('源泉徴収2')}
          />
          <Text>あり(10％)</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
