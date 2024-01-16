/*
 * @Date: 2023-11-09 16:23:11
 * @Description: description
 */
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {get, post} from './expand/HiNet';
import Constants from './expand/Constants';

export default (props: any) => {
  const [msg, setMsg] = useState('');
  // const doFetch = () => {
  //   fetch('https://mock.mengxuegu.com/mock/6333f762fc3600383bca1eff/shme/muck/allAlarm?day=30')
  //     .then(res => res.json())
  //     .then(result => {
  //       setMsg(JSON.stringify(result));
  //     })
  //     .catch(e => {
  //       console.log(e, 17);
  //       setMsg(JSON.stringify(e));
  //     });
  // };

  const doFetch = () => {
    const formData = new FormData();
    formData.append('requestPrams', 'RN');
    post(Constants.test.api)(formData)()
      .then(result => {
        setMsg(JSON.stringify(result));
      })
      .catch(e => {
        console.log(e);
        setMsg(JSON.stringify(e));
      });
  };
  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity onPress={doFetch}>
        <Text>加载网络987</Text>
      </TouchableOpacity>
      <Text>{msg}1</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
