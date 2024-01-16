/*
 * @Date: 2023-11-13 17:39:26
 * @Description: description
 */
import React, {Component} from 'react';
import NavigationUtil from '../navigator/NavigationUtil';
import {getBoarding} from '../util/BoardingUtil';
import {StyleSheet, Text, View} from 'react-native';
export default class Index extends Component {
  componentDidMount() {
    this.doLaunch();
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  async doLaunch() {
    const boarding = await getBoarding();
    const {navigation} = this.props;
    this.timer = setTimeout(() => {
      if (boarding) {
        NavigationUtil.resetToHomePage({navigation});
      } else {
        NavigationUtil.login({navigation});
      }
    }, 200);
  } 
  render() {
    return (
      <View style={styles.container}>
        <Text>loading...</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
