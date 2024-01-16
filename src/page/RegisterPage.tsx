/*
 * @Date: 2023-11-13 10:03:07
 * @Description: description
 */
import React, {useState} from 'react';
import {Linking, SafeAreaView, StyleSheet, View} from 'react-native';
import {ConfirmButton, Input, NavBar, Tips} from '../common/LoginComponent';
import Constants from '../expand/Constants';
import LoginDao from '../expand/LoginDao';

export default () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [imoocId, setIMoocId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [helpUrl, setHelpUrl] = useState(
    'https://doc.devio.org/api-help/docs/rn-api-help.html',
  );
  const [msg, setMsg] = useState('');

  const onRegister = () => {
    if (userName === '' || password === '' || imoocId === '' || orderId === '') {
      setMsg('账号数据信息不能为空');
      return;
    }
    setHelpUrl('');
    setMsg('');
    LoginDao.getInstance()
      .registration(userName, password, imoocId, orderId)
      .then(res => {
        setMsg('注册成功');
      })
      .catch(e => {
        const {code, data: {helpUrl = ''} = {}, msg} = e;
        setMsg(msg);
        setHelpUrl(helpUrl);
      });
  };

  return (
    <SafeAreaView style={styles.root}>
      <NavBar
        title="注册"
        rightTitle="登录"
        onRightClick={() => {
          Linking.openURL(Constants.apiDoc);
        }}
      />
      <View style={styles.line} />
      <View style={styles.content}>
        <Input
          label="用户名"
          placeholder="请输入用户名"
          shortLine={true}
          onChangeText={(text: string) => setUserName(text)}
        />
        <Input
          label="密码"
          placeholder="请输入密码"
          secure={true}
          onChangeText={(text: string) => setPassword(text)}
        />
        <Input
          label="慕ID"
          placeholder="去输入你的慕Id"
          secure={true}
          onChangeText={(text: string) => setIMoocId(text)}
        />
        <Input
          label="课程订单号"
          placeholder="请输入课程订单号"
          secure={true}
          onChangeText={(text: string) => setOrderId(text)}
        />
        <ConfirmButton title="注册" onClick={onRegister} />
        <Tips msg={msg} helpUrl={helpUrl} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
    backgroundColor: '#F1F5F6',
    flexGrow: 1,
  },
  line: {
    height: 0.5,
    backgroundColor: '#D0D4D4',
  },
});
