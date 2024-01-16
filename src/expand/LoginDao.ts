/*
 * @Date: 2023-11-13 13:27:05
 * @Description: description
 */
import { saveBoarding } from '../util/BoardingUtil';
import Contains from './Constants';
import { post } from './HiNet';

export default class LoginDao {
    private static instance: LoginDao;
    private constructor() {}

    public static getInstance(): LoginDao {
        if (!LoginDao.instance) {
            LoginDao.instance = new LoginDao();
        }
        return LoginDao.instance;
    }

    login(userName: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const {
                login: { api }
            } = Contains;
            const formData = new FormData();
            formData.append('userName', userName);
            formData.append('password', password);
            post(api)(formData)().then((res: any) => {
                const { code, data, msg } = res;
                if (code === 0) {
                    saveBoarding(data);
                    resolve(data || msg);
                } else {
                    reject(res);
                }
            }).catch(e => {
                console.error(e, '~~');
                reject({ code: -1, msg: '出错了出错了' });
            })
        })
    }
     /**
     * 注册
     * @param userName
     * @param password
     * @param imoocId 慕课网ID，从https://www.imooc.com/user/setbindsns 上获取
     * @param orderId 课程订单号
     */
     registration(
        userName: string,
        password: string,
        imoocId: string,
        orderId: string,
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const {
                registration: { api },
            } = Contains;
            const formData = new FormData();
            formData.append('userName', userName);
            formData.append('password', password);
            formData.append('imoocId', imoocId);
            formData.append('orderId', orderId);
            post(api)(formData)().then((res: any) => {
                const { code, data, msg } = res;
                if (code === 0) {
                    saveBoarding(data);
                    resolve(data || msg);
                } else {
                    reject(res);
                }
            })
                .catch((e) => {
                    console.log(e);
                    reject({ code: -1, msg: '哎呀出错了' });
                });
        });
    }
}