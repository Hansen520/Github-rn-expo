/*
 * @Date: 2023-11-13 17:42:03
 * @Description: description
 */
import { StackActions } from '@react-navigation/native';
/**
 * 全局导航跳转工具类 by CrazyCodeBoy
 */
export default class NavigationUtil {
    static navigation: any
    /**
     * 跳转到指定页面
     * @param {*} parmas 要传递的参数
     * @param {*} page 要跳转的页面名
     */
    static goPage(params: any, page: any) {
        const navigation = NavigationUtil.navigation || (params || {}).navigation;
        if (!navigation) {
            console.log('NavigationUtil.navigation can not be null');
            return;
        }
        navigation.navigate(page, {
            ...params,
            navigation: undefined //fix Non-serializable values were found in the navigation state. Check:
        })

    }
    /**
     * 返回上一页
     * @param {*} navigation 
     */
    static goBack(navigation: any) {
        navigation.goBack();
    }
    /**
     * 重置到首页
     */
    static resetToHomePage(params: any) {
        const { navigation } = params;
        navigation.dispatch(StackActions.replace('HomePage', {}));
    }
    /**
     * 重置到登录
     */
    static login(params : any) {
        const { navigation } = params;
        if (!navigation) {
            navigation = NavigationUtil.navigation;
        }
        navigation.dispatch(StackActions.replace('LoginPage', {}));
    }
    /**
     * 重置到注册
     */
    static registration(params = {}) {
        const { navigation } = params;
        if (!navigation) {
            navigation = NavigationUtil.navigation;
        }
        navigation.dispatch(StackActions.replace('RegistrationPage', {}));
    }
}