import axios from 'axios';
//import CONFIG from './config';

const apiConfig = {
    apiHost: CONFIG.PRE_API_HOST
}

class AppApi {
    constructor(config){
        this.apiHost = config.apiHost;
    }

    loadApp({appId,prdHost,prdPath,success,fail}){
        this.post({
            path: '/v1/app/load',
            param:{
                appId,
                prdHost,
                prdPath
            },
            success,
            fail
        });
    }

    getOssPolicy({success,fail}){
        this.post({
            path: '/v1/app/oss/getPolicy',
            param:{
            },
            success,
            fail
        });
        
    }

    post({url,path,param,success,fail}){
        if(!url)url = this.apiHost + path;
        axios.post(url,param)
        .then(res => {    
            console.log('post',res.data);
            if(res.data.code === 200){
                if(typeof success === 'function')success(res.data.result);
            } else {
                if(typeof fail === 'function')fail(res.data);
            }
                
        })
        .catch(error => {        
            if(typeof fail == 'function')fail(error.toString());
        });
    }

    apiPost({url,param,success,fail}){
        if(!url){
            fail('请传入url');
            return;
        }
        axios.post(url,param,{
            //withCredentials: true
        })
        .then(res => {    
            console.log('Api.apiPost',res.data);
            // if(res.data.code === 200){
            //     if(typeof success === 'function')success(res.data);
            // } else {
            //     if(typeof fail === 'function')fail(res.data);
            // }
            if(typeof success === 'function')success(res.data);
                
        })
        .catch(error => {        
            if(typeof fail == 'function')fail(error.toString());
        });
    }
}

export default new AppApi(apiConfig);