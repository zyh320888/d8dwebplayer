import Events from 'events';
import Store, { getStore, setStore } from "./redux_store";
import dayjs from 'dayjs';
import CircularJSON from 'circular-json-es6';
//const events = Events;

export default function (_JS_CODE, _F, jsFunInfo = {}) {

    //console.log('runJs.jsCode',_JS_CODE);
    //console.log('runJs._F',_F);

    //_F(''); new events.EventEmitter();

    const setLog = function (message) {
        let logObj = getStore('DEBUG_LOG_LIST') || {};
        let logList = logObj[jsFunInfo.devId] || [];
        logList.unshift({
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            log: message
        });
        logObj[jsFunInfo.devId] = logList;
        setStore('DEBUG_LOG_LIST', logObj);
    }

    const log = function () {
        let logMsg = `${jsFunInfo.devId}_日志:`; //+ message;
        let args = Array.from(arguments);
        const message = args.map(arg => {
            try {
              return JSON.stringify(arg);
            } catch (err) {
              return '';
            }
          }).join(' ');

        setLog(logMsg + message);

        return console.log.apply(console, [
            logMsg,
            ...args
        ]);
    };
    const error = function (message) {
        // 自定义的错误处理逻辑
        // ...
        // 调用原生的 console.error 方法
        return console.error.apply(console, arguments);
    };
    const newConsole = {
        log: log,
        error: log,
    }
    const newImport = (moduleName) => {
        return _F('module_func').callMethod('import', moduleName);
    }

    return (param, _funcCb) => {
        try {
            //return eval('(function() {' + _JS_CODE + '\n}())');
            //_JS_CODE = '(function() {' + _JS_CODE + '\n}())';

            let jsCode = '';
            if (jsFunInfo.isSync) {
                jsCode = `
                    async function run() {
                        try {
                            ${_JS_CODE}
                        } catch (error) {
                            console.error(error.toString());
                        }
                    }
                    
                    return run().then((res)=>res);
                `

            } else {
                jsCode = _JS_CODE;
            }

            const fun = new Function('_F', '_funcCb', 'param', 'events', 'console', 'Import', jsCode);
            return fun(_F, _funcCb, param, Events, newConsole, newImport);



        } catch (error) {
            /* console.log('runJs.error.toString',error.toString());
            console.log('runJs.error',error); */
            newConsole.log('runJs.error.toString', error.toString());
            newConsole.log('runJs.error', error);
        }
    }
}