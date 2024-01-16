/*
 * @Date: 2023-11-13 17:35:13
 * @Description: description
 */
import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

function Tab1() {
  return <Text>Java</Text>;
}
function Tab2() {
  return <Text>Android</Text>;
}
function Tab3() {
  return <Text>Vue</Text>;
}
//顶部导航器
const TopTab = createMaterialTopTabNavigator();
function PopularScreen() {
  return (<TopTab.Navigator>
    <TopTab.Screen name="index1" component={Tab1}
      options={{
        title: 'RN111'
      }}
    />
    <TopTab.Screen name="index2" component={Tab2}
      options={{
        title: 'Flutter'
      }}
    />
    <TopTab.Screen name="index3" component={Tab3}
      options={{
        title: 'Vue'
      }}
    />
  </TopTab.Navigator>);
}
function TrendingScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>趋势</Text>
    </View>
  );
}
function DetailScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>详情页</Text>
    </View>
  );
}
//底部导航器
const Tab = createBottomTabNavigator();
function MainScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="popular" component={PopularScreen}
        options={{
          tabBarLabel: '最热',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={'whatshot'} size={26} style={{ color: color }} />
          ),
        }}
      />
      <Tab.Screen name="treding" component={TrendingScreen}
        options={{
          tabBarLabel: '趋势',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={'md-trending-up'} size={26} style={{ color: color }} />
          ),
        }}
      />
      <Tab.Screen name="detail" component={DetailScreen}
        options={{
          tabBarLabel: '详情',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={'whatshot'} size={26} style={{ color: color }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


function WelcomePage(props: any) {
  const { navigation } = props;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>欢迎页</Text>
      <Button title={"跳转首页"} onPress={() => {
        navigation.navigate('主页')
      }} />
    </View>
  );
}

// 主导航器/基础导航器
const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="index" component={WelcomePage} />
        <Stack.Screen name="主页" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;