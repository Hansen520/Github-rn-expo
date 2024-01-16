/*
 * @Date: 2023-11-13 17:34:35
 * @Description: description
 */
import React, { Component } from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';
export default class Index extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>最热3</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})