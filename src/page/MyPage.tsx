/*
 * @Date: 2023-11-13 17:37:48
 * @Description: description
 */
import React, { Component } from 'react';
import {
    Button,
    StyleSheet, Text, View
} from 'react-native';
import actions from '../store/action';
import { connect } from "react-redux";

class MyPage extends Component<any> {
    render() {
        return (
            <View style={styles.container}>
                <Text>MyPage</Text>
                <Button title='改变主题' onPress={() => {
                    this.props.onThemeChange('#f' + `${Math.ceil(Math.random() * 100000)}`.padStart(5, '0') );
                }} />
            </View>
        );
    }
}
//将dispatch映射给onThemeChange，然后注入到组件的props中
const mapDispatchToProps = (dispatch: any) => ({
    onThemeChange: (theme: any) => dispatch(actions.onThemeChange(theme))
})
//包装 component，注入 dispatch到MyPage
export default connect(null, mapDispatchToProps)(MyPage);
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})