/*
 * @Date: 2024-01-15 17:12:02
 * @Description: description
 */
export default class FavoriteUtil {
    /**
     * favoriteIcon单击回调函数
     * @param favoriteDao
     * @param item
     * @param isFavorite
     * @param flag
     */
    static onFavorite(favoriteDao: any, item: any, isFavorite: boolean, flag: string) {
        const key = (item.id ? item.id : item.fullName) + "";
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(key);
        }
    }
}