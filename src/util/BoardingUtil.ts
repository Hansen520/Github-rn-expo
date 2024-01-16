/*
 * @Date: 2023-11-13 13:27:48
 * @Description: description
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY_BOARDING_PASS = "boarding-pass"

/**
 * 保存登录态
 * @param data 
 */
export function saveBoarding(data: string) {
    AsyncStorage.setItem(KEY_BOARDING_PASS, data);
}

/**
 * 获取登录态
 * @returns 
 */
export async function getBoarding() {
    return await AsyncStorage.getItem(KEY_BOARDING_PASS);
}