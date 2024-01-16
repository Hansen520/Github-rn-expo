/*
 * @Date: 2023-12-19 16:20:13
 * @Description: description
 */
import Types from '../types'
import DataStore, {FLAG_STORAGE } from '../../../expand/DataStore'
import { handleData, _projectModels } from '../actionUtil'

/**
 * 获取最热数据的异步action
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {function(*=)}
 */
export function onRefreshPopular(storeName: string, url: string, pageSize: number) {
    return (dispatch: any) => {
        dispatch({ type: Types.POPULAR_REFRESH, storeName: storeName });
        let dataStore = new DataStore();
        dataStore.fetchData(url, FLAG_STORAGE.flag_popular) // 异步action与数据流
            .then(data => {
                handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize)
            })
            .catch(error => {
                dispatch({
                    type: Types.POPULAR_REFRESH_FAIL,
                    storeName,
                    error
                });
            })
    }
}

/**
 * 加载更多
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callBack 回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 * @returns {function(*)}
 */
export function onLoadMorePopular(storeName: string, pageIndex: number, pageSize: number, dataArray = [], callBack: any) {
    return (dispatch: any) => {
        setTimeout(() => {//模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) {//已加载完全部数据
                if (typeof callBack === 'function') {
                    callBack('no more')
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModes: dataArray
                })
            } else {
                //本次和载入的最大数量
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModes: dataArray.slice(0, max),
                })
            }
        }, 500);
    }
}

/**
 * 处理下拉刷新的数据
 * @param dispatch
 * @param storeName
 * @param data
 * @param pageSize
 */
// function handleData(dispatch: any, storeName: string, data: any, pageSize: number) {
//     let fixItems = [];
//     if (data && data.data && data.data.items) {
//         fixItems = data.data.items;
//     } else {
//         fixItems = data;
//     }
//     dispatch({
//         type: Types.POPULAR_REFRESH_SUCCESS,
//         items: fixItems,
//         projectModes: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),//第一次要加载的数据
//         storeName,
//         pageIndex: 1
//     })
// }

/**
 * 刷新收藏状态
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param favoriteDao
 * @returns {function(*)}
 */
export function onFlushPopularFavorite(storeName: string, pageIndex: number, pageSize: number, dataArray = [], favoriteDao: any) {
    return (dispatch: any) => {
        //本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, (data: any) => {
            dispatch({
                type: Types.FLUSH_POPULAR_FAVORITE,
                storeName,
                pageIndex,
                projectModels: data,
            })
        })
    }
}