/*
 * @Date: 2023-12-19 16:25:40
 * @Description: description
 */
import { get } from './HiNet';
import Constants from './Constants';
import { URL } from 'react-native-url-polyfill';//use URLSearchParams in RN

export const FLAG_STORAGE = {
  flag_popular: 'popular',
  flag_trending: 'trending',
};
export default class DataStore {
  /**
   * 获取数据
   * @param url
   * @param flag
   * @param pageIndex
   * @param pageSize
   * @returns {Promise<unknown>}
   */
  fetchData(url: string, flag?: string, pageIndex = 1, pageSize = 25) {
    const isTrending = flag === FLAG_STORAGE.flag_trending;
    let api, params: any = { pageIndex, pageSize };
    if (isTrending) {
      api = Constants.trending.api;
      params.sourceUrl = url;
    } else {
      api = Constants.popular.api;
      //从url中取出q参数：eg:url https://api.devio.org/uapi/popular?q=java&pageIndex=1&pageSize=25 
      const q = new URL(url).searchParams.get('q');
      params.q = q;
    };
    // get(api)(params).then(res => {
    //   console.log(res, 35);
    // })
    return get(api)(params);
  }
}