/*
 * @Date: 2024-01-15 17:54:41
 * @Description: description
 */
import FavoriteDao from "../../../expand/FavoriteDao";
import ProjectModel from "../../../model/ProjectModel";
import Types from '../types';


/**
 * 加载收藏的项目
 * @param flag 标识
 * @param isShowLoading 是否显示loading
 * @returns {function(*)}
 */
export function onLoadFavoriteData(flag, isShowLoading) {
    return dispatch => {
        if (isShowLoading) {
            dispatch({ type: Types.FAVORITE_LOAD_DATA, storeName: flag });
        }
        new FavoriteDao(flag).getAllItems()
            .then(items => {
                let resultData = [];
                for (let i = 0, len = items.length; i < len; i++) {
                    resultData.push(new ProjectModel(items[i], true));
                }
                dispatch({ type: Types.FAVORITE_LOAD_SUCCESS, projectModels: resultData, storeName: flag });
            })
            .catch(e => {
                console.log(e);
                dispatch({ type: Types.FAVORITE_LOAD_FAIL, error: e, storeName: flag });
            })

    }
}
