/*
 * @Date: 2024-01-15 17:18:56
 * @Description: description
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao {
  private favoriteKey: string;
  constructor(flag: string) {
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
  }
  /* 收藏项目,保存收藏的项目
   * @param key 项目id
   * @param value 收藏的项目
   * @param callback
   */
  saveFavoriteItem(key: string, value: string, callback: any) {
    AsyncStorage.setItem(key, value, (error: any) => {
      if (!error) {
        //更新Favorite的key
        this.updateFavoriteKeys(key, true);
      }
    });
  }
  /**
   * 更新Favorite key集合
   * @param key
   * @param isAdd true 添加,false 删除
   * **/
  updateFavoriteKeys(key: string, isAdd: boolean) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = [];
        if (result) {
          favoriteKeys = JSON.parse(result);
        }
        let index = favoriteKeys.indexOf(key);
        if (isAdd) {
          if (index === -1) favoriteKeys.push(key);
        } else {
          if (index !== -1) favoriteKeys.splice(index, 1);
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
      }
    });
  }
  /**
   * 获取收藏的Repository对应的key
   * @return {Promise}
   */
  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (error, result: any) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(error);
          }
        } else {
          reject(error);
        }
      });
    });
  }
  /*
   * 取消收藏,移除已经收藏的项目
   * @param key 项目 id
   */
  removeFavoriteItem(key: string) {
    AsyncStorage.removeItem(key, error => {
      if (!error) {
        this.updateFavoriteKeys(key, false);
      }
    });
  }
   /**
     * 获取所以收藏的项目
     * @return {Promise}
     */
   getAllItems() {
    return new Promise((resolve, reject) => {
        this.getFavoriteKeys().then((keys: any) => {
            const items: any = [];
            if (keys) {
                AsyncStorage.multiGet(keys, (err, stores: []) => {
                    try {
                        stores.map((result, i, store) => {
                            // get at each store's key/value so you can work with it
                            const key = store[i][0];
                            let value = store[i][1];
                            if (value) items.push(JSON.parse(value));
                        });
                        resolve(items);
                    } catch (e) {
                        reject(e);
                    }
                });
            } else {
                resolve(items);
            }
        }).catch((e) => {
            reject(e);
        })
    })
}
}
