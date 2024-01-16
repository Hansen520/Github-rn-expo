/*
 * @Date: 2023-11-13 17:41:56
 * @Description: description
 */
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, View, Text, Button } from "react-native";
const Tab = createMaterialTopTabNavigator();

export function tabNav({ Component, keys, theme, extra = {} = {} }: any) {
    /* 首部滑动导航展示 */
    return (<Tab.Navigator
        screenOptions={{
            lazy: true,
            tabBarItemStyle: styles.tabStyle,
            tabBarScrollEnabled: true,//是否支持 选项卡滚动，默认false
            tabBarInactiveTintColor: 'white',
            tabBarActiveTintColor: 'white',
            tabBarStyle: {
                backgroundColor: theme.themeColor,//TabBar的背景色
            },
            tabBarIndicatorStyle: styles.indicatorStyle,//标签指示器样式
            tabBarLabelStyle: styles.labelStyle,//文本的样式
        }}
    >
        {Object.entries(_genTabs({ Component, keys, theme, extra })).map(
            (item: any) => {
                return (
                    <Tab.Screen
                        key={item[0]}
                        name={item[0]} // name
                        component={item[1].Screen} // body
                        options={item[1].navigationOptions}
                    />
                )
            }
        )}
    </Tab.Navigator>)

}

/* 生成tab导航 */
function _genTabs({ Component, keys, theme, extra = {} = {} }: any) {
    const tabs: any = {};
    keys.forEach((item: any, index: number) => {
        if (item.checked) {
            tabs[`tab${index}`] = {
                //初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
                Screen: (props: any) => (<Component {...props} {...extra} tabLabel={item.name} theme={theme} />),
                navigationOptions: {
                    title: item.name,
                }
            };
        }
    });
    return tabs;
}
const styles = StyleSheet.create({
    tabStyle: {
        padding: 0
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        textTransform: 'none',//取消大小写
        fontSize: 13,
        margin: 0
    }
})