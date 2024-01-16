/*
 * @Date: 2023-12-08 10:49:37
 * @Description: description
 */
import { applyMiddleware, legacy_createStore as createStore, compose } from 'redux';
import {thunk} from 'redux-thunk';
import reducers from './reducer';

// 这里用到了JS的函数柯里化，logger = store => next => action => 是函数柯里化的ES6写法
const logger = (store: any) => (next: any) => (action: any) => {
    if (typeof action === 'function') {
        console.log('dispatching a function');
    } else {
        // console.log('dispatching ', action);
    }
    const result = next(action);
    return result;
};
// 设置中间件
const middlewares = [logger, thunk];

// 创建store
export default createStore(reducers, applyMiddleware(...middlewares as any));