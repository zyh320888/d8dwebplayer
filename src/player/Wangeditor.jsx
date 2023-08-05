//import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Row, Col } from 'antd';
import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { Boot } from '@wangeditor/editor'
import markdownModule from '@wangeditor/plugin-md'


//import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import UploadOss from './player_upload_oss';
import WangeditorCss from './../cssJs/wangeditor.css';
import WangeditorGlobalCss from './../cssJs/wangeditor.global.css';

import Store, { getStore, setStore } from "./redux_store";
//import GlobalContext from './globalContext';

//import CONFIG from './config';
const OSS_HOST = CONFIG.OSS_HOST;

Boot.registerModule(markdownModule)

class WangEditor extends React.Component {
    //static contextType = GlobalContext;

    constructor(props) {
        super(props);
        
        this.state = {
            html: props.html ? props.html: '',
            editor: null,
            height: props.height ? props.height : '500px',
            width: props.width ? props.width : '100%'
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        if (this.state.editor == null) return
        this.state.editor.destroy()
        this.setEditor(null)
    }

    componentDidUpdate(prevProps) {

        if (prevProps.html !== this.props.html) this.setHtml(this.props.html);
        if (prevProps.height !== this.props.height) this.setHeight(this.props.height);
        if (prevProps.width !== this.props.width) this.setWidth(this.props.width);
        // if(prevProps.readOnly != this.props.readOnly)this.props.readOnly?this.setDisabled():this.setEnabled();
    }
    setEditor(editor) {
        this.setState({ editor });
    }
    getHtml() {
        return this.state.editor.getHtml();
    }
    setHtml(html) {
        this.setState({ html })
    }
    setHeight(height) {
        this.setState({ height })
    }
    setWidth(width) {
        this.setState({ width })
    }
    onChange(html) {
        // if (this.props.hasOwnProperty('onChange')) this.props.onChange(html);
        this.props?.onChange(html);
    }

    onMessage(paramObj) {
        this.context.MAIN_LAYOUT.onMessage(paramObj);
    }

    customUpload() {
        const APP_ID = getStore('APP_ID');
        return {
            // 自定义上传
            customUpload: async (file, insertFn) => {                   // JS 语法
                // file 即选中的文件
                // 自己实现上传，并得到图片 url alt href
                // 最后插入图片
                //insertFn(url, alt, href)
                let uploadUrl = `/files/${APP_ID}/richtext/`;
                console.log('customUpload.file', file, uploadUrl);
                //return;

                UploadOss.fileInit(file, uploadUrl, 1, {
                    success: (fileUrl) => {
                        // let treeCode = data['代码对象数组'];
                        // let version = data['版本号'];
                        console.log("UploadOss", fileUrl);

                        insertFn(OSS_HOST + fileUrl);
                        this.onMessage({ content: '上传成功', type: 'success' })
                    },
                    fail: (err) => {
                        this.onMessage({ content: err || '上传失败', type: 'error' })
                    },
                    progress: (complete) => {
                        this.onMessage({ content: '上传进度' + complete, type: 'info' })
                    }
                })
            }
        };
    }

    render() {
        //console.log('WangEditor.render');

        // 工具栏配置
        const toolbarConfig = {}                        // JS 语法

        // 编辑器配置
        const editorConfig = {                         // JS 语法
            placeholder: '请输入内容...',
            MENU_CONF: {
                uploadImage: this.customUpload(),
                uploadVideo: this.customUpload(),
            }
        }

        return (
            <React.Fragment>
                {/*  */}
                {/* <div style={{ marginTop: '15px' }}>
                    {this.state.html}
                </div> */}
                <Row style={{ width: this.state.width, border: '1px solid #ccc'/* , zIndex: 100 */ }}>
                    <Col>
                        <WangeditorGlobalCss />
                        <WangeditorCss>
                            <Toolbar
                                editor={this.state.editor}
                                defaultConfig={toolbarConfig}
                                mode="default"
                                style={{ borderBottom: '1px solid #ccc' }}
                            />
                            <Editor
                                defaultConfig={editorConfig}
                                value={this.props?.id ? this.props?.value : this.state.html}
                                onCreated={this.setEditor.bind(this)}
                                onChange={editor => this.onChange(editor.getHtml())}
                                mode="default"
                                style={{
                                    //width:this.state.width,
                                    height: this.state.height, overflowY: 'hidden'
                                }}
                            />
                        </WangeditorCss>
                    </Col>
                </Row>

            </React.Fragment>
        )
    }
}

export default WangEditor