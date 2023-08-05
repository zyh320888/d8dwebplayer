import { Component, StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { getPathAppId as getPlayAppId } from "./../src/player/player_utils";
import Api from "./../src/player/player_api";
import Store, { getStore, setStore } from "./../src/player/redux_store";

function LoadPlayer() {
    const [PlayerNode, setPlayerNode] = useState(null);

    function getPath() {
        return window.location.pathname;
    }

    function getHost() {
        return window.location.hostname;
    }
    
    const APP_ID = getPlayAppId();

    let loaded = false;

    const load = () => {
        const appCode = getStore('APP_CODE');
        const appPlat = getStore('APP_PLAT_DATA');

        if (appPlat == 'mobile') {
            import('./../src/player/MobilePlayer').then((module) => {
                const MobilePlayer = module.default;
                setPlayerNode(<MobilePlayer appCode={appCode} />);
            });
        } else if (appPlat == 'pc') {
            import('./../src/player/PCPlayer').then((module) => {
                const PCPlayer = module.default;
                setPlayerNode(<PCPlayer appCode={appCode} />);
            });
        }
    }

    const setTitle = (title) => {
        document.title = title;
    };

    const setApp = ({ _id, 名称, 平台, 类型, 应用模块ID, 版本号, 代码对象数组 }) => {
        try {
             setStore('APP_ID', APP_ID);

            if (名称) {
                setTitle(名称);
            }

            if (代码对象数组) {
                代码对象数组 = JSON.parse(代码对象数组);
                setStore('APP_CODE', 代码对象数组);
            }

            setStore('APP_PLAT_DATA', 平台 ? 平台 : 'pc');

            load();
        } catch (error) {
            console.log('setApp.error',error)
        }
       
    } 

    const loadApp = () => {

        Api.loadApp({
            appId: APP_ID,
            prdHost: getHost(),
            prdPath: getPath(),
            success: (appInfo) => {
                setApp(appInfo);
            },
            fail: ({ code, errMsg, result }) => {
                document.write(errMsg)
            }
        })

    }

    const loadLocalApp = () => {
        
        setApp(CONFIG.APP_CODE);
    }

    //初始化时执行
    useEffect(() => {

        if (!loaded) {
            if(!CONFIG.APP_CODE){
                loadApp();
            }else{
                loadLocalApp()
            }
        }
        return () => {
            loaded = true;
        }
    }, []);

    return PlayerNode;
}


class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        console.error(error);
        // 更新 state 以指示发生错误
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // 在这里记录错误信息
        //console.error(error, errorInfo);
        //this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // 显示备用 UI 和错误信息
            return (
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f2f2f2' }}>
                    <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>预览页面出错了</h1>
                    <h2 style={{ fontSize: '24px', color: '#666', marginBottom: '20px' }}>别怕，可以继续在多八多AiIDE修改代码，修改保存后刷新页面即可</h2>
                    <p style={{ color: 'red', fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{this.state.error.toString()}</p>
                    <p style={{ fontSize: '16px', marginBottom: '20px' }}>请检查代码并确保没有语法错误或其他问题。</p>
                    <p style={{ fontSize: '16px', marginBottom: '20px' }}>如果问题仍然存在，请尝试搜索相关文档或向社区求帮助。</p>
                    <p style={{ fontSize: '16px', marginBottom: '20px' }}>我们非常重视您的反馈，如果您发现了任何问题，请随时联系我们。</p>
                </div>

            );
        }

        return this.props.children;
    }
}


const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <ErrorBoundary>
            <LoadPlayer />
        </ErrorBoundary>
    </StrictMode>
);
