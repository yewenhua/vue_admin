import store from '../store/'
import router from './router.config.js'
import * as types from '../store/types'
import axios from 'axios'

export function checkToken(callback){
    var expire_time = store.state.token ? store.state.token.expire_time : 0;
    var refresh_time = store.state.token ? store.state.token.refresh_time : 0;
    var now = (new Date()).getTime();
    if (now < expire_time) {
        //token有效
        callback();
    }
    else if(now >= expire_time && now < refresh_time){
        //refresh_time有效
        var url = store.state.baseURL + 'auth/refresh?token=' + `Bearer ${store.state.token.value}`;
        axios.get(url, {
            params : {}
        })
        .then(function (response) {
            store.dispatch('refresh', {
                token: response.data.token
            });
            callback();
        })
        .catch(function (error) {
            store.commit(types.LOGOUT);
            router.replace({
                path: 'login',
                query: {redirect: router.currentRoute.fullPath}
            });
        });
    }
    else{
        //都失效
        store.commit(types.LOGOUT);
        router.replace({
            path: 'login',
            query: {redirect: router.currentRoute.fullPath}
        });
    }
}