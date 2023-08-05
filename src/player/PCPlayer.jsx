import React, { Component, useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, useNavigate, HashRouter } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames/dedupe';
import styled from "styled-components";
import Store, { getStore, setStore } from "./redux_store";
import { App, Button, Col, Row, Space, Input, ConfigProvider, theme, Layout, Menu, Card, List, Table, Dropdown, Divider, Modal, Drawer, TreeSelect, Tree, Breadcrumb, Switch, Avatar, Tabs, Select, Radio, InputNumber, Image, Checkbox, Popover, Cascader, Slider, Spin, Progress, Badge, Calendar, DatePicker, TimePicker, Upload, Timeline, Form, Statistic, QRCode, Carousel, Descriptions } from 'antd';
const { Header, Footer, Content, Sider } = Layout;
import UserStore, { getStore as userGetStore, setStore as userSetStore } from "./user_store";
//import { Provider,useSelector, useDispatch, shallowEqual } from 'react-redux';
import { flattenTree, findNodeById, filterObjectByProperty, getFrontCode } from './player_utils';
import playerEventEmitter from './player_global_events';
import runJs from "./runJs"
import Api from './player_api';
import HtmlParse from "./../common/htmlParse"
import WangEditor from "./Wangeditor"

//import eventEmitter from './../editor/editor_global_events';
//import editorStore, { getStore as editorGetStore, setStore as editorSetStore } from "./../editor/editor_redux_store";


import "./styles.css"

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
dayjs.locale('zh-cn');

const { defaultAlgorithm, darkAlgorithm, compactAlgorithm } = theme;

const GlobalContext = React.createContext({});

const OSS_HOST = CONFIG.OSS_HOST;

function getEleNode({ _this, $refs, treeId, style, props, child, findChild, output, type }) {


    // if (type == 'front') output.push(<ChildComponent key={treeId} treeId={treeId} child={child} />);
    if (type == 'front') output.push(<FrontComponent key={treeId} d8dprops={{ _this: _this, $refs, treeId, props, child }} />);
    else if (type == 'dom') output.push(<ChildComponent key={treeId} treeId={treeId} child={child} />);
    else if (type == 'group') output.push(<ChildComponent key={treeId} treeId={treeId} child={child} />);
    else if (type === "stylecss") output.push(_this.getStyleCssNode({ $refs, treeId, style, props, child }));
    else if (type == 'fchild') output.push(<FChildNode key={treeId} {...{ _this: _this, $refs, treeId, props }} />);
    else if (type == 'routes' || type == 'pageContainer') output.push(_this.getRoutesNode({ $refs, treeId, props, child }));
    else if (type == 'route' || type == 'page') output.push(_this.getRouteNode({ $refs, treeId, props, child: () => { return findChild(props.element) } }));
    else if (type.indexOf("component") > -1) output.push(<FComponentNode key={treeId} {...{ _this: _this, $refs, treeId, props, child }} />);
    // else if (type === "if") output.push(<IfNode key={treeId} {...{ _this: _this, $refs, treeId, props, child }} />);
    // else if (type === "for") output.push(<ForNode key={treeId} d8dprops={{ _this: _this, $refs, treeId, props, child }} />);
    else if (type === "if") output.push(IfNode({ d8dprops: { _this: _this, $refs: null, treeId, style, props, child } }));
    else if (type === "for") output.push(ForNode({ d8dprops: { _this: _this, $refs: null, treeId, style, props, child } }));
    else if (type === "foutnode") output.push(FOutNode({ d8dprops: { _this: _this, $refs: null, treeId, style, props, child } }));


    else if (type === "form") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Form, isSingle: true }));
    else if (type === "form.item") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Form.Item, isSingle: true }));
    else if (type === "inputnumber") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: InputNumber, isSingle: true }));
    //else if (type === "input") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Input, isSingle: true }));
    else if (type === "input") output.push(<AInputNode key={treeId} ref={(ref) => _this.$refs[treeId] = ref} d8dprops={{ _this: _this, $refs: null, treeId, style, props, Element: Input }} />);
    //else if (type === "input.password") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Input.Password, isSingle: true }));
    else if (type === "input.password") output.push(<AInputNode key={treeId} d8dprops={{ _this: _this, $refs, treeId, style, props, Element: Input.Password }} />);
    //else if (type === "input.textarea") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Input.TextArea, isSingle: true }));
    else if (type === "input.textarea") output.push(<AInputNode key={treeId} d8dprops={{ _this: _this, $refs, treeId, style, props, Element: Input.TextArea }} />);
    else if (type === "select") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Select, isSingle: true }));
    else if (type === "switch") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Switch, isSingle: true }));
    else if (type === "button") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Button, elePropsCallback: _this.getAButtonProps.bind(_this) }));
    else if (type === "row") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Row, elePropsCallback: _this.getARowProps.bind(_this) }));
    else if (type === "col") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Col, isSingle: true }));
    else if (type === "img") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: 'img', elePropsCallback: _this.getImgProps.bind(_this) }));
    else if (type === "video") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: 'video', elePropsCallback: _this.getVideoProps.bind(_this) }));
    else if (type === "image") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: Image, elePropsCallback: _this.getAImageProps.bind(_this) }));
    else if (type === "div") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'div' }));
    else if (type === "span") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'span' }));
    else if (type === "h1") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h1' }));
    else if (type === "h2") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h2' }));
    else if (type === "h3") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h3' }));
    else if (type === "h4") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h4' }));
    else if (type === "h5") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h5' }));
    else if (type === "iframe") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'iframe' }));
    else if (type === "space") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Space }));
    else if (type === "layout") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Layout }));
    else if (type === "header") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Header }));
    else if (type === "sider") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Sider }));
    else if (type === "content") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Content }));
    else if (type === "footer") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Footer }));
    else if (type === "menu") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: AMenu }));
    else if (type === "card") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Card }));
    else if (type === "dropdown") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Dropdown }));
    else if (type === "dropdown.button") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Dropdown.Button }));
    else if (type === "table") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: Table }));
    else if (type === "list") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: List }));
    else if (type === "list.item") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: List.Item }));
    else if (type === "list.item.meta") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: List.Item.Meta }));
    else if (type === "descriptions") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Descriptions }));
    // else if (type === "descriptions.item") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Descriptions.Item }));
    else if (type === "descriptions.item") output.push(AChildItemNode({ d8dprops: { _this: _this, $refs: null, treeId, style, props, child, Element: Descriptions.Item } }));

    else if (type === "radio") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Radio }));
    else if (type === "radio.group" || type === "radiogroup") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Radio.Group }));
    else if (type === "checkbox") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Checkbox }));
    else if (type === "checkbox.group" || type === "checkbox.group") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Checkbox.Group }));
    else if (type === "datepicker") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Datepicker }));
    else if (type === "timepicker") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Timepicker }));
    else if (type === "upload") output.push(_this.getAUploadNode({ $refs, treeId, style, props, child }));
    else if (type === "tree") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Tree }));
    else if (type === "statistic") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Statistic }));
    else if (type === "calendar") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Calendar }));
    else if (type === "configprovider") output.push(_this.getAConfigNode({ $refs, treeId, style, props, child }));
    else if (type === "tabs") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: Tabs }));
    else if (type === "slider") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Slider }));
    else if (type === "spin") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Spin }));
    else if (type === "badge") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Badge }));
    else if (type === "progress") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Progress }));
    else if (type === "divider") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Divider }));
    else if (type === "modal") output.push(<AModalNode key={treeId} {...{ _this: _this, $refs, treeId, style, props, child }} />);
    else if (type === "drawer") output.push(<ADrawerNode key={treeId} {...{ _this: _this, $refs, treeId, style, props, child }} />);
    else if (type === "qrcode") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: QRCode }));
    else if (type === "richtext") output.push(_this.getARichtextNode({ $refs, treeId, style, props }));
    // else if (type === "richtexteditor") output.push(<ARichtextEditorNode key={treeId} d8dprops={{ _this: _this, $refs, treeId, style, props }} />);
    else if (type === "richtexteditor") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: WangEditor }));
    else if (type === "breadcrumb") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: Breadcrumb }));
    else if (type === "treeselect") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: TreeSelect }));
    else if (type === "carousel") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Carousel }));

    return output;
}

function FrontComponent(superProps) {
    const { d8dprops, ...rest } = superProps;
    const { _this, $refs, treeId, props, child } = d8dprops;
    //console.log('ChildComponent', treeId);

    let eleProps = _this.propsAttrJsHandler(props);

    // console.log('FrontComponent', eleProps);

    let loaded = false;
    useEffect(() => {
        if (!loaded) {
            if (eleProps.onLoad && typeof eleProps.onLoad === 'function') eleProps.onLoad();
            loaded = true;
        }
    }, [])

    return child();
}

function ChildComponent({ child, treeId }) {
    //console.log('ChildComponent', treeId);
    return child();
}

function FNodeItemNode(superProps) {
    const { d8dprops, ...rest } = superProps;
    const { _this, treeId, item } = d8dprops;

    const [FNodeCode, setFNodeCode] = useState({ children: [] });
    const gContext = useContext(GlobalContext);

    let output = [];

    //console.log('FNodeItemNode', treeId, gContext,{...gContext})

    let fNodeItem = {
        ...gContext,
    };

    fNodeItem[treeId] = item;

    //console.log('UICommon.getFNodeItemNode', treeId, item, fNodeItem,_this)

    useEffect(() => {
        const tmpFNodeCode = _this.findNodeById(treeId);
        //console.log('FNodeItemNode', treeId, tmpFNodeCode)
        setFNodeCode(tmpFNodeCode || { children: [] });
    }, [_this.getState().rnd]);

    output = (
        <GlobalContext.Provider value={fNodeItem}>
            <FNodeComponent
                //key={treeId}
                //ref={ref => this.$refs[treeId] = ref}
                _this={_this}
                treeCode={FNodeCode.children}
                rnd={_this.getState().rnd}
            />
        </GlobalContext.Provider>
    );



    return output;
}

// function ForNode_bak(superProps) {
//     const { d8dprops, ...rest } = superProps;
//     const { _this, $refs, treeId, props, child } = d8dprops;
//     let output = [];

//     // console.log('UICommon.getForNode',treeId,props,child)

//     let eleProps = {};

//     const [dataSource, setDataSource] = useState([]);
//     const [FNodeCode, setFNodeCode] = useState({ children: [] });
//     const gContext = useContext(GlobalContext);



//     useEffect(() => {
//         if (props.hasOwnProperty('dataSourceJs')) {
//             const tmpDataSource = _this.returnEvalJsCode(props.dataSourceJs);
//             setDataSource(tmpDataSource);
//         }
//     }, [_this.state]);

//     useEffect(() => {
//         const tmpFNodeCode = _this.findNodeById(treeId);
//         // console.log('FNodeItemNode', treeId, tmpFNodeCode)
//         setFNodeCode(tmpFNodeCode);
//     }, [_this.getState().rnd]);

//     // console.log('UICommon.dataSource',dataSource,FNodeCode)

//     if (Array.isArray(dataSource)
//         && FNodeCode
//     ) {

//         //let FNodeCode = _this.findNodeById(treeId);

//         dataSource.map((item, index) => {

//             let fNodeItem = {
//                 ...gContext,
//             };

//             fNodeItem[treeId] = { item, index };


//             // console.log('ForNode', treeId, item,fNodeItem, child )

//             output.push(
//                 <GlobalContext.Provider value={fNodeItem} key={treeId + 'for' + index}>
//                     <FNodeComponent
//                         //key={treeId}
//                         //ref={ref => this.$refs[treeId] = ref}
//                         _this={_this}
//                         treeCode={FNodeCode.children}
//                         rnd={_this.getState().rnd}
//                     />
//                 </GlobalContext.Provider>
//             );
//         });
//     }

//     return output;
// }


function TmpForNode(tmpProps) {
    // console.log('tmpProps', tmpProps)
    return tmpProps.children;
}

function ForNode(superProps) {
    const { d8dprops, ...rest } = superProps;
    const { _this, $refs, treeId, props, child } = d8dprops;


    // console.log('ForNode',superProps.children)
    // console.log('ForNode', child())

    let eleProps = {};

    const [outputNode, setOutputNode] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [FNodeCode, setFNodeCode] = useState({ children: [] });
    const gContext = useContext(GlobalContext);


    const onOutputNodes = (forItemNode, index) => {

        // console.log('onOutputNodes', forItemNode, index)

        setOutputNode(prevState => {

            if (prevState[index] !== forItemNode) {
                prevState.splice(index, 1, forItemNode);
                return [...prevState];
            }
            else
                return prevState;
        });
    }

    const renderList = () => {
        if (Array.isArray(dataSource)
            && FNodeCode
        ) {

            //let FNodeCode = _this.findNodeById(treeId);

            dataSource.map((item, index) => {
                let fNodeItem = {
                    ...gContext,
                };

                fNodeItem[treeId] = { item, index };

                const treeCode = FNodeCode.children;


                // console.log('onOutputTmpNode', outputNode[index], index)



                output.push((
                    <TmpForNode
                        key={treeId + 'for' + index}
                        {...outputNode[index]?.props}
                    >
                        <GlobalContext.Provider value={fNodeItem} key={treeId + 'Context' + index}>
                            <FNodeComponent
                                key={treeId + 'FNode' + index}
                                // ref={ref => console.log('ref', ref)}
                                _this={_this}
                                treeCode={treeCode}
                                rnd={_this.getState().rnd}
                                onOutputNodes={(forItemNode) => {
                                    if (!outputNode[index])
                                        onOutputNodes(forItemNode, index)
                                }}
                            />
                        </GlobalContext.Provider>
                    </TmpForNode>
                )
                );

            });

        }
    }

    useEffect(() => {
        if (props.hasOwnProperty('dataSourceJs')) {
            const tmpDataSource = _this.returnEvalJsCode(props.dataSourceJs);
            setDataSource(tmpDataSource);
        }
    }, [_this.state]);

    useEffect(() => {
        const tmpFNodeCode = _this.findNodeById(treeId);
        //console.log('FNodeItemNode', treeId, tmpFNodeCode)
        setFNodeCode(tmpFNodeCode);
    }, [_this.getState().rnd]);

    let output = [];

    renderList();


    return output;
}

function FComponentNode({ _this, $refs, treeId, props, child }) {
    let output = '';

    if (props.hasOwnProperty('visible') && !props.visible) return output;

    let treeCode = [];

    if (!_this.modules[props.moduleId]) {
        treeCode = _this.moduleCodeHandler(props.moduleId);
        _this.modules[props.moduleId] = treeCode;
    } else
        treeCode = _this.modules[props.moduleId];

    let eleProps = {};
    if (props.hasOwnProperty('attr') && Array.isArray(props.attr)) {

        let attr = [];
        props.attr.map(item => {
            if (item.attrType == 'js') {
                var jsCode = `
                    return ${item.attrJsCode}
                `;
                attr.push({
                    attrId: item.attrId,
                    attrValue: _this.jsFuncHandler($refs, { jsCode })({})
                });
            }
            else
                attr.push({
                    attrId: item.attrId,
                    attrValue: item.attrValue
                });

        });
        //console.log('getFComponentNode.props.attr', props.attr,attr)
        eleProps.attr = attr;
    }

    var events = props.hasOwnProperty("events") ? props.events : [];

    //console.log('getFComponentNode',props.moduleId,this.getState().rnd,this)

    output = (
        <DComponent
            key={treeId}
            ref={ref => _this.$refs[treeId] = ref}
            _this={_this}
            treeCode={treeCode}
            rnd={_this.getState().rnd}
            {...eleProps}
            {..._this.eventsHandler($refs, events)}
        >
            {/* {child && child()} */}
            {child}
        </DComponent>
    );
    return output;
}

// function IfNode_bak(superProps) {
//     const { d8dprops, ...rest } = superProps;
//     const { _this, $refs, treeId, props, child } = d8dprops;

//     const [condRes, setCondRes] = useState(false);

//     useEffect(() => {
//         if (props.hasOwnProperty('conditionJs')) {
//             const condition = _this.returnEvalJsCode(props.conditionJs);
//             setCondRes(condition);
//             //console.log("IfNode", treeId, props.condition, condition)
//         }
//         else if (props.hasOwnProperty('condition')) {
//             const condition = _this.returnEvalJsCode(props.condition);
//             setCondRes(condition);
//             //console.log("IfNode", treeId, props.condition, condition)
//         }
//     }, [_this.state]);

//     if (condRes) {
//         return (
//             <ChildComponent child={child} />
//         )
//     }
//     else
//         return null;

// }

function IfNode(superProps) {
    const { d8dprops, ...rest } = superProps;
    const { _this, $refs, treeId, props, child } = d8dprops;

    let condition = false;
    if (props.hasOwnProperty('conditionJs')) {
        condition = _this.returnEvalJsCode(props.conditionJs);
    }
    else if (props.hasOwnProperty('condition')) {
        condition = _this.returnEvalJsCode(props.condition);
    }

    if (condition) {
        return (
            <React.Fragment key={treeId} {...rest}>
                {child()}
            </React.Fragment>
        )
    }
    else
        return null;

}

// function AModalNode({ _this, $refs, treeId, style, props, child }) {

//     let output = '';

//     let bodyStyle = {};
//     //bodyStyle.height = 300;
//     if (props.hasOwnProperty('heightType') && props.heightType == 'js') bodyStyle.height = _this.returnEvalJsCode(props.heightJs) || bodyStyle.height;
//     else if (props.height) bodyStyle.height = props.height;

//     let modalWidth;
//     //modalWidth = 520;
//     if (props.hasOwnProperty('widthType') && props.widthType == 'js') modalWidth = _this.returnEvalJsCode(props.widthJs) || modalWidth;
//     else if (props.width) modalWidth = props.width;

//     let eleProps = {};

//     if (props.hasOwnProperty('titleType') && props.titleType == 'js') eleProps.title = _this.returnEvalJsCode(props.titleJs);
//     else eleProps.title = props.title ? props.title : '';

//     if (props.hasOwnProperty('isOpenType') && props.isOpenType == 'js') eleProps.open = _this.returnEvalJsCode(props.isOpenJs);
//     else eleProps.open = props.isOpen ? props.isOpen : false;

//     if (props.hasOwnProperty('destroyOnCloseType') && props.destroyOnCloseType == 'js') eleProps.destroyOnClose = _this.returnEvalJsCode(props.destroyOnCloseJs);
//     else eleProps.destroyOnClose = props.destroyOnClose ? props.destroyOnClose : false;
//     //eleProps.mask = false;

//     var events = props.hasOwnProperty("events") ? props.events : [];

//     output = (
//         <Modal
//             bodyStyle={bodyStyle}
//             width={modalWidth}
//             key={treeId}
//             //ref={ref => $refs[treeId] = ref}
//             {...eleProps}
//             {..._this.eventsHandler($refs, events)}
//         >
//             {/* {child()} */}
//             <ChildComponent treeId={treeId} child={child} />
//         </Modal>
//     );
//     return output;
// }


function FOutNode(superProps) {
    const { d8dprops, ...rest } = superProps;
    const { _this, $refs, treeId, props, child, Element } = d8dprops;

    let output = '';
    let eleProps = _this.propsAttrJsHandler(props);

    var events = props.hasOwnProperty("events") ? props.events : [];


    if (eleProps.content !== undefined)
        output = (
            <React.Fragment key={treeId}>
                {eleProps.content}
            </React.Fragment>
        );


    return output;
}

function AChildItemNode(superProps) {
    const { d8dprops, ...rest } = superProps;
    const { _this, $refs, treeId, props, child, Element } = d8dprops;

    let output = '';
    let eleProps = _this.propsAttrJsHandler(props);

    var events = props.hasOwnProperty("events") ? props.events : [];

    output = (
        <Element
            key={treeId}
            //ref={ref => $refs[treeId] = ref}
            {...eleProps}
            {..._this.eventsHandler($refs, events)}
            {...rest}
        >
            <ChildComponent treeId={treeId} child={child} />
        </Element>
    );
    return output;
}


function AModalNode({ _this, $refs, treeId, style, props, child }) {

    let output = '';
    let eleProps = _this.propsAttrJsHandler(props);


    if (eleProps.hasOwnProperty('isOpen')) {
        const isOpen = eleProps.isOpen;
        eleProps = filterObjectByProperty(eleProps, 'buttonType');
        eleProps.open = isOpen;
    }

    if (eleProps.width !== undefined) eleProps.width = Number(eleProps.width);

    var events = props.hasOwnProperty("events") ? props.events : [];

    //console.log('AModalNode.eleProps',eleProps);

    output = (
        <App>
            <Modal
                key={treeId}
                //ref={ref => $refs[treeId] = ref}
                {...eleProps}
                // width={800}
                {..._this.eventsHandler($refs, events)}
            >
                <ChildComponent treeId={treeId} child={child} />
            </Modal>
        </App>
    );
    return output;
}

function ADrawerNode({ _this, $refs, treeId, style, props, child }) {

    let output = '';
    let eleProps = _this.propsAttrJsHandler(props);


    if (eleProps.hasOwnProperty('isOpen')) {
        const isOpen = eleProps.isOpen;
        eleProps = filterObjectByProperty(eleProps, 'buttonType');
        eleProps.open = isOpen;
    }

    var events = props.hasOwnProperty("events") ? props.events : [];

    output = (
        <Drawer
            key={treeId}
            //ref={ref => $refs[treeId] = ref}
            {...eleProps}
            {..._this.eventsHandler($refs, events)}
        >
            <ChildComponent treeId={treeId} child={child} />
        </Drawer>
    );
    return output;
}

function FChildNode({ _this, treeId }) {
    let output = '';
    output = _this.inComponent && (
        <React.Fragment key={treeId}>{typeof _this.props.children === 'function' && _this.props.children()}</React.Fragment>
    );
    return output;
}

// function ACommonNode({ _this, $refs, treeId, style, props, child, Element, elePropsCallback, isSingle }) {

//     let output = '';
//     let eleProps = _this.propsAttrJsHandler(props);
//     if (typeof child === 'function') child = child();
//     let children = child;

//     if (elePropsCallback) eleProps = elePropsCallback(eleProps);

//     if (eleProps.hasOwnProperty('content') && eleProps.content !== undefined
//         && ((Array.isArray(child) && child.length === 0) || !child)
//     )
//         children = eleProps.content;

//     let events = props.hasOwnProperty("events") ? props.events : [];

//     let eventProps = {};
//     if (eleProps.hasOwnProperty('onLoad')) {
//         eventProps.onInit = eleProps.onLoad;
//         eleProps = filterObjectByProperty(eleProps, 'onLoad');
//     }

//     style = style || {};

//     // if (treeId.toLowerCase().indexOf('span') > -1)
//     //     console.log("eleProps", treeId, eleProps, props, events,child,children)

//     if (treeId.indexOf('div_a4btsKm378') > -1)
//         console.log("eleProps", treeId, eleProps, props, events, style, eventProps, child, children)
//     // if (treeId.indexOf('breadcrumb_Ad2C2iJjd4') > -1)
//     //     console.log("getACommonNode", treeId, child)

//     let refProps = {};
//     if ($refs) refProps.ref = (ref) => _this.$refs[treeId] = ref;

//     if (!isSingle) {
//         let CompElement = <Element
//             //ref={(ref) => this.$refs[treeId] = ref}
//             {...refProps}
//             {...eleProps}
//             style={JSON.parse(JSON.stringify(style))}
//             {..._this.eventsHandler(_this.$refs, events)}
//         >{children}</Element>

//         output = React.createElement(CompBase, {
//             //key: treeId,
//             ..._this.eventsHandler(_this.$refs, events, true),
//             ...eventProps
//         }, CompElement);

//     } else {
//         output = (
//             <Element
//                 //ref={(ref) => this.$refs[treeId] = ref}
//                 //key={treeId}
//                 {...refProps}
//                 {...eleProps}
//                 style={style}
//                 {..._this.eventsHandler(_this.$refs, events)}
//             >
//                 {children}
//             </Element>
//         )
//     }

//     return output;
// }

function BCommonNode(superProps) {

    const { d8dprops, ...rest } = superProps;
    const { _this, $refs, treeId, style, props, child, Element, elePropsCallback, isSingle } = d8dprops;

    let output = '';
    let eleProps = {};

    if (treeId.indexOf('button_') > -1 && props.buttonType !== undefined) {
        props.type = props.buttonType
    }

    eleProps = _this.propsAttrJsHandler(props);
    let children = child;


    if (elePropsCallback) eleProps = elePropsCallback(eleProps);

    if (treeId.toLowerCase().indexOf('span_') > -1 && eleProps.hasOwnProperty('content') && eleProps.content !== undefined
    ) {
        children = eleProps.content;
        eleProps = filterObjectByProperty(eleProps, 'content');
    }
    else if (treeId.toLowerCase().indexOf('button_') > -1 && eleProps.hasOwnProperty('value') && eleProps.value !== undefined
    ) {
        children = eleProps.value;
        eleProps = filterObjectByProperty(eleProps, 'value');
    }
    // else if (treeId.toLowerCase().indexOf('modal_') > -1 ) {
    //     children = eleProps.value;
    //     eleProps = filterObjectByProperty(eleProps, 'value');
    // } 
    else if (eleProps.hasOwnProperty('children') && eleProps.children !== undefined && typeof eleProps.children === 'string'
    ) {
        children = eleProps.children;
        eleProps = filterObjectByProperty(eleProps, 'children');
    }
    else {
        if (typeof child === 'function') children = child();
        //if (typeof child === 'function') children =  <ChildComponent child={child} />;

    }

    let events = props.hasOwnProperty("events") ? props.events : [];

    let eventProps = {};
    if (eleProps.hasOwnProperty('onLoad')) {
        eventProps.onInit = eleProps.onLoad;
        eleProps = filterObjectByProperty(eleProps, 'onLoad');
    } else {
        let tmpEvents = _this.eventsHandler(_this.$refs, events, true);
        if (tmpEvents.hasOwnProperty('onInit')) {
            eventProps.onInit = tmpEvents.onInit;
        }
    }

    //style = style || {};


    // if (treeId.toLowerCase().indexOf('button_') > -1)
    //     console.log("eleProps", treeId, eleProps, props, child, children)

    // if (treeId.indexOf('div_a4btsKm378') > -1)
    //     console.log("eleProps", treeId, eleProps, props, events, style, eventProps, child, children)
    // if (treeId.indexOf('breadcrumb_Ad2C2iJjd4') > -1)
    //     console.log("getACommonNode", treeId, child)

    if (rest.style && style) {
        rest.style = {
            ...style,
            ...rest.style
        }
    } else if (style) {
        rest.style = {
            ...style,
        }
    }

    //console.log("BCommonNode.rest", treeId, rest, style)

    let refProps = {};
    if ($refs) refProps.ref = (ref) => _this.$refs[treeId] = ref;

    if (treeId.indexOf('form') > -1) {
        const [form] = Form.useForm();
        eleProps.form = form;
    }


    let loaded = false;
    useEffect(() => {
        if (!loaded) {
            if (eventProps.onInit && typeof eventProps.onInit === 'function') eventProps.onInit();
            loaded = true;
        }
    }, [])

    output = (
        <Element
            //ref={(ref) => this.$refs[treeId] = ref}
            //key={treeId}
            {...refProps}
            {...eleProps}
            //style={style || {}}
            {..._this.eventsHandler(_this.$refs, events)}
            {...rest}
        >
            {children}
        </Element>
    )

    return output;


    // if (!isSingle) {
    //     let CompElement = <Element
    //         //ref={(ref) => this.$refs[treeId] = ref}
    //         {...refProps}
    //         {...eleProps}
    //         style={JSON.parse(JSON.stringify(style))}
    //         {..._this.eventsHandler(_this.$refs, events)}
    //     >{children}</Element>

    //     output = React.createElement(CompBase, {
    //         //key: treeId,
    //         ..._this.eventsHandler(_this.$refs, events, true),
    //         ...eventProps
    //     }, CompElement);

    // } else {
    //     output = (
    //         <Element
    //             //ref={(ref) => this.$refs[treeId] = ref}
    //             //key={treeId}
    //             {...refProps}
    //             {...eleProps}
    //             style={style}
    //             {..._this.eventsHandler(_this.$refs, events)}
    //         >
    //             {children}
    //         </Element>
    //     )
    // }

    // return output;
}

// function ARichtextEditorNode(superProps) {

//     const { d8dprops, ...rest } = superProps;
//     const { _this, $refs, treeId, style, props, child, Element, elePropsCallback, isSingle } = d8dprops;

//     const [WangEditorNode, setWangEditorNode] = useState(null);

//     let eleProps = {};
//     if (props.hasOwnProperty('widthType') && props.widthType == 'js') eleProps.width = _this.returnEvalJsCode(props.widthJs);
//     else eleProps.width = props.width;

//     if (props.hasOwnProperty('heightType') && props.heightType == 'js') eleProps.height = _this.returnEvalJsCode(props.heightJs);
//     else eleProps.height = props.height;

//     if (props.hasOwnProperty('htmlType') && props.htmlType == 'js') eleProps.html = _this.returnEvalJsCode(props.htmlJs);
//     else eleProps.html = props.html;

//     let events = props.hasOwnProperty("events") ? props.events : [];

//     import('./Wangeditor').then((module) => {
//         const WangEditor = module.default;
//         setWangEditorNode(
//             <WangEditor
//                 key={treeId}
//                 ref={ref => _this.$refs[treeId] = ref}
//                 style={style}
//                 {...eleProps}
//                 {..._this.eventsHandler($refs, events)}
//                 {...rest}
//             //onChange={(html) => this.updateProps(treeId,'html',html)} 
//             />
//         );
//     });

//     return WangEditorNode;
// }


function NavTo(props) {
    const navigate = useNavigate();

    const onNavigate = (path) => {
        navigate(path);
    };

    useEffect(() => {
        playerEventEmitter.on('ON_NAVIGATE', onNavigate);
        return () => {
            playerEventEmitter.off('ON_NAVIGATE', onNavigate);
        };
    }, []);

    return (
        <React.Fragment></React.Fragment>
    )
};


class AInputNode extends React.Component {
    constructor(props) {
        super(props);
        //console.log('AMenu.props',props)
        this.eventProps = {};
        this.state = {
            value: props.d8dprops.props.defaultValue || props.d8dprops.props.value,
            // placeholder:props.eleProps.placeholder,
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.onInit();
        }, 100)

    }

    componentDidUpdate(prevProps) {
        //console.log(prevProps)
        //console.log(this.props)

        const value = prevProps.d8dprops.props.defaultValue
        const newValue = this.props.d8dprops.props.defaultValue;
        if (value != newValue) {
            this.setState({
                value: newValue
            })
        }
    }

    onInit() {
        if (this.props.hasOwnProperty('onInit')) this.props.onInit();
        //if (this.eventProps.onInit && typeof this.eventProps.onInit === 'function') this.eventProps.onInit();
    }

    onBlur() {
        let value = this.state.value;
        if (this.eventProps.hasOwnProperty('onBlur')) this.eventProps.onBlur(value);
    }

    onChange(e) {
        this.setState({ value: e.target.value })
        if (this.eventProps.hasOwnProperty('onChange')) this.eventProps.onChange(e);
    }

    getValue() {
        return this.state.value;
    }

    setValue(value) {
        this.setState({ value })
    }

    render() {
        const { d8dprops, ...rest } = this.props;
        const { _this, $refs, treeId, style, props, child, Element, elePropsCallback, isSingle } = d8dprops;

        //console.log("AInputNode.rest", treeId, d8dprops,rest, style)

        let output = '';
        let eleProps = {};


        eleProps = _this.propsAttrJsHandler(props);
        let children = child;

        let events = props.hasOwnProperty("events") ? props.events : [];


        let eventProps = {};
        if (eleProps.hasOwnProperty('onLoad')) {
            this.eventProps.onInit = eleProps.onLoad;
            eleProps = filterObjectByProperty(eleProps, 'onLoad');
        } else {
            let tmpEvents = _this.eventsHandler(_this.$refs, events, true);
            if (tmpEvents.hasOwnProperty('onInit')) {
                this.eventProps.onInit = tmpEvents.onInit;
            }
        }

        this.eventProps = {
            ...this.eventProps,
            ..._this.eventsHandler(_this.$refs, events)
        }


        if (rest.style && style) {
            rest.style = {
                ...style,
                ...rest.style
            }
        } else if (style) {
            rest.style = {
                ...style,
            }
        }

        //console.log("BCommonNode.rest", treeId, rest, style)

        // let refProps = {};
        // if ($refs) refProps.ref = (ref) => _this.$refs[treeId] = ref;

        eleProps = {
            ...eleProps,
            onChange: this.onChange.bind(this),
            onBlur: this.onBlur.bind(this),
            value: this.state.value,
            // placeholder={this.state.placeholder}
        }

        output = (
            <Element
                //ref={(ref) => this.$refs[treeId] = ref}
                //key={treeId}
                // {...refProps}
                {...eleProps}
                //style={style || {}}
                // {..._this.eventsHandler(_this.$refs, events)}
                {...rest}
            >
                {children}
            </Element>
        )

        return output;
    }
}

class AMenu extends React.Component {
    constructor(props) {
        super(props);
        //console.log('AMenu.props',props)
        this.state = {
            current: props.selectedKeys,
            items: props.items,
        }
    }

    componentDidMount() {
        if (!this.loaded) {
            this.loaded = true;
            setTimeout(() => {
                this.onInit();
            }, 100)
        }

    }

    onInit() {
        if (this.props.hasOwnProperty('onInit')) this.props.onInit();
    }

    setCurrent(current) {
        this.setState({ current })
    }

    setItems(items) {
        this.setState({ items })
    }

    render() {
        return (
            <React.Fragment>
                <Menu
                    className={this.props.className}
                    style={this.props.style}
                    mode={this.props.mode}
                    theme={this.props.theme}
                    items={this.state.items}
                    selectedKeys={this.state.current}
                    onClick={this.props.onClick}
                />
            </React.Fragment>
        )
    }
}

class CompBase extends React.Component {


    constructor(props) {
        super(props);
        //console.log(props)
        this.loaded = false;
    }

    componentDidMount() {
        if (!this.loaded) {
            //console.log('CompBase.componentDidMount', this._reactInternals.key);
            this.loaded = true;
            setTimeout(() => {
                this.onInit();
            }, 100)
        }

    }

    onInit() {
        if (this.props.hasOwnProperty('onInit') && typeof this.props.onInit === 'function') this.props.onInit();
    }

    render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}

class PlayBase extends Component {

    constructor(props) {
        super(props);
        //console.log(props)
        this.inComponent = false;
    }

    paramsHandler(inParams, eventType, eventObj) {
        var output = {};
        inParams.map(item => {
            if (item.type == 'string')
                output[item.name] = item.value;
            else if (item.type == 'js') {
                //console.log('paramsHandler.eventObj',eventObj)
                var eventParam = {};
                //if(eventType == 'onChange' && !Array.isArray(eventObj))eventParam.value = eventObj.target.value || eventObj;
                //else eventParam = eventObj;

                if (eventObj && eventObj.hasOwnProperty('target')) eventParam.value = eventObj.target.value;
                else eventParam = eventObj;
                //console.log('paramsHandler.eventObj',eventObj,eventParam)

                //output[item.name] = this.jsFuncHandler(this.$refs, { jsCode: item.valueJs || item.value })(eventParam); // 适配老 item.value
                output[item.name] = this.returnEvalJsCode(item.valueJs || item.value, eventParam); // 适配老 item.value

            }

        });
        //console.log('paramsHandler.output',output)
        return output;
    }

    eventsHandler($refs, events, isInit) {
        var _this = this;
        var output = {};
        var $refs = this.$refs;

        if (isInit) events = events.filter(item => item.eventType == 'onInit');
        else events = events.filter(item => item.eventType != 'onInit');

        events.map(item => {
            output[item.eventType] = function (eventObj) {
                //console.log('eventsHandler.this[item.method]',item.method,item.inParams,$refs[item.method])
                //console.log('eventsHandler.event.callback',eventObj,arguments)
                if (item.eventType == 'onClick' && item.stopPropagation) {
                    eventObj.stopPropagation(); //阻止原生事件冒泡
                    eventObj.nativeEvent.stopImmediatePropagation(); //阻止最外层document上的事件冒泡
                }

                //var treeId = _this.devIdHandler(item.method);
                var treeId = item.method;
                if (typeof $refs[treeId] === 'function') {
                    const args = Array.from(arguments);
                    //const argsString = JSON.stringify(args);

                    if (args.length > 1) eventObj = JSON.parse(JSON.stringify(args));
                    $refs[treeId](_this.paramsHandler(item.inParams, item.eventType, eventObj));
                } else {
                    console.log(`事件关联的${treeId}不存在，请检查`)
                }
            }
        });
        //console.log('eventsHandler',output,isInit)
        return output;
    }

    // moduleCodeHandler(moduleId) {
    //     //let treeData = [...this.state.gData];
    //     let treeData = [...this.gData];
    //     let treeId = this.devIdHandler(moduleId);
    //     let treeInfo = treeData.find(item => {
    //         return item.type == 'module' && item.id == treeId
    //     });

    //     //console.log('moduleCodeHandler', treeInfo);
    //     if (treeInfo)
    //         return treeInfo.props.treeCode;
    //     else
    //         return [];
    // }

    // modulesHandler() {
    //     let treeData = [...this.state.gData];
    //     let modules = treeData.filter(item => {
    //         return item.type == 'module'
    //     });

    //     //console.log('modulesHandler', modules);
    //     return modules;
    // }

    // devIdHandler(devId) {
    //     let treeData = [...this.state.gData];
    //     let treeInfo = treeData.find(item => {
    //         try {
    //             var tmp = item.props.devId ? item.props.devId : item.id;
    //             return tmp == devId
    //         } catch (error) {
    //             var tmp = item.id;
    //             return tmp == devId
    //         }

    //     });
    //     if (treeInfo)
    //         return treeInfo.id;
    //     else
    //         return undefined;
    // }

}

class PlayHandler extends PlayBase {
    debugJsFuncCode(jsCode, param, jsFunInfo) {
        param = param !== undefined ? param : {};
        let callback = (res) => {
            console.log('调试_funcCb', res);
        }
        let isSync = jsFunInfo.isSync;
        let res = this.jsFuncHandler(this.$refs, { jsCode, isSync }, jsFunInfo)(param, callback);

        //console.log('debugJsFuncCode',jsCode,param,res);
        return res;
    }

    returnEvalJsCode(jsCode, param, jsFunInfo = {}) {
        jsCode = `
            return ${jsCode}
        `
        param = param !== undefined ? param : {};

        //jsFunInfo.hasReturn = true;

        let res = this.jsFuncHandler(this.$refs, { jsCode }, jsFunInfo)(param);

        //console.log('returnEvalJsCode',jsCode,param,res);
        return res;
    }

    jsFuncHandler($refs, { jsCode, isSync }, jsFunInfo = {}) {
        //const callBack = 

        const F = (treeId) => {
            //var treeId = this.devIdHandler(devId);
            //var treeId = this.devIdHandler(devId);
            //treeId = treeId ? treeId : devId;
            //console.log("jsFuncHandler.F.treeId",treeId)

            const getPlayerThis = (_this) => {
                //console.log('getPlayerThis',_this);
                if (_this.inComponent) return getPlayerThis(_this.getThis());
                else return _this
            };


            if (treeId.indexOf('variable_') > -1) {
                return {
                    callMethod: (method, param, callback) => {

                        //if(treeId == 'variable_FpSnM6QZE5')console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.state',this.state[treeId],this.state,this.$refs,this);


                        if (method == 'get') {
                            //var $vars = this.state.$vars;
                            var $vars = this.getState();
                            //console.log(treeId+'.',method,param,$vars,this)
                            var val = $vars[treeId] === undefined ? this.$refs[treeId] : $vars[treeId];
                            //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',this.$refs[treeId],$vars[treeId],this.$refs);
                            if (param) {
                                if (val && val.hasOwnProperty(param)) return val[param];
                                else return undefined;
                            }
                            else
                                return val;
                        }
                        else if (method == 'set') {
                            //var $vars = CircularJSON.parse(CircularJSON.stringify(this.state.$vars));
                            var $vars = {};
                            $vars[treeId] = param;

                            this.setState($vars, callback);

                        }
                        else if (method == 'isNull') {
                            //var $vars = this.state.$vars;
                            var $vars = this.getState();
                            //console.log(treeId+'.',method,param,$vars,this)
                            var val = $vars[treeId] === undefined ? this.$refs[treeId] : $vars[treeId];

                            if (val === undefined) return true;
                            else if (val === null) return true;
                            else if (typeof val === 'object') return Object.keys(val).length == 0;
                            else return false;
                        }
                    }
                }
            }
            else if (treeId.indexOf('aList_') > -1) {
                return {
                    callMethod: (method, param, callback) => {

                        let listItem = this.getContext('listItem') || {};
                        let val = listItem[treeId] || [];

                        if (method == 'getItem') {
                            return val;
                        }
                    }
                }
            }
            else if (treeId.indexOf('aTable_') > -1) {
                return {
                    callMethod: (method, param, callback) => {

                        //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.state',this.state.$vars[treeId],this.state,this.$refs);

                        var val = this.context[treeId] ? this.context[treeId] : [];

                        if (method == 'getItem') {
                            //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',val);
                            //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',this.$refs[treeId],$vars[treeId],this.$refs);
                            return val;
                        }
                    }
                }
            }
            else if (treeId.indexOf('aTree_') > -1) {
                return {
                    callMethod: (method, param, callback) => {

                        //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.state',this.state.$vars[treeId],this.state,this.$refs);

                        var val = this.context[param] ? this.context[param] : '';

                        if (method == 'getItem') {
                            //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',val);
                            //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',this.$refs[treeId],$vars[treeId],this.$refs);
                            return val;
                        }
                    }
                }
            }
            else if (treeId.indexOf('for_') > -1) {
                return {
                    /* callMethod: (method, param, callback) => {
                        var forItem = this.getForItem(treeId);

                        //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.forItem',forItem,this);

                        var val = forItem[param] || forItem[param] === 0 || forItem[param] === '0' ? forItem[param] : '';

                        if (method == 'getItem') {
                            //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',val);
                            //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',this.$refs[treeId],$vars[treeId],this.$refs);
                            return val;
                        }
                    } */
                    callMethod: (method, param, callback) => {


                        let fNodeItem = this.getContext('fNodeItem') || {};
                        let val = fNodeItem[treeId] || [];
                        // console.log(treeId + '.callMethod',method, val);
                        if (method === 'getItem') {
                            return val.item;
                        }
                        else if (method === 'getIndex') {
                            // 
                            return val.index;
                        }
                    }

                }
            }
            else if (treeId.indexOf('global_func') > -1) {
                return {
                    callMethod: (method, param, callback) => {

                        //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.context',this.context);

                        if (method == 'getConfig') {
                            let treeData = getStore('APP_CODE');
                            let treeInfo = treeData.find(item => item.type == 'config') || {};
                            let config = treeInfo.props;
                            let name = treeInfo.name;
                            var val = '';
                            if (param == 'apiHost') {
                                let preApiHost = config['preApiHost'] || '';
                                let prdApiHost = config['prdApiHost'] || '';
                                let hostname = window.location.hostname;
                                if (['prev2.d8dcloud.com'].indexOf(hostname) > -1) {
                                    preApiHost = preApiHost.replace('8090.dev.d8dcloud.com', 'prev2.d8dcloud.com');
                                    val = preApiHost;
                                } else if (['editorv2.d8dcloud.com'].indexOf(hostname) > -1) {
                                    preApiHost = preApiHost.replace('prev2.d8dcloud.com', 'editorv2.d8dcloud.com');
                                    val = preApiHost;
                                } else if (['docker.d8dcloud.com'].indexOf(hostname) > -1) {
                                    preApiHost = preApiHost.replace('prev2.d8dcloud.com', 'docker.d8dcloud.com').replace('8090.dev.d8dcloud.com', 'docker.d8dcloud.com');
                                    val = preApiHost;
                                } else if (['8090.dev.d8dcloud.com'].indexOf(hostname) > -1) {
                                    preApiHost = preApiHost.replace('prev2.d8dcloud.com', '8090.dev.d8dcloud.com');
                                    val = preApiHost;
                                } else if (['8820.dev.d8dcloud.com'].indexOf(hostname) > -1) {
                                    preApiHost = preApiHost.replace('prev2.d8dcloud.com', '8820.dev.d8dcloud.com');
                                    val = preApiHost;
                                } else
                                    val = prdApiHost;
                            }
                            else if (param == 'siteName') {
                                val = name;
                            } else {
                                val = config[param] ? config[param] : '';
                            }

                            return val;
                        }
                    }
                }
            }
            else if (treeId.indexOf('input_') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param,this.$refs[treeId]);
                        if (method == 'getValue') {
                            return this.$refs[treeId] && typeof this.$refs[treeId].getValue == 'function' ? this.$refs[treeId].getValue() : undefined;
                        } else if (method == 'setValue') {
                            if (this.$refs[treeId] && typeof this.$refs[treeId].setValue == 'function') this.$refs[treeId].setValue(param);
                        }
                    }
                }
            }
            else if (treeId.indexOf('form_') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param,this.getThis(),this);
                        if (method == 'getInstance') {
                            let _this = this.getThis();
                            if (_this.$refs[treeId])
                                return _this.$refs[treeId];
                            else {
                                console.log(treeId + '不存在，请检查是否未加载就先调用了');
                                return undefined;
                            }
                        }
                    }
                }
            }
            else if (treeId.indexOf('aInputNumber_') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param);
                        if (method == 'getValue') {
                            return this.$refs[treeId] && typeof this.$refs[treeId].getValue == 'function' ? this.$refs[treeId].getValue() : undefined;
                        } else if (method == 'setValue') {
                            if (this.$refs[treeId] && typeof this.$refs[treeId].setValue == 'function') this.$refs[treeId].setValue(param);
                        }
                    }
                }
            }
            else if (treeId.indexOf('RichtextEditor_') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param);
                        if (method == 'getHtml') {
                            return this.getThis().$refs[treeId] && typeof this.getThis().$refs[treeId].getHtml == 'function' ? this.getThis().$refs[treeId].getHtml() : undefined;
                        } else if (method == 'setHtml') {
                            if (this.getThis().$refs[treeId] && typeof this.getThis().$refs[treeId].setHtml == 'function') this.getThis().$refs[treeId].setHtml(param);
                            else {
                                //console.log(treeId+'.callMethod','.method',method,'.param',param,'.this.$refs[treeId] 不存在');
                                console.log(treeId + '不存在，请检查是否未加载就先调用了');
                                return undefined;
                            }
                        }
                    }
                }
            }
            else if (treeId.indexOf('aFlow_') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param);
                        if (method == 'getValue') {
                            return this.$refs[treeId] && typeof this.$refs[treeId].toObject == 'function' ? this.$refs[treeId].toObject() : undefined;
                        } else if (method == 'setValue') {
                            if (this.$refs[treeId] && typeof this.$refs[treeId].fromObject == 'function') this.$refs[treeId].fromObject(param);
                        }
                    }
                }
            }
            else if (treeId.indexOf('aSwitch_') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param,this);
                        if (method == 'getValue') {
                            return this.$refs[treeId] ? this.$refs[treeId].getValue() : undefined;
                        } else if (method == 'setValue') {
                            if (this.$refs[treeId]) this.$refs[treeId].setValue(param);
                        }
                    }
                }
            }
            else if (treeId.indexOf('aCascader_') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param,this);
                        if (method == 'getValue') {
                            return this.$refs[treeId] ? this.$refs[treeId].getValue() : undefined;
                        } else if (method == 'setValue') {
                            if (this.$refs[treeId]) this.$refs[treeId].setValue(param);
                        }
                    }
                }
            }
            else if (treeId.indexOf('fApi_') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param);

                        if (method == 'send') {
                            //console.log('callMethod.$refs[%s]',treeId,$refs[treeId]);
                            //return $refs[treeId]?$refs[treeId].input.value:undefined;
                            let apiProps = $refs[treeId];
                            let sendParam = {
                                method: param.method ? param.method : apiProps.method,
                                dataType: param.dataType ? param.dataType : apiProps.dataType,
                                url: param.url ? param.url : apiProps.url,
                                header: param.headers ? param.headers : apiProps.headers,
                                body: param.body,
                            }

                            //console.log('sendParam:',sendParam);

                            if (sendParam.method == 'post' && sendParam.dataType == 'json')

                                //console.log('apiPost:',sendParam);
                                Api.apiPost({
                                    url: sendParam.url,
                                    param: sendParam.body,
                                    success: param.success,
                                    fail: param.fail
                                })
                        }
                    }
                }
            }
            else if (treeId.indexOf('jsFunc_') > -1) {
                return {
                    call: (param, callback) => {
                        //console.log(treeId+'.call','.param',param);
                        //return this.$refs[treeId] ? this.$refs[treeId](param, callback) : undefined;
                        if (this.getThis().$refs[treeId]) {
                            return this.getThis().$refs[treeId](param, callback);
                        } else {
                            //console.log(treeId+'.callMethod','.method',method,'.param',param,'.this.$refs[treeId] 不存在');
                            console.log(treeId + '不存在，请检查是否未加载就先调用了');
                            return undefined;
                        }
                    },
                    callSync: (param) => {
                        //console.log(treeId+'.call','.param',param);
                        return new Promise((resolve, reject) => {
                            if (this.getThis().$refs[treeId]) {
                                const _callback = (res) => {
                                    resolve(res);
                                }
                                this.getThis().$refs[treeId](param, _callback);
                            } else {
                                //console.log(treeId+'.callMethod','.method',method,'.param',param,'.this.$refs[treeId] 不存在');
                                console.log(treeId + '不存在，请检查是否未加载就先调用了');
                                reject(undefined);
                            }
                        })
                    }
                }
            }
            else if (treeId.indexOf('page_func') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param,this,this.getThis());




                        if (method == 'navigate') {


                            //let _this = getPlayerThis(this);

                            //console.log(treeId + 'getPlayerThis',getPlayerThis(this).navigateTo,_this.navigateTo);

                            //_this.setWebTitle(param.path);
                            /* if (_this.navigateTo) {
                              _this.navigateTo(param.path);
                            } else {
                              console.log('navigateTo不存在', _this, param.path);
                            } */
                            function objectToQueryString(obj) {
                                let queryArr = Object.keys(obj);
                                if (Array.isArray(queryArr)) {
                                    return '?' + queryArr.map(key => key + '=' + encodeURIComponent(obj[key])).join('&');
                                }
                                return ''
                            }

                            let query = {
                                ...param.query
                            }
                            //Taro.navigateTo({ url: `/route/index?_=#${param.path}${objectToQueryString(query)}` })
                            let url = `${param.path}${objectToQueryString(query)}`
                            playerEventEmitter.emit('ON_NAVIGATE', url);

                        }
                        else if (method == 'openNew') {
                            window.open(param, "_blank");
                        }
                        else if (method == 'getHost') {
                            return window.location.protocol + '//' + window.location.host;
                        }
                        else if (method == 'getFirstHost') {
                            return window.location.host.split('.').slice(-2).join('.');
                        }
                        else if (method == 'getSecondHost') {
                            return window.location.host.split('.').slice(-3).join('.');
                        }
                        else if (method == 'getHostname') {
                            return window.location.host;
                        }
                        else if (method == 'getUrlParams') {
                            var getUrlParams = (url) => {
                                let urlStr = url.split('?')[1]
                                const urlSearchParams = new URLSearchParams(urlStr)
                                const result = Object.fromEntries(urlSearchParams.entries())
                                if (param) return result[param];
                                else return result;
                            }
                            return getUrlParams(window.location.href);
                        }
                        else if (method == 'setSiteTitle') {
                            return document.title = param;
                        }
                        else if (method === 'isMobile') {
                            //console.log('IS_MOBILE',getStore('IS_MOBILE'));
                            return getStore('IS_MOBILE');
                        }
                    }
                }
            }
            else if (treeId.indexOf('message_func') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param,getPlayerThis(this));
                        if (['success', 'error', 'warning', 'loading'].indexOf(method) > -1) {
                            //getPlayerThis(this).messageShow(method, param);
                            if (typeof param === 'string') {
                                playerEventEmitter.emit('SHOW_MESSAGE', {
                                    type: method,
                                    content: param
                                });
                            } else if (typeof param === 'object') {
                                playerEventEmitter.emit('SHOW_MESSAGE', {
                                    type: method,
                                    ...param
                                });
                            }
                        }
                        else console.log(treeId + `的method传参仅限success/error/warning/loading`);
                    }
                }
            }
            else if (treeId.indexOf('modal_func') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param,getPlayerThis(this));
                        if (['info', 'success', 'error', 'warning', 'confirm'].indexOf(method) > -1) {
                            playerEventEmitter.emit('SHOW_MODAL', method, param);
                        }
                        else console.log(treeId + `的method传参仅限info/success/error/warning/confirm`);
                    }
                }
            }
            else if (treeId.indexOf('date_func') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param);
                        if (method == 'timestamp2YMDHIS') {
                            return (new Date(param * 1000)).Format("yyyy-MM-dd hh:mm:ss")
                        }
                        else if (method == 'getNowMicroTime') {
                            return (new Date().getTime());
                        }
                        else if (method == 'dayjs') {
                            return dayjs;
                        }
                    }
                }
            }
            else if (treeId.indexOf('fEvent_') > -1) {
                return {
                    call: (param) => {
                        //console.log(treeId+'.call','.param',param,this);
                        //return $refs[treeId]?$refs[treeId](param,callback):undefined;
                        // let props = this.props;
                        let props = this.getProps();
                        if (props.hasOwnProperty(treeId)) props[treeId](param);
                        else {
                            //console.log(treeId+'.call.props',props,this);
                            console.log(treeId + '不存在，请检查');
                        }
                    }
                }
            }
            else if (treeId.indexOf('text_') > -1) {
                return {
                    callMethod: (method, param) => {
                        console.log(treeId + '.callMethod' + '.', method, '.param', param);
                        if (method == 'setValue') {
                            $refs[treeId].children[0].innerHTML = param;
                            //console.log('callMethod.$refs[%s]',treeId,$refs[treeId].children[0]);
                        }
                        else if (method == 'getValue') {
                            return $refs[treeId].children[0].innerHTML;
                            //console.log('callMethod.$refs[%s]',treeId,$refs[treeId].children[0]);
                        }
                    }
                }
            }
            else if (treeId.indexOf('aMenu_') > -1 || treeId.toLowerCase().indexOf('menu_') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param,this);
                        //console.log('callMethod.$refs[%s]',treeId,$refs[treeId]);
                        if (method == 'setCurrent') this.$refs[treeId].setCurrent(param);
                        else if (method == 'setItems') this.$refs[treeId].setItems(param);
                    }
                }
            }
            else if (treeId.indexOf('fComponent_') > -1) {
                return {
                    callMethod: (method, param, callback) => {
                        //console.log(treeId+'.callMethod','.method',method,'.param',param,'.$refs',this.$refs,'.this',this);
                        if (this.$refs[treeId]) {
                            const _callback = (res) => {
                                if (typeof callback === 'function') callback(res);
                            }
                            return this.$refs[treeId].callMethod({ method, param, callback: _callback });
                        }
                        else {
                            console.log(treeId + '.callMethod', '.method', method, '.param', param, '.this.$refs[treeId] 不存在', this);
                            console.log(treeId + '不存在，请检查是否未加载就先调用了');
                            return undefined;
                        }
                    },
                    callMethodSync: (method, param) => {
                        //console.log(treeId+'.callMethod','.method',method,'.param',param,'.$refs',this.$refs,'.this',this);

                        return new Promise((resolve, reject) => {
                            if (this.$refs[treeId]) {
                                const _callback = (res) => {
                                    resolve(res);
                                }
                                this.$refs[treeId].callMethod({ method, param, callback: _callback });
                            } else {
                                //console.log(treeId+'.callMethod','.method',method,'.param',param,'.this.$refs[treeId] 不存在');
                                console.log(treeId + '不存在，请检查是否未加载就先调用了');
                                reject(undefined);
                            }
                        })


                    },
                }
            }
            else if (treeId.indexOf('nInput_') > -1) {
                return {
                    callMethod: (method, param) => {
                        console.log(treeId + '.callMethod' + '.', method, '.param', param);
                        //if(method == 'get')return $refs[treeId]?$refs[treeId]:param.default;
                        if (method == 'getValue') {
                            //console.log('callMethod.$refs[%s]',treeId,$refs[treeId],$refs[treeId].value);
                            return $refs[treeId] ? $refs[treeId].value : undefined;
                        }
                    }
                }
            }
            else if (treeId.indexOf('fNode_') > -1) {
                return {
                    call: (param = {}) => {
                        //console.log(treeId+'.call',param,this);
                        // if (param !== undefined) {
                        //     return this.getFNodeItemNode({ treeId, item: param });
                        // } else {
                        //     return this.outputTreeArr($refs, this.state.gData, treeId);
                        // }
                        //return this.getFNodeItemNode({ treeId, item: param });
                        return <FNodeItemNode d8dprops={{ _this: this, treeId, item: param }} />;
                    },
                    callMethod: (method, param, callback) => {

                        // if(treeId === 'fNode_XzB8XWNB52')
                        //     console.log(treeId + '.callMethod', this.getContext(), this);

                        // if(treeId === 'fNode_YCphkinSn3')
                        //     console.log(treeId + '.callMethod', this.getContext(), this);

                        let fNodeItem = this.getContext('fNodeItem') || {};
                        let val = fNodeItem[treeId] || [];

                        if (method == 'getItem') {
                            return val;
                        }
                    }
                }
            }
            else if (treeId.indexOf('string_func') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.' + method,param);

                        if (method == 'randomString') {
                            var randomString = function ({ length, type }) {
                                if (type === 'number')
                                    var str = '0123456789';
                                else
                                    var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                                var result = '';
                                for (var i = length; i > 0; --i)
                                    result += str[Math.floor(Math.random() * str.length)];
                                return result;
                            }
                            return randomString(param);
                        }
                    }
                }

            }
            else if (treeId.indexOf('store_func') > -1) {
                return {
                    callMethod: (method, param) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param);
                        if (method == 'set') {
                            return userSetStore(param.key, param.value);
                        }
                        else if (method == 'get') {
                            return userGetStore(param.key);
                        }
                        else if (method == 'subscribe') {
                            return UserStore.subscribe(param.callback);
                        }
                    }
                }
            }
            else if (treeId.indexOf('module_func') > -1) {
                return {
                    callMethod: (method, param, callback) => {
                        //console.log(treeId+'.callMethod' + '.',method,'.param',param);
                        if (method == 'import') {
                            // if(param == 'xlsx'){
                            //     import('xlsx/xlsx.mjs').then((module) => {
                            //         //const MobilePlayer = module.default;
                            //         console.log('module_func.xlsx', module);
                            //         if(typeof callback === 'function')callback(module);
                            //     });
                            // }
                            // else if(param == 'axios'){
                            //     return import('axios');
                            // }
                            // else if(param == 'file-saver'){
                            //     return import('file-saver');
                            // }
                            if (param == 'axios') {
                                return import('axios');
                            }
                        }
                    }
                }
            }
            else if (treeId.indexOf('service_') > -1) {
                return {
                    call: (param, callback = {}) => {
                        //console.log(treeId+'.call','.param',param);
                        return new Promise((resolve, reject) => {
                            const success = (res) => {
                                if (typeof callback.success === 'function') callback.success(res);
                                else resolve(res);
                            }
                            const fail = (err) => {

                                if (typeof callback.fail === 'function') callback.fail(err);
                                else reject(err);
                            }
                            Api.apiPost({
                                url: `${CONFIG.PRE_API_HOST}/api/${getStore('APP_ID')}/${treeId}`,
                                param: param,
                                success,
                                fail
                            })
                        })

                    }
                }
            }
        };

        jsFunInfo.isSync = isSync;

        return runJs(jsCode, F, jsFunInfo)

    }

    variableHandler($refs, treeId, props) {
        if (props.hasOwnProperty('valueType') && props.valueType == 'js')
            return this.returnEvalJsCode(props.valueJs);
        else
            return props.value;
    }

    setRefs() {
        //let treeData = [...this.state.gData];
        let treeData = [...this.gData];
        treeData.map(item => {
            try {
                let treeId = item.id;
                let props = item.hasOwnProperty("props") ? item.props : {};
                if (item.type === 'jsFunc') this.$refs[treeId] = this.jsFuncHandler(this.$refs, props, { devId: treeId });
                else if (item.type === 'variable') {
                    this.$refs[treeId] = this.variableHandler(this.$refs, treeId, props);
                }
                else if (item.type === 'fApi') this.$refs[treeId] = props;

            } catch (error) {
                console.log('设置逻辑组件出错', error);
            }
        });

        //console.log('DComponent.$refs',this.$refs);
    }

    setPages() {
        let treeData = JSON.parse(JSON.stringify(this.state.gData));
        let pageInfos = [];
        let sitename = '';
        treeData.map(item => {
            let props = item.hasOwnProperty("props") ? item.props : {};

            if (item.type === 'page') {
                pageInfos.push({
                    name: item.name,
                    pathNav: props.pathNav,
                });
            } else if (item.type === 'config') {
                sitename = item.name;
            }

        });

        this.pageInfos = pageInfos;
        this.siteName = sitename;

        //console.log('setPage',pageInfos,sitename);
    }
}

class PlayerUI extends PlayHandler {


    getClassName({ $refs, treeId, props }) {
        let hideScroll = props.hasOwnProperty('hideScroll') ? props.hideScroll : false;
        let className = props.hasOwnProperty('className') ? props.className : '';
        return classNames(className, {
            'hide-scroll-bar': hideScroll,
            //'elementSelected': $refs[treeId].className && $refs[treeId].className.indexOf('elementSelected') > -1
        });
    }

    frontCodeHandler() {
        //let appCode = this.state.AppCode || [];
        //return this.state.frontCode;
        return this.frontCode;
    }

    moduleCodeHandler(moduleId) {
        //console.log('moduleCodeHandler', moduleId);
        //let modules = this.state.AppCode.find(item => item.type === 'modules') || { children: [] };
        let modules = this.AppCode.find(item => item.type === 'modules') || { children: [] };
        let moduleObj = modules.children.find(item => item.type === 'module' && item.id === moduleId) || {};
        return moduleObj.children || [];
    }


    setFrontCode(appCode = []) {
        //console.log('setFrontCode', appCode);
        let moduleObj = appCode.find(item => item.type === 'front') || {};
        let frontCode = moduleObj.children || [];

        //this.setState({ 'frontCode': frontCode });
        this.frontCode = frontCode;
    }

    findNodeById(treeId) {
        // if(this.state.nodeCaches[treeId]) return this.state.nodeCaches[treeId];
        // else{
        //     console.log('findNodeById',treeId);
        //     let nodeCaches = this.state.nodeCaches;
        //     nodeCaches[treeId] = findNodeById(treeId, this.frontCodeHandler());
        //     this.setState(nodeCaches);
        //     return nodeCaches[treeId];
        // }

        if (this.nodeCaches[treeId]) return this.nodeCaches[treeId];
        else {
            //console.log('findNodeById', treeId);
            this.nodeCaches[treeId] = findNodeById(treeId, this.frontCodeHandler());
            return this.nodeCaches[treeId];
        }
    }

    getIfNode({ $refs, treeId, props, child }) {
        let output = '';

        let condRes = false;

        if (props.hasOwnProperty('condition')) condRes = this.returnEvalJsCode(props.condition);

        if (condRes) {
            //const ifNodeCode = this.findNodeById(treeId);

            // output = (
            //     <CommonComponent
            //         key={treeId}
            //         _this={this}
            //         treeCode={ifNodeCode.children}
            //         rnd={this.getState().rnd}
            //     />
            // )

            //output = this.outputNodes(ifNodeCode.children)
            output = child();

            return output;
        }
        else
            return '';


    }

    getFChildNode({ treeId }) {
        let output = '';
        output = this.inComponent && (
            <React.Fragment key={treeId}>{this.props.children}</React.Fragment>
        );
        return output;
    }

    getFComponentNode({ $refs, treeId, props, child }) {
        let output = '';

        if (props.hasOwnProperty('visible') && !props.visible) return output;

        //let modules = this.inComponent?this.state.modules:this.modulesHandler();
        let treeCode = [];
        // if(!this.state.modules[props.moduleId]){
        //     treeCode = this.moduleCodeHandler(props.moduleId);
        //     const modules = {...this.state.modules};
        //     modules[props.moduleId] = treeCode;
        //     this.setState({modules});
        // }else
        //     treeCode = this.state.modules[props.moduleId]

        if (!this.modules[props.moduleId]) {
            treeCode = this.moduleCodeHandler(props.moduleId);
            this.modules[props.moduleId] = treeCode;
        } else
            treeCode = this.modules[props.moduleId];

        // const modules = getStore('APP_MODULES') || {};
        // if (!modules[props.moduleId]) {
        //     treeCode = this.moduleCodeHandler(props.moduleId);
        //     modules[props.moduleId] = treeCode;
        //     setStore('APP_MODULES', modules);
        // } else
        //     treeCode = modules[props.moduleId];

        let eleProps = {};
        if (props.hasOwnProperty('attr') && Array.isArray(props.attr)) {

            let attr = [];
            props.attr.map(item => {
                if (item.attrType == 'js') {
                    var jsCode = `
                        return ${item.attrJsCode}
                    `;
                    attr.push({
                        attrId: item.attrId,
                        attrValue: this.jsFuncHandler($refs, { jsCode })({})
                    });
                }
                else
                    attr.push({
                        attrId: item.attrId,
                        attrValue: item.attrValue
                    });

            });
            //console.log('getFComponentNode.props.attr', props.attr,attr)
            eleProps.attr = attr;
        }

        var events = props.hasOwnProperty("events") ? props.events : [];

        //console.log('getFComponentNode',props.moduleId,this.getState().rnd,this)

        output = (
            <DComponent
                key={treeId}
                ref={ref => this.$refs[treeId] = ref}
                _this={this}
                treeCode={treeCode}
                rnd={this.getState().rnd}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            >
                {child && child()}
            </DComponent>
        );
        return output;
    }

    getForNode({ $refs, treeId, props }) {
        let output = [];

        //console.log('UICommon.getForNode',treeId,props,child)

        let eleProps = {};

        let dataSource = [];
        if (props.hasOwnProperty('dataSourceJs')) dataSource = this.returnEvalJsCode(props.dataSourceJs);


        if (Array.isArray(dataSource)) {

            let FNodeCode = this.findNodeById(treeId);

            dataSource.map((item, index) => {
                // output.push(

                //     <GlobalContext.Provider key={treeId + 'for' + index} value={{
                //         ...this.context,
                //         forItem:[{treeId,item,index}]
                //     }}>
                //         <ForItemComponent treeId={treeId}  forIndex={index}
                //             _this={this}
                //         />
                //     </GlobalContext.Provider> 
                // );
                var fNodeItem = {}; fNodeItem[treeId] = item;

                //console.log('UICommon.getFNodeItemNode', treeId, item, fNodeItem)


                output.push(
                    <GlobalContext.Provider value={fNodeItem} key={treeId + 'for' + index}>
                        <FNodeComponent
                            //key={treeId}
                            //ref={ref => this.$refs[treeId] = ref}
                            _this={this}
                            treeCode={FNodeCode.children}
                            rnd={this.getState().rnd}
                        />
                    </GlobalContext.Provider>
                );
            });
        }




        return output;
    }

    getFNodeItemNode({ treeId, item }) {
        let output = [];


        var fNodeItem = {}; fNodeItem[treeId] = item;

        //console.log('UICommon.getFNodeItemNode', treeId, item, fNodeItem)

        let FNodeCode = this.findNodeById(treeId);

        output = (
            <GlobalContext.Provider value={fNodeItem}>
                <FNodeComponent
                    //key={treeId}
                    //ref={ref => this.$refs[treeId] = ref}
                    _this={this}
                    treeCode={FNodeCode.children}
                    rnd={this.getState().rnd}
                />
            </GlobalContext.Provider>
        );
        return output;
    }

    getRoutesNode({ $refs, treeId, props, child }) {

        let output = '';

        let eleProps = {};

        output = (
            <Routes key={treeId}>
                {child()}
            </Routes>
        );
        return output;
    }

    getRouteNode({ $refs, treeId, props, child }) {

        let output = '';

        //let element = props.element ||  this.outputTreeArr($refs,this.state.gData, treeId)

        let eleProps = {};

        // const Element = () => (
        //     <>
        //         <CommonComponent
        //             _this={this}
        //             treeCode={props.element}
        //         />
        //         <NavTo />
        //     </>
        // )

        // output = (
        //     <Route key={treeId}
        //         path={props.path}
        //         element={
        //             <>
        //                 <FNodeComponent
        //                     _this={this}
        //                     treeCode={props.element}
        //                     rnd={this.getState().rnd}
        //                 />
        //                 <NavTo />
        //             </>}
        //     />
        // );

        output = (
            <Route key={treeId}
                path={props.path}
                element={
                    <>
                        {child()}
                        <NavTo />
                    </>}
            />
        );

        return output;
    }
}

class UICommon extends PlayerUI {

    constructor(props) {
        super(props);
        this.styledComps = {};
    }

    buildTreeCode(tree, pid) {
        let treeArr = tree;

        const findChild = (pid) => {
            let outputArr = [];
            let tree = treeArr.filter(item => item.pid === pid);
            tree = tree.sort((a, b) => a.sort - b.sort);
            for (let index = 0; index < tree.length; index++) {
                const element = tree[index];

                let output = {
                    ...element,
                    children: findChild(element.id)
                };

                outputArr.push(output);

            }
            return outputArr;
        }

        let treeCode = findChild(pid);


        return treeCode;
    }

    styleAttrJsHandler(style) {
        Object.keys(style).map(name => {
            if (style.hasOwnProperty(name + 'Type') && style[name + 'Type'] == 'js')
                style[name] = this.returnEvalJsCode(style[[name + 'Js']]);
        })
        return style;
    }

    propsAttrJsHandler(props) {
        const eleProps = {};
        Object.keys(props).map(name => {
            if (name === 'events') return;
            if (name === 'devId') name = 'devid';

            // if (props.hasOwnProperty(name + 'Type') && props[name + 'Type'] === 'js')
            //     eleProps[name] = this.returnEvalJsCode(props[name + 'Js']);
            // else 
            // if (name.includes('Type') && props.hasOwnProperty(name) && props[name] === 'js'){
            //     var originName = name.replace('Type', '');
            //     eleProps[originName] = this.returnEvalJsCode(props[originName + 'Js']);
            // }else 
            if (name.includes('Js') && props.hasOwnProperty(name) && props[name] !== undefined) {
                //eleProps[name.replace('Js','')] = this.returnEvalJsCode(props[name]);
                var originName = name.replace('Js', '');
                if (!props.hasOwnProperty(originName + 'Type')) {
                    var val = this.returnEvalJsCode(props[name]);
                    if (!val && ['dataSource'].includes(originName)) val = [];
                    eleProps[originName] = val;
                    //eleProps[name] = val;
                } else if (props.hasOwnProperty(originName + 'Type') && props[originName + 'Type'] === 'js') {
                    eleProps[originName] = this.returnEvalJsCode(props[name]);
                }
            }
            else if (!name.includes('Type') && props.hasOwnProperty(name) && props[name] !== undefined) eleProps[name] = props[name];
            else if (name.includes('htmlType') && props.hasOwnProperty(name) && props[name] !== undefined) eleProps[name] = props[name];
        })


        eleProps.className = this.getClassName({ props: eleProps });

        let output = filterObjectByProperty(eleProps, 'hideScroll');

        return output;
    }

    getStyleCssNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};

        let css = '';
        if (props.hasOwnProperty('cssType') && props.cssType == 'js') css = this.returnEvalJsCode(props.cssJs);
        else css = props.css ? props.css : '';

        let StyledComp = null;
        //console.log('getStyleCssNode',this.styledComps);
        if (this.styledComps.hasOwnProperty(treeId)) StyledComp = this.styledComps[treeId];
        else {
            StyledComp = this.styledComps[treeId] = styled.div`${css}`;
        }

        output = (
            <StyledComp key={treeId}
                //className={this.getClassName({$refs,treeId,props})}
                //style={style} 
                ref={ref => $refs[treeId] = ref}
            //{...eleProps}
            >
                {typeof child === 'function' && child()}
            </StyledComp>
        );
        return output;
    }

    outputNodes(treeCode) {
        //let treeCode = [...this.state.gData];
        //console.log('treeCode', treeCode)
        treeCode = JSON.parse(JSON.stringify(treeCode));

        const findChild = (tree) => {
            if (tree === undefined) return [];
            if (typeof tree === 'string') return tree;
            if (typeof tree === 'object' && !Array.isArray(tree)) { tree = [tree]; }
            //if (!Array.isArray(tree)) { tree = [tree]; }


            //console.log('tree', tree);

            let output = [];
            for (let index = 0; index < tree.length; index++) {
                const element = tree[index];

                const $refs = {};
                let treeId = element.id;
                let type = element.type;
                type = type.toLowerCase();
                let props = element.props || {};
                let style;
                if (props.hasOwnProperty('style')) style = JSON.parse(JSON.stringify(props.style));
                props = filterObjectByProperty(props, 'style');

                let child = null;
                // if (element.hasOwnProperty('children')) {
                //     if ([
                //         'if', 'for', 'fNode','fcomponent','modal'
                //     ].indexOf(type) > -1) child = () => { return findChild(element.children) };
                //     else child = findChild(element.children);
                // }

                if (element.hasOwnProperty('children') && Array.isArray(element.children) && element.children.length > 0) {
                    child = () => {
                        //console.log('findChild.treeId', treeId, element)
                        return findChild(element.children)
                    };

                }
                else if (element.hasOwnProperty('children') && typeof element.children === 'string') {
                    child = () => {
                        return element.children;
                    }
                } else {
                    child = () => {
                        //return []
                        return null
                    }
                }

                if (!type) break;




                if (style) {
                    style = { ...style };
                    style = this.styleAttrJsHandler(style);

                    if (style.hasOwnProperty('visibility') && (style.visibility === 'hidden' || style.visibility === false)) {
                        style.display = 'none';
                        style.visibility = 'hidden';
                    }

                    if (style.hasOwnProperty('backgroundImage') && style.backgroundImage !== undefined) {
                        let src = style.backgroundImage;
                        src = ['http', 'https'].indexOf(src) > -1 ? src : OSS_HOST + src;
                        style.backgroundImage = `url(${src})`;
                    }
                }
                output = getEleNode({ _this: this, $refs, treeId, style, props, child, findChild, type, output });

                // //if (type == 'front') output.push(child());
                // if (type == 'front') output.push(<ChildComponent key={treeId} treeId={treeId} child={child} />);
                // //else if (type == 'dom') output.push(child());
                // else if (type == 'dom') output.push(<ChildComponent key={treeId} treeId={treeId} child={child} />);
                // //else if (type == 'group') output.push(child());
                // else if (type == 'group') output.push(<ChildComponent key={treeId} treeId={treeId} child={child} />);
                // //else if (type == 'fnode' && this.context.inFNode) output.push(<ChildComponent key={treeId} treeId={treeId} child={child} />);
                // else if (type === "stylecss") output.push(this.getStyleCssNode({ $refs, treeId, style, props, child }));
                // //else if (type == 'fchild') output.push(this.getFChildNode({ $refs, treeId, props }));
                // else if (type == 'fchild') output.push(<FChildNode key={treeId} {...{ _this: this, $refs, treeId, props }} />);
                // else if (type == 'routes' || type == 'pageContainer') output.push(this.getRoutesNode({ $refs, treeId, props, child }));
                // else if (type == 'route' || type == 'page') output.push(this.getRouteNode({ $refs, treeId, props, child: () => { return findChild(props.element) } }));
                // //else if (type.indexOf("component") > -1) output.push(this.getFComponentNode({ $refs, treeId, props, child }));
                // else if (type.indexOf("component") > -1) output.push(<FComponentNode key={treeId} {...{ _this: this, $refs, treeId, props, child }} />);
                // //else if (type === "if") output.push(this.getIfNode({ $refs, treeId, props, child }));
                // else if (type === "if") output.push(<IfNode key={treeId} {...{ _this: this, $refs, treeId, props, child }} />);
                // //else if (type === "for") output.push(this.getForNode({ $refs, treeId, props }));
                // else if (type === "for") output.push(<ForNode key={treeId} d8dprops={{ _this: this, $refs, treeId, props, child }} />);

                // //else if (type === "form") output.push(this.getAFormNode({ $refs, treeId, style, props, child }));
                // else if (type === "form") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Form, isSingle: true }));
                // //else if (type === "form") output.push(<ACommonNode key={treeId} {...{ _this: this, $refs, treeId, style, props, child, Element: Form, isSingle: true }} />);
                // //else if (type === "form.item") output.push(this.getAFormItemNode({ $refs, treeId, style, props, child }));
                // else if (type === "form.item") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Form.Item, isSingle: true }));
                // //else if (type === "form.item") output.push(<ACommonNode key={treeId} {...{ _this: this, $refs: null, treeId, style, props, child, Element: Form.Item, isSingle: true }} />);
                // // else if (type === "input") output.push(this.getAInputNode({ $refs, treeId, style, props }));
                // // else if (type === "input.password") output.push(this.getAInputPasswordNode({ $refs, treeId, style, props }));
                // // else if (type === "textarea") output.push(this.getAInputTextAreaNode({ $refs, treeId, style, props }));
                // //else if (type === "inputnumber") output.push(this.getAInputNumberNode({ $refs, treeId, style, props }));
                // else if (type === "inputnumber") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: InputNumber, isSingle: true }));
                // else if (type === "input") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Input, isSingle: true }));
                // else if (type === "input.password") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Input.Password, isSingle: true }));
                // else if (type === "input.textarea") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Input.TextArea, isSingle: true }));
                // //else if (type === "select") output.push(this.getASelectNode({ $refs, treeId, style, props }));
                // else if (type === "select") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Select, isSingle: true }));
                // else if (type === "switch") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Switch, isSingle: true }));
                // //else if (type === "button") output.push(this.getAButtonNode({ $refs, treeId, style, props, child }));
                // else if (type === "button") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Button, elePropsCallback: this.getAButtonProps.bind(this) }));
                // // else if (type === "row") output.push(this.getARowNode({ $refs, treeId, style, props, child }));
                // // else if (type === "col") output.push(this.getAColNode({ $refs, treeId, style, props, child }));
                // else if (type === "row") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Row, elePropsCallback: this.getARowProps.bind(this) }));
                // else if (type === "col") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Col, isSingle: true }));
                // else if (type === "img") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: 'img', elePropsCallback: this.getImgProps.bind(this) }));
                // else if (type === "video") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: 'video', elePropsCallback: this.getVideoProps.bind(this) }));
                // //else if (type === "image") output.push(this.getAImageNode({ $refs, treeId, style, props }));
                // else if (type === "image") output.push(this.getACommonNode({ $refs: null, treeId, style, props, Element: Image, elePropsCallback: this.getAImageProps.bind(this) }));
                // //else if (type === "div") output.push(this.getDivNode({ $refs, treeId, style, props, child }));
                // else if (type === "div") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'div' }));
                // //else if (type === "span") output.push(this.getSpanNode({ $refs, treeId, style, props, child }));
                // else if (type === "span") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'span' }));
                // else if (type === "h1") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h1' }));
                // else if (type === "h2") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h2' }));
                // else if (type === "h3") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h3' }));
                // else if (type === "h4") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h4' }));
                // else if (type === "h5") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h5' }));
                // //else if (type === "space") output.push(this.getASpaceNode({ $refs, treeId, style, props, child }));
                // else if (type === "space") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Space }));
                // //else if (type === "space") output.push(<BCommonNode key={treeId} {...{ _this: this, $refs: null, treeId, style, props, child, Element: Space }} />);
                // //else if (type === "layout") output.push(this.getALayoutNode({ $refs, treeId, style, props, child }));
                // else if (type === "layout") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Layout }));
                // //else if (type === "header") output.push(this.getAHeaderNode({ $refs, treeId, style, props, child }));
                // else if (type === "header") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Header }));
                // //else if (type === "sider") output.push(this.getASiderNode({ $refs, treeId, style, props, child }));
                // else if (type === "sider") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Sider }));
                // //else if (type === "content") output.push(this.getAContentNode({ $refs, treeId, style, props, child }));
                // else if (type === "content") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Content }));
                // //else if (type === "footer") output.push(this.getAFooterNode({ $refs, treeId, style, props, child }));
                // else if (type === "footer") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Footer }));
                // //else if (type === "menu") output.push(this.getAMenuNode({ $refs, treeId, style, props }));
                // else if (type === "menu") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: AMenu }));
                // //else if (type === "card") output.push(this.getACardNode({ $refs, treeId, style, props, child }));
                // else if (type === "card") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Card }));
                // //else if (type === "dropdown") output.push(this.getADropdownNode({ $refs, treeId, style, props, child }));
                // // else if (type === "dropdown") output.push(this.getACommonNode({ $refs:null, treeId, style, props, child:()=>{
                // //     return (
                // //         <span>{typeof child === "function" && child()}</span>
                // //     )
                // // }, Element: Dropdown }));
                // else if (type === "dropdown") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Dropdown }));
                // else if (type === "dropdown.button") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Dropdown.Button }));
                // //else if (type === "table") output.push(this.getATableNode({ $refs, treeId, style, props }));
                // else if (type === "table") output.push(this.getACommonNode({ $refs: null, treeId, style, props, Element: Table }));
                // else if (type === "list") output.push(this.getACommonNode({ $refs: null, treeId, style, props, Element: List }));
                // else if (type === "list.item") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: List.Item }));
                // else if (type === "list.item.meta") output.push(this.getACommonNode({ $refs: null, treeId, style, props, Element: List.Item.Meta }));
                // // else if (type === "radio") output.push(this.getARadioNode({ $refs, treeId, style, props, child }));
                // // else if (type === "radiogroup") output.push(this.getARadioGroupNode({ $refs, treeId, style, props, child }));
                // // else if (type === "checkbox") output.push(this.getACheckBoxNode({ $refs, treeId, style, props, child }));
                // // else if (type === "checkboxgroup") output.push(this.getACheckBoxGroupNode({ $refs, treeId, style, props, child })); 
                // else if (type === "radio") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Radio }));
                // else if (type === "radio.group" || type === "radiogroup") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Radio.Group }));
                // else if (type === "checkbox") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Checkbox }));
                // else if (type === "checkbox.group" || type === "checkbox.group") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Checkbox.Group }));
                // //else if (type === "datepicker") output.push(this.getADatePickerNode({ $refs, treeId, style, props }));
                // else if (type === "datepicker") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Datepicker }));
                // // else if (type === "timepicker") output.push(this.getATimePickerNode({ $refs, treeId, style, props }));
                // else if (type === "timepicker") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Timepicker }));
                // else if (type === "upload") output.push(this.getAUploadNode({ $refs, treeId, style, props, child }));
                // //else if (type === "tree") output.push(this.getATreeNode({ $refs, treeId, style, props }));
                // else if (type === "tree") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Tree }));
                // //else if (type === "statistic") output.push(this.getAStatisticNode({ $refs, treeId, style, props }));
                // else if (type === "statistic") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Statistic }));
                // //else if (type === "calendar") output.push(this.getACalendarNode({ $refs, treeId, style, props }));
                // else if (type === "calendar") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Calendar }));
                // else if (type === "configprovider") output.push(this.getAConfigNode({ $refs, treeId, style, props, child }));
                // //else if (type === "tabs") output.push(this.getATabsNode({ $refs, treeId, style, props }));
                // else if (type === "tabs") output.push(this.getACommonNode({ $refs:null, treeId, style, props, Element: Tabs }));
                // // else if (type === "slider") output.push(this.getASliderNode({ $refs, treeId, style, props }));
                // else if (type === "slider") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Slider }));
                // //else if (type === "spin") output.push(this.getASpinNode({ $refs, treeId, style, props, child }));
                // else if (type === "spin") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Spin }));
                // //else if (type === "badge") output.push(this.getABadgeNode({ $refs, treeId, style, props, child }));
                // else if (type === "badge") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Badge }));
                // //else if (type === "progress") output.push(this.getAProgressNode({ $refs, treeId, style, props }));
                // else if (type === "progress") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Progress }));
                // //else if (type === "divider") output.push(this.getADividerNode({ $refs, treeId, style, props }));
                // else if (type === "divider") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Divider }));
                // //else if (type === "modal") output.push(this.getAModalNode({ $refs, treeId, style, props, child }));
                // else if (type === "modal") output.push(<AModalNode key={treeId} {...{ _this: this, $refs, treeId, style, props, child }} />);
                // //else if (type === "modal") output.push(this.getACommonNode({ $refs: null, treeId, style, props, Element: Modal }));
                // //else if (type === "drawer") output.push(this.getADrawerNode({ $refs, treeId, style, props, child }));
                // else if (type === "drawer") output.push(<ADrawerNode key={treeId} {...{ _this: this, $refs, treeId, style, props, child }} />);
                // //else if (type === "treeSelect") output.push(this.getATreeSelectNode({ $refs, treeId, style, props }));
                // //else if (type === "qrcode") output.push(this.getAQRCodeNode({ $refs, treeId, style, props }));
                // else if (type === "qrcode") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: QRCode }));
                // else if (type === "richtext") output.push(this.getARichtextNode({ $refs, treeId, style, props }));
                // //else if (type === "richtextEditor") output.push(this.getARichtextEditorNode({ $refs, treeId, style, props }));
                // else if (type === "richtextEditor") output.push(<ARichtextEditorNode key={treeId} {...{ _this: this, $refs, treeId, style, props }} />);
                // else if (type === "breadcrumb") output.push(this.getACommonNode({ $refs: null, treeId, style, props, Element: Breadcrumb }));
                // else if (type === "treeselect") output.push(this.getACommonNode({ $refs: null, treeId, style, props, Element: TreeSelect }));
                // else if (type === "carousel") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Carousel }));



                /*  
                    if (style) {
    
                        if (type == 'front') output.push(child);
                        else if (type == 'nButton') output.push(this.getNButtonNode({ $refs, treeId, style, props }));
                        else if (type === "nRow") output.push(this.getNRowNode({ $refs, treeId, style, props, child }));
                        else if (type === "nCol") output.push(this.getNColNode({ $refs, treeId, style, props, child }));
                        else if (type === "nTable") output.push(this.getNTableNode({ $refs, treeId, style, props }));
                        //else if (type === "front") output.push(this.getFrontNode({ $refs, treeId, style, props, child }));
                        else if (type === "text") output.push(this.getTextNode({ $refs, treeId, style, props }));
                        else if (type === "spanText") output.push(this.getSpanTextNode({ $refs, treeId, style, props }));
                        else if (type === "nInput") output.push(this.getNInputNode({ $refs, treeId, style, props }));
                        else if (type === "nButton") output.push(this.getNButtonNode({ $refs, treeId, style, props }));
    
                    }
    
                    if (type === "if") output.push(this.getIfNode({ $refs, treeId, props, child }));
                    else if (type === "group") output.push(this.getGroupNode({ treeId, child }));
                    else if (type === "fComponent") output.push(this.getFComponentNode({ $refs, treeId, props }));
                    else if (type === "pageContainer") output.push(this.getRoutesNode({ $refs, treeId, props, child }));
                    else if (type === "page") output.push(this.getRouteNode({ $refs, treeId, props, child }));
                    else if (type === "iframe") output.push(this.getIframeNode({ $refs, treeId, props, style }));
                */
            }
            if (output.length === 1) output = output[0];
            if (output.length === 0) output = null;
            //console.log('output', output);
            return output;
        }

        let outputArr = [];
        //outputArr = findChild(outputNodes);
        outputArr = findChild(treeCode);

        //console.log('outputNodes', outputArr);
        return outputArr;
    }

    outputTreeArr($refs, tree, pid) {

        let treeCode = this.buildTreeCode(tree, pid);

        return this.outputNodes(treeCode);
    }

    getOutputNode() {

        //先初始化  变量，函数
        this.setRefs();

        if (!this.inComponent) {
            this.setPages();
        }

        //再初始化 dom node
        let output = this.outputNodes(this.frontCodeHandler());

        return output;
    }

    getACommonNode({ $refs, treeId, style, props, child, Element, elePropsCallback, isSingle }) {

        return <BCommonNode key={treeId} d8dprops={{ _this: this, $refs, treeId, style, props, child, Element, elePropsCallback, isSingle }} />

        //return;

        // if (!isSingle) {
        //     return <ACommonNode key={treeId} {...{ _this: this, $refs, treeId, style, props, child, Element, elePropsCallback, isSingle }} />

        // } else {



        //     let output = '';
        //     let eleProps = this.propsAttrJsHandler(props);
        //     //if (typeof child === 'function') child = child();
        //     let children = child;

        //     if (elePropsCallback) eleProps = elePropsCallback(eleProps);

        //     if (eleProps.hasOwnProperty('content') && eleProps.content !== undefined
        //         && ((Array.isArray(child) && child.length === 0) || !child)
        //     )
        //         children = eleProps.content;

        //     let events = props.hasOwnProperty("events") ? props.events : [];

        //     let eventProps = {};
        //     if (eleProps.hasOwnProperty('onLoad')) {
        //         eventProps.onInit = eleProps.onLoad;
        //         eleProps = filterObjectByProperty(eleProps, 'onLoad');
        //     }

        //     // let CompElement = React.createElement(Element, {
        //     //     //key: treeId,
        //     //     ref:myRef,
        //     //     style,
        //     //     ...eleProps,
        //     //     ...this.eventsHandler(this.$refs, events),
        //     // });

        //     // if (treeId.toLowerCase().indexOf('span') > -1)
        //     //     console.log("eleProps", treeId, eleProps, props, events,child,children)

        //     // if (treeId.indexOf('div_a4btsKm378') > -1)
        //     //     console.log("eleProps", treeId, eleProps, props, events, style, eventProps, child, children)
        //     // if (treeId.indexOf('breadcrumb_Ad2C2iJjd4') > -1)
        //     //     console.log("getACommonNode", treeId, child)

        //     let refProps = {};
        //     if ($refs) refProps.ref = (ref) => this.$refs[treeId] = ref;

        //     if (!isSingle) {
        //         if (typeof child === 'function') children = <ChildComponent treeId={treeId} child={child} />;

        //         let CompElement = <Element
        //             //ref={(ref) => this.$refs[treeId] = ref}
        //             {...refProps}
        //             {...eleProps}
        //             style={style}
        //             {...this.eventsHandler(this.$refs, events)}
        //         >
        //             {children}
        //         </Element>

        //         output = React.createElement(CompBase, {
        //             key: treeId,
        //             ...this.eventsHandler(this.$refs, events, true),
        //             ...eventProps
        //         }, CompElement);

        //     } else {
        //         if (typeof child === 'function') children = child();
        //         output = <Element
        //             //ref={(ref) => this.$refs[treeId] = ref}
        //             key={treeId}
        //             {...refProps}
        //             {...eleProps}
        //             style={style}
        //             {...this.eventsHandler(this.$refs, events)}
        //         >{children}</Element>
        //     }

        //     return output;
        // }

    }
}

class AntUI extends UICommon {
    getACardNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('title') && props.title) eleProps.title = props.title ? props.title : '';
        // if(props.hasOwnProperty('items'))eleProps.items = props.items?props.items:[];
        // if(props.hasOwnProperty('mode'))eleProps.mode = props.mode?props.mode:'horizontal';
        // if(props.hasOwnProperty('theme'))eleProps.theme = props.theme?props.theme:'light';


        /* if(props.hasOwnProperty('extra')){
            eleProps.extra = this.outputTreeArr($refs,this.state.gData, props.extra);
        } */

        output = (
            <React.Fragment key={treeId} >
                <Card
                    //className={this.getClassName({$refs,treeId,props})}
                    style={style}
                    ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                >
                    {child}
                </Card>
            </React.Fragment>
        );
        return output;
    }

    getAFormNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('name') && props.name !== undefined) eleProps.name = props.name;
        if (props.hasOwnProperty('labelCol') && props.labelCol !== undefined) eleProps.labelCol = props.labelCol;
        if (props.hasOwnProperty('wrapperCol') && props.wrapperCol !== undefined) eleProps.wrapperCol = props.wrapperCol;
        if (props.hasOwnProperty('layout') && props.layout !== undefined) eleProps.layout = props.layout;
        if (props.hasOwnProperty('initialValues') && props.initialValues !== undefined) eleProps.initialValues = props.initialValues;


        /* if(props.hasOwnProperty('extra')){
            eleProps.extra = this.outputTreeArr($refs,this.state.gData, props.extra);
        } */

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <React.Fragment key={treeId} >
                <Form
                    //className={this.getClassName({$refs,treeId,props})}
                    style={style}
                    ref={ref => this.$refs[treeId] = ref}
                    {...eleProps}
                    {...this.eventsHandler($refs, events)}
                >
                    {child}
                </Form>
            </React.Fragment>
        );
        return output;
    }

    getAFormItemNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('label') && props.label !== undefined) eleProps.label = props.label;
        if (props.hasOwnProperty('name') && props.name !== undefined) eleProps.name = props.name;
        if (props.hasOwnProperty('rules') && props.rules !== undefined) eleProps.rules = props.rules;


        /* if(props.hasOwnProperty('extra')){
            eleProps.extra = this.outputTreeArr($refs,this.state.gData, props.extra);
        } */

        output = (
            <React.Fragment key={treeId} >
                <Form.Item
                    //className={this.getClassName({$refs,treeId,props})}
                    style={style}
                    //ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                >
                    {child}
                </Form.Item>
            </React.Fragment>
        );
        return output;
    }

    getAInputNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('placeholder') && props.placeholder !== undefined) eleProps.placeholder = props.placeholder;


        /* if(props.hasOwnProperty('extra')){
            eleProps.extra = this.outputTreeArr($refs,this.state.gData, props.extra);
        } */
        {/* <React.Fragment key={treeId} >
                
            </React.Fragment> */}
        output = (
            <Input
                key={treeId}
                //className={this.getClassName({$refs,treeId,props})}
                style={style}
                ref={ref => $refs[treeId] = ref}
                {...eleProps}
            >
                {child}
            </Input>

        );
        return output;
    }

    getAInputPasswordNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('placeholder') && props.placeholder !== undefined) eleProps.placeholder = props.placeholder;

        output = (
            <Input.Password
                key={treeId}
                //className={this.getClassName({$refs,treeId,props})}
                style={style}
                ref={ref => $refs[treeId] = ref}
                {...eleProps}
            >
                {child}
            </Input.Password>
        );
        return output;
    }

    getAInputTextAreaNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};

        if (props.hasOwnProperty('autoSize') && props.autoSize !== undefined) eleProps.autoSize = props.autoSize;

        if (props.hasOwnProperty('placeholder') && props.placeholder !== undefined) eleProps.placeholder = props.placeholder;

        output = (
            <Input.TextArea
                key={treeId}
                //className={this.getClassName({$refs,treeId,props})}
                style={style}
                ref={ref => $refs[treeId] = ref}
                {...eleProps}
            >
                {child}
            </Input.TextArea>
        );
        return output;
    }

    getAInputNumberNode({ $refs, treeId, style, props }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('valueType') && props.valueType == 'js') eleProps.defaultValue = this.returnEvalJsCode(props.valueJs);
        else eleProps.defaultValue = props.value ? props.value : '';

        if (props.hasOwnProperty('placeholder') && props.placeholder !== undefined) eleProps.placeholder = props.placeholder;


        var events = props.hasOwnProperty("events") ? props.events : [];
        //if(props.hasOwnProperty('value'))eleProps.value = props.value;

        output = (
            <InputNumber
                style={style}
                key={treeId}
                ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            />
        );
        return output;
    }

    getAButtonNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('buttonType')) eleProps.type = props.buttonType ? props.buttonType : 'default';



        if (props.hasOwnProperty('buttonIconType') && props.buttonIconType == 'js') eleProps.icon = this.returnEvalJsCode(props.buttonIconJs);
        else if (props.hasOwnProperty('buttonIcon') && props.buttonIcon) {
            eleProps.icon = this.outputTreeArr(this.$refs, this.state.gData, props.buttonIcon);
        }

        if (props.hasOwnProperty('size')) eleProps.size = props.size ? props.size : 'middle';
        if (props.hasOwnProperty('block')) eleProps.block = props.block;
        if (props.hasOwnProperty('ghost')) eleProps.ghost = props.ghost;

        //console.log('button.children',child);

        let value = '';
        if (props.hasOwnProperty('valueType') && props.valueType == 'js') value = this.returnEvalJsCode(props.valueJs);
        else if (props.hasOwnProperty('value') && props.value !== undefined) value = props.value;
        else if (typeof child === 'string') value = child;
        else if (typeof child === 'function') value = child();



        if (props.hasOwnProperty('disabledType') && props.disabledType == 'js') eleProps.disabled = this.returnEvalJsCode(props.disabledJs);
        else if (props.hasOwnProperty('disabled') && props.disabled !== undefined) eleProps.disabled = props.disabled;

        if (props.hasOwnProperty('type') && props.type !== undefined) eleProps.type = props.type;
        if (props.hasOwnProperty('htmlType') && props.htmlType !== undefined) eleProps.htmlType = props.htmlType;

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Button
                style={style}
                key={treeId}
                ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            >{value}</Button>
        );
        return output;
    }

    getARowNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleStyle = {};
        //if(style.hasOwnProperty('visibility'))style.visibility = style.visibility;


        /* if(style.width == undefined){
            if(props.hasOwnProperty('widthType') && props.widthType == 'js')style.width = this.returnEvalJsCode(props.widthJs);
            else style.width = props.width;
        }
        
        if(style.height == undefined){
            if(props.hasOwnProperty('heightType') && props.heightType == 'js')style.height = this.returnEvalJsCode(props.heightJs);
            else style.height = props.height;
        }
 */
        if (props.hasOwnProperty('gutterV') && props.gutterV !== '') style.rowGap = Number(props.gutterV) + 'px';


        let eleProps = {};
        if (props.hasOwnProperty('gutter') && props.gutter !== '') eleProps.gutter = props.gutter;


        if (props.hasOwnProperty('align')) eleProps.align = props.align;
        if (props.hasOwnProperty('justify')) eleProps.justify = props.justify;
        if (props.hasOwnProperty('wrap')) eleProps.wrap = props.wrap;


        if (props.hasOwnProperty('innerStyleJs') && props.innerStyleJs !== undefined) {
            style = {
                ...style,
                ...this.returnEvalJsCode(props.innerStyleJs)
            }
        }

        var events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <CompBase
                key={treeId}
                treeId={treeId}
                {...this.eventsHandler($refs, events, true)}
            >
                <Row
                    className={this.getClassName({ $refs, treeId, props })}
                    style={style}
                    ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                    {...this.eventsHandler($refs, events)}
                >
                    {child}
                </Row>
            </CompBase>
        );

        return output;
    }

    getAColNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('flexType') && props.flexType == 'js') eleProps.flex = this.returnEvalJsCode(props.flexJs);
        else if (props.hasOwnProperty('flex')) eleProps.flex = props.flex ? props.flex : '';

        if (props.hasOwnProperty('spanType') && props.spanType == 'js') eleProps.span = this.returnEvalJsCode(props.spanJs);
        else if (props.hasOwnProperty('span') && props.span !== undefined) eleProps.span = props.span;

        if (props.hasOwnProperty('innerStyleJs') && props.innerStyleJs !== undefined) {
            style = {
                ...style,
                ...this.returnEvalJsCode(props.innerStyleJs)
            }
        }

        //if(props.hasOwnProperty('buttonType'))eleProps.type = props.buttonType?props.buttonType:'default';
        var events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <React.Fragment key={treeId} >
                <Col
                    className={this.getClassName({ $refs, treeId, props })}
                    style={style}
                    ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                    {...this.eventsHandler($refs, events)}
                >
                    {child}
                </Col>
            </React.Fragment>
        );
        return output;
    }

    getARowProps(eleProps) {
        if (eleProps.hasOwnProperty('gutterV')) {
            eleProps = filterObjectByProperty(eleProps, 'gutterV');
        }

        return eleProps;
    }

    getAButtonProps(eleProps) {
        if (eleProps.hasOwnProperty('buttonType')) {
            const buttonType = eleProps.buttonType;
            eleProps = filterObjectByProperty(eleProps, 'buttonType');
            eleProps.type = buttonType;
        }

        if (eleProps.hasOwnProperty('buttonIcon')) {
            eleProps = filterObjectByProperty(eleProps, 'buttonIcon');
        }

        return eleProps;
    }

    getAImageProps(eleProps) {
        if (eleProps.hasOwnProperty('src')) {
            //console.log('getAImageProps',eleProps);
            let src = eleProps.src;
            const hasHttpOrHttps = function (url = '') {
                return url.includes('http://') || url.includes('https://');
            }

            src = hasHttpOrHttps(src) ? src : OSS_HOST + src;
            //src = ['http', 'https'].indexOf(src) > -1 ? src : OSS_HOST + src;
            eleProps.src = src;
        }

        if (!eleProps.hasOwnProperty('preview')) eleProps.preview = false;

        if (!eleProps.hasOwnProperty('placeholder')) eleProps.placeholder = false;

        return eleProps;
    }

    getImgProps(eleProps) {

        console.log('getImgProps', eleProps)

        if (eleProps.hasOwnProperty('src')) {
            let src = eleProps.src;
            const hasHttpOrHttps = function (url) {
                return url.includes('http://') || url.includes('https://');
            }

            src = hasHttpOrHttps(src) ? src : OSS_HOST + src;
            // src = ['http', 'https'].indexOf(src) > -1 ? src : OSS_HOST + src;
            eleProps.src = src;
        }

        return eleProps;
    }

    getVideoProps(eleProps) {
        if (eleProps.hasOwnProperty('src')) {
            let src = eleProps.src;
            const hasHttpOrHttps = function (url) {
                return url.includes('http://') || url.includes('https://');
            }

            src = hasHttpOrHttps(src) ? src : OSS_HOST + src;
            eleProps.src = src;
        }

        return eleProps;
    }

    getDivNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};

        if (props.hasOwnProperty('idType') && props.idType == 'js') eleProps.id = this.returnEvalJsCode(props.idJs);
        else if (props.hasOwnProperty('id') && props.id !== undefined) eleProps.id = props.id;

        if (props.hasOwnProperty('innerStyleJs') && props.innerStyleJs !== undefined) {
            style = {
                ...style,
                ...this.returnEvalJsCode(props.innerStyleJs)
            }
        }

        let events = props.hasOwnProperty("events") ? props.events : [];
        output = (
            <React.Fragment key={treeId} >
                <div
                    className={this.getClassName({ $refs, treeId, props })}
                    style={style}
                    //ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                    {...this.eventsHandler($refs, events)}
                >
                    {child}
                </div>
            </React.Fragment>
        );
        return output;
    }

    getSpanNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};

        if (props.hasOwnProperty('idType') && props.idType == 'js') eleProps.id = this.returnEvalJsCode(props.idJs);
        else if (props.hasOwnProperty('id') && props.id !== undefined) eleProps.id = props.id;

        let content = '';
        if (props.hasOwnProperty('contentType') && props.contentType == 'js') content = this.returnEvalJsCode(props.contentJs);
        else if (props.hasOwnProperty('content') && props.content !== undefined) content = props.content;
        else if (typeof child === 'string') content = child;

        if (props.hasOwnProperty('innerStyleJs') && props.innerStyleJs !== undefined) {
            style = {
                ...style,
                ...this.returnEvalJsCode(props.innerStyleJs)
            }
        }

        let events = props.hasOwnProperty("events") ? props.events : [];
        output = (
            <React.Fragment key={treeId} >
                <span
                    className={this.getClassName({ $refs, treeId, props })}
                    style={style}
                    //ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                    {...this.eventsHandler($refs, events)}
                >
                    {content}
                </span>
            </React.Fragment>
        );
        return output;
    }

    getH1Node({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};

        if (props.hasOwnProperty('idType') && props.idType == 'js') eleProps.id = this.returnEvalJsCode(props.idJs);
        else if (props.hasOwnProperty('id') && props.id !== undefined) eleProps.id = props.id;

        if (props.hasOwnProperty('innerStyleJs') && props.innerStyleJs !== undefined) {
            style = {
                ...style,
                ...this.returnEvalJsCode(props.innerStyleJs)
            }
        }

        let events = props.hasOwnProperty("events") ? props.events : [];
        output = (
            <React.Fragment key={treeId} >
                <h1
                    className={this.getClassName({ $refs, treeId, props })}
                    style={style}
                    //ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                    {...this.eventsHandler($refs, events)}
                >
                    {child}
                </h1>
            </React.Fragment>
        );
        return output;
    }

    getASpaceNode({ $refs, treeId, style, props, child }) {

        let output = '';

        style = style || {};
        style.width = '100%';

        let eleProps = {};

        if (props.hasOwnProperty('splitType') && props.splitType == 'js') eleProps.split = this.returnEvalJsCode(props.splitJs);
        else if (props.hasOwnProperty('split') && props.split) eleProps.split = props.split ? props.split : '';

        if (props.hasOwnProperty('direction')) eleProps.direction = props.direction;
        if (props.hasOwnProperty('align')) eleProps.align = props.align;
        if (props.hasOwnProperty('sizeSelect') && props.sizeSelect) {
            if (['small', 'middle', 'large'].indexOf(props.sizeSelect) > -1)
                eleProps.size = props.sizeSelect;
            else
                eleProps.size = Number(props.size);
        }

        let events = props.hasOwnProperty("events") ? props.events : [];

        //console.log('getADropdownNode.child',child)
        output = (
            <Space
                style={style}
                key={treeId}
                //ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            >
                {typeof child === 'function' && child()}
            </Space>
        );
        return output;
    }

    getALayoutNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        //if(props.hasOwnProperty('buttonType'))eleProps.type = props.buttonType?props.buttonType:'default';


        if (props.hasOwnProperty('innerStyleJs') && props.innerStyleJs !== undefined) {
            style = {
                ...style,
                ...this.returnEvalJsCode(props.innerStyleJs)
            }
        }

        output = (
            <React.Fragment key={treeId} >
                <Layout
                    className={this.getClassName({ $refs, treeId, props })}
                    style={style}
                    ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                >
                    {child}
                </Layout>
            </React.Fragment>
        );
        return output;
    }

    getAHeaderNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        //if(props.hasOwnProperty('buttonType'))eleProps.type = props.buttonType?props.buttonType:'default';


        if (props.hasOwnProperty('innerStyleJs') && props.innerStyleJs !== undefined) {
            style = {
                ...style,
                ...this.returnEvalJsCode(props.innerStyleJs)
            }
        }

        output = (
            <React.Fragment key={treeId} >
                <Header
                    className={this.getClassName({ $refs, treeId, props })}
                    style={style}
                    ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                >
                    {child}
                </Header>
            </React.Fragment>
        );
        return output;
    }

    getASiderNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('theme')) eleProps.theme = props.theme;

        if (props.hasOwnProperty('collapsedType') && props.collapsedType === 'js') eleProps.collapsed = this.returnEvalJsCode(props.collapsedJs);
        else if (props.hasOwnProperty('collapsed') && props.collapsed !== undefined) eleProps.collapsed = props.collapsed;

        if (props.hasOwnProperty('collapsible') && props.collapsible !== undefined) eleProps.collapsible = props.collapsible;
        if (props.hasOwnProperty('defaultCollapsed') && props.defaultCollapsed !== undefined) eleProps.defaultCollapsed = props.defaultCollapsed;
        if (props.hasOwnProperty('collapsedWidth') && props.collapsedWidth !== undefined) eleProps.collapsedWidth = props.collapsedWidth;


        // if (props.hasOwnProperty('innerStyleJs') && props.innerStyleJs !== undefined) {
        //     style = {
        //         ...style,
        //         ...this.returnEvalJsCode(props.innerStyleJs)
        //     }
        // }

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Sider key={treeId}
                className={this.getClassName({ $refs, treeId, props })}
                style={style}
                ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            >
                {child}
            </Sider>
        );
        return output;
    }

    getAContentNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        //if(props.hasOwnProperty('buttonType'))eleProps.type = props.buttonType?props.buttonType:'default';


        // if (props.hasOwnProperty('innerStyleJs') && props.innerStyleJs !== undefined) {
        //     style = {
        //         ...style,
        //         ...this.returnEvalJsCode(props.innerStyleJs)
        //     }
        // }

        output = (
            <React.Fragment key={treeId} >
                <Content
                    className={this.getClassName({ $refs, treeId, props })}
                    style={style}
                    ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                >
                    {child}
                </Content>
            </React.Fragment>
        );
        return output;
    }

    getAFooterNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        //if(props.hasOwnProperty('buttonType'))eleProps.type = props.buttonType?props.buttonType:'default';


        if (props.hasOwnProperty('innerStyleJs') && props.innerStyleJs !== undefined) {
            style = {
                ...style,
                ...this.returnEvalJsCode(props.innerStyleJs)
            }
        }

        output = (
            <React.Fragment key={treeId} >
                <Footer
                    className={this.getClassName({ $refs, treeId, props })}
                    style={style}
                    ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                >
                    {child}
                </Footer>
            </React.Fragment>
        );
        return output;
    }

    getAMenuNode({ $refs, treeId, style, props }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('selectedKeys')) eleProps.selectedKeys = props.selectedKeys ? props.selectedKeys : [];

        if (props.hasOwnProperty('itemsJs') && props.itemsJs) eleProps.items = this.returnEvalJsCode(props.itemsJs);
        else if (props.hasOwnProperty('items')) eleProps.items = props.items ? props.items : [];

        if (props.hasOwnProperty('mode')) eleProps.mode = props.mode ? props.mode : 'horizontal';
        if (props.hasOwnProperty('theme')) eleProps.theme = props.theme ? props.theme : 'light';

        var events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <React.Fragment key={treeId} >
                <AMenu
                    className={this.getClassName({ $refs, treeId, props })}
                    style={style}
                    ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                    {...this.eventsHandler($refs, events, true)}
                    {...this.eventsHandler($refs, events)}
                />
            </React.Fragment>
        );
        return output;
    }

    getACardNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};

        if (props.hasOwnProperty('titleType') && props.titleType == 'js') eleProps.title = this.returnEvalJsCode(props.titleJs);
        else if (props.hasOwnProperty('title') && props.title) eleProps.title = props.title ? props.title : '';

        if (props.hasOwnProperty('bordered')) eleProps.bordered = props.bordered;
        if (props.hasOwnProperty('size')) eleProps.size = props.size ? props.size : 'default';
        // if(props.hasOwnProperty('items'))eleProps.items = props.items?props.items:[];
        // if(props.hasOwnProperty('mode'))eleProps.mode = props.mode?props.mode:'horizontal';
        // if(props.hasOwnProperty('theme'))eleProps.theme = props.theme?props.theme:'light';


        if (props.hasOwnProperty('extraType') && props.extraType == 'js') eleProps.extra = this.returnEvalJsCode(props.extraJs);
        else if (props.hasOwnProperty('extra') && this.state.gData.findIndex((item => item.id == props.extra)) > -1) {
            eleProps.extra = this.outputTreeArr(this.$refs, this.state.gData, props.extra);
        }
        else if (props.hasOwnProperty('extra') && props.extra) eleProps.extra = props.extra ? props.extra : '';

        if (props.hasOwnProperty('actionsType') && props.actionsType == 'js') eleProps.actions = this.returnEvalJsCode(props.actionsJs);
        //else if(props.hasOwnProperty('actions') && props.actions) eleProps.actions = props.actions?props.actions:'';

        if (props.hasOwnProperty('bodyStyleJs') && props.bodyStyleJs !== undefined) eleProps.bodyStyle = this.returnEvalJsCode(props.bodyStyleJs);


        if (props.hasOwnProperty('innerStyleJs') && props.innerStyleJs !== undefined) {
            style = {
                ...style,
                ...this.returnEvalJsCode(props.innerStyleJs)
            }
        }

        output = (
            <React.Fragment key={treeId} >
                <Card
                    className={this.getClassName({ $refs, treeId, props })}
                    style={style}
                    ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                >
                    {child}
                </Card>
            </React.Fragment>
        );
        return output;
    }

    getASelectNode({ $refs, treeId, style, props }) {

        let output = '';

        /* let eleStyle = {};
        if(style.hasOwnProperty('visibility'))eleStyle.visibility = style.visibility;
        
        if(props.hasOwnProperty('widthType') && props.widthType == 'js')eleStyle.width = this.returnEvalJsCode(props.widthJs);
        else eleStyle.width = props.width; */

        let eleProps = {};
        if (props.hasOwnProperty('optionsJs')) eleProps.options = this.returnEvalJsCode(props.optionsJs);
        else if (props.hasOwnProperty('options') && props.options !== undefined) eleProps.options = props.options;

        if (props.hasOwnProperty('placeholder') && props.placeholder !== undefined) eleProps.placeholder = props.placeholder;
        if (props.hasOwnProperty('allowClear') && props.allowClear !== undefined) eleProps.allowClear = props.allowClear;

        //eleProps.checked = props.checked?props.checked:true;

        if (props.hasOwnProperty('valueType') && props.valueType == 'js') eleProps.value = this.returnEvalJsCode(props.valueJs);
        else eleProps.value = props.value ? props.value : '';

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Select
                style={style}
                key={treeId}
                ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            />
        );
        return output;
    }

    getADropdownNode({ $refs, treeId, style, props, child }) {

        let output = '';

        var events = props.hasOwnProperty("events") ? props.events : [];

        let eleProps = {};

        if (props.hasOwnProperty('menu') && props.menu !== undefined) eleProps.menu = props.menu;
        eleProps.menu = {
            ...eleProps.menu,
            ...this.eventsHandler($refs, events)
        };
        if (props.hasOwnProperty('itemsType') && props.itemsType == 'js') eleProps.menu.items = this.returnEvalJsCode(props.itemsJs);

        if (props.hasOwnProperty('trigger') && props.trigger !== undefined) eleProps.trigger = props.trigger;
        if (props.hasOwnProperty('placement') && props.placement !== undefined) eleProps.placement = props.placement;
        if (props.hasOwnProperty('arrow') && props.arrow !== undefined) eleProps.arrow = props.arrow;

        //console.log('getADropdownNode', eleProps);

        output = (
            <Dropdown
                style={style}
                key={treeId}
                //ref={ref => $refs[treeId] = ref}
                {...eleProps}

            >
                <span>
                    {typeof child === 'function' && child()}
                </span>
            </Dropdown>
        );
        return output;

    }

    getAIconFontNode({ $refs, treeId, style, props }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('type') && props.type !== undefined) eleProps.type = props.type;
        if (props.hasOwnProperty('iconType') && props.iconType !== undefined) eleProps.type = props.iconType ? props.iconType : '';

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <IconFont
                style={style}
                key={treeId}
                //ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            />
        );
        return output;
    }

    getATableNode({ $refs, treeId, style, props }) {

        let output = '';
        let eleProps = {};

        // let stateVars = {};
        // for (const key in this.state) {
        //     if (key.indexOf('variable_') > -1) stateVars[key] = this.state[key];
        // }

        // let fEventProps = {};
        // for (const key in this.props) {
        //     if (key.indexOf('fEvent_') > -1) fEventProps[key] = this.props[key];
        // }

        //console.log('getATableNode.props',this.props)

        // let dataSource = this.returnEvalJsCode(props.dataSource);

        // dataSource = dataSource?dataSource:[];

        if (props.hasOwnProperty('dataSourceJs') && props.dataSourceJs !== undefined) eleProps.dataSource = this.returnEvalJsCode(props.dataSourceJs);
        else if (props.hasOwnProperty('dataSource') && props.dataSource !== undefined) eleProps.dataSource = props.dataSource;

        if (props.hasOwnProperty('columnsJs') && props.columnsJs !== undefined) eleProps.columns = this.returnEvalJsCode(props.columnsJs);
        else if (props.hasOwnProperty('columns') && props.columns !== undefined) eleProps.columns = props.columns;


        // let columns = [];

        // this.returnEvalJsCode(props.columns);

        // columns = columns?columns:[];

        // columns.map(item => {
        //     var dataIndex = item.dataIndex;
        //     item.render = (text, record, index)=>{
        //         var value = {};
        //         value[treeId] = {
        //             dataIndex, text, record, index
        //         };
        //         return (
        //             <TableItemContext.Provider value={value}>
        //                 {/* <TableComponent treeId={treeId} 
        //                     gData={this.state.gData}
        //                     refs={this.$refs}
        //                     {...stateVars}
        //                     {...fEventProps}
        //                 /> */}
        //                 <TableComponent2 treeId={treeId} 
        //                     _this={this}
        //                 />
        //             </TableItemContext.Provider>
        //         )

        //     }
        //     return item;
        // })


        var events = props.hasOwnProperty("events") ? props.events : [];
        events = this.eventsHandler($refs, events)



        if (props.hasOwnProperty('size')) eleProps.size = props.size ? props.size : 'large';
        // if(props.hasOwnProperty('items'))eleProps.items = props.items?props.items:[];
        // if(props.hasOwnProperty('mode'))eleProps.mode = props.mode?props.mode:'horizontal';
        // if(props.hasOwnProperty('theme'))eleProps.theme = props.theme?props.theme:'light';

        if (props.hasOwnProperty('loadingType')) {
            let loading = props.loading;
            if (props.loadingType == 'js') loading = this.returnEvalJsCode(props.loadingJs);
            eleProps.loading = loading;
        }

        let rowKey = '_id';
        if (props.hasOwnProperty('rowKeyType')) {
            if (props.rowKeyType == 'js') rowKey = this.returnEvalJsCode(props.rowKeyJs);
            else rowKey = props.rowKey;
        } else if (props.hasOwnProperty('rowKey')) {
            rowKey = props.rowKey;
        }
        eleProps.rowKey = rowKey;

        if (props.hasOwnProperty('selectable') && props.selectable) {
            let selectedRowKeys = this.returnEvalJsCode(props.selectedRowKeys);
            selectedRowKeys = selectedRowKeys ? selectedRowKeys : [];

            eleProps.rowSelection = {
                selectedRowKeys,
                // onChange:(newSelectedRowKeys) => {
                //     console.log('selectedRowKeys changed: ', newSelectedRowKeys);
                // }
            };

            if (events.hasOwnProperty('onSelectChange'))
                eleProps.rowSelection.onChange = events.onSelectChange;

        }
        /* 
                let pagination = {}
        
                if(props.hasOwnProperty('pageCurrentType')){
                    let pageCurrent = props.pageCurrent;
                    if(props.pageCurrentType == 'js')pageCurrent = this.returnEvalJsCode(props.pageCurrentJs);
                    pagination.current = pageCurrent;
                }
        
                if(props.hasOwnProperty('pageTotalType')){
                    let pageTotal = props.pageTotal;
                    if(props.pageTotalType == 'js')pageTotal = this.returnEvalJsCode(props.pageTotalJs);
                    pagination.total = pageTotal;
                }
                
                if(props.hasOwnProperty('pageSizeType')){
                    let pageSize = props.pageSize;
                    if(props.pageSizeType == 'js')pageSize = this.returnEvalJsCode(props.pageSizeJs);
                    pagination.pageSize = pageSize;
                } */

        let pagination = false;
        if (props.hasOwnProperty('showPage') && props.showPage) {
            pagination = {};

            if (props.hasOwnProperty('pageCurrentType')) {
                let pageCurrent = props.pageCurrent;
                if (props.pageCurrentType == 'js') pageCurrent = this.returnEvalJsCode(props.pageCurrentJs);
                pagination.current = pageCurrent;
            }

            if (props.hasOwnProperty('pageTotalType')) {
                let pageTotal = props.pageTotal;
                if (props.pageTotalType == 'js') pageTotal = this.returnEvalJsCode(props.pageTotalJs);
                pagination.total = pageTotal;
            } else if (props.hasOwnProperty('pageTotal')) {
                pagination.total = props.pageTotal;
            }

            if (props.hasOwnProperty('pageSizeType')) {
                let pageSize = props.pageSize;
                if (props.pageSizeType == 'js') pageSize = this.returnEvalJsCode(props.pageSizeJs);
                pagination.pageSize = pageSize;
            } else if (props.hasOwnProperty('pageSize')) {
                pagination.pageSize = props.pageSize;
            }

            if (props.hasOwnProperty('pagePositionType')) {
                let pagePosition = props.pagePosition;
                if (props.pagePositionType == 'js') pagePosition = this.returnEvalJsCode(props.pagePositionJs);
                pagination.position = pagePosition;
            } else if (props.hasOwnProperty('pagePosition')) {
                pagination.position = props.pagePosition;
            }

        }
        eleProps.pagination = pagination;

        let eventsObj = {};
        if (events.hasOwnProperty('onChange'))
            eventsObj.onChange = events.onChange;

        output = (
            <React.Fragment key={treeId} >
                <Table
                    key={treeId}
                    className={this.getClassName({ $refs, treeId, props })}
                    style={style}
                    //ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                    //dataSource={dataSource}
                    //columns={columns}
                    //pagination={pagination}
                    {...eventsObj}
                />
            </React.Fragment>
        );
        return output;
    }

    getARadioNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};

        //eleProps.checked = props.checked?props.checked:true;

        if (props.hasOwnProperty('valueType') && props.valueType == 'js') eleProps.value = this.returnEvalJsCode(props.valueJs);
        else eleProps.value = props.value ? props.value : '';

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Radio
                style={style}
                key={treeId}
                ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            >
                {child}
            </Radio>
        );
        return output;
    }

    getARadioGroupNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('optionsJs')) eleProps.options = this.returnEvalJsCode(props.optionsJs);
        else if (props.hasOwnProperty('options') && props.options !== undefined) eleProps.options = props.options;

        //eleProps.checked = props.checked?props.checked:true;

        if (props.hasOwnProperty('valueType') && props.valueType == 'js') eleProps.value = this.returnEvalJsCode(props.valueJs);
        else eleProps.value = props.value ? props.value : '';

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Radio.Group
                style={style}
                key={treeId}
                ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            >
                {child}
            </Radio.Group>
        );
        return output;
    }

    getACheckBoxNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};

        //eleProps.checked = props.checked?props.checked:true;

        if (props.hasOwnProperty('valueType') && props.valueType == 'js') eleProps.value = this.returnEvalJsCode(props.valueJs);
        else eleProps.value = props.value ? props.value : '';

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Checkbox
                style={style}
                key={treeId}
                ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            >
                {child}
            </Checkbox>
        );
        return output;
    }

    getACheckBoxGroupNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('optionsJs')) eleProps.options = this.returnEvalJsCode(props.optionsJs);
        else if (props.hasOwnProperty('options') && props.options !== undefined) eleProps.options = props.options;

        //eleProps.checked = props.checked?props.checked:true;

        if (props.hasOwnProperty('valueType') && props.valueType == 'js') eleProps.value = this.returnEvalJsCode(props.valueJs);
        else eleProps.value = props.value ? props.value : '';

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Checkbox.Group
                style={style}
                key={treeId}
                ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            >
                {child}
            </Checkbox.Group>
        );
        return output;
    }

    getADatePickerNode({ $refs, treeId, style, props }) {

        let output = '';

        let eleProps = {};

        if (props.hasOwnProperty('placeholder') && props.placeholder !== undefined) eleProps.placeholder = props.placeholder;
        if (props.hasOwnProperty('allowClear') && props.allowClear !== undefined) eleProps.allowClear = props.allowClear;
        if (props.hasOwnProperty('picker') && props.picker !== undefined) eleProps.picker = props.picker;

        if (props.hasOwnProperty('showTimeType') && props.showTimeType == 'js') eleProps.showTime = this.returnEvalJsCode(props.showTimeJs);
        else if (props.hasOwnProperty('showTime') && props.showTime !== undefined) eleProps.showTime = props.showTime;


        if (props.hasOwnProperty('valueType') && props.valueType == 'js') eleProps.value = this.returnEvalJsCode(props.valueJs);
        else if (props.hasOwnProperty('value') && props.value !== undefined) eleProps.value = props.value;

        let events = props.hasOwnProperty("events") ? props.events : [];

        if (!props.isRange) {
            output = (
                <DatePicker
                    style={style}
                    key={treeId}
                    //ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                    {...this.eventsHandler($refs, events)}
                />
            );
        } else {
            output = (
                <DatePicker.RangePicker
                    style={style}
                    key={treeId}
                    //ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                    {...this.eventsHandler($refs, events)}
                />
            );

        }
        return output;
    }

    getATimePickerNode({ $refs, treeId, style, props }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('placeholder') && props.placeholder !== undefined) eleProps.placeholder = props.placeholder;
        if (props.hasOwnProperty('allowClear') && props.allowClear !== undefined) eleProps.allowClear = props.allowClear;

        if (props.hasOwnProperty('valueType') && props.valueType == 'js') eleProps.value = this.returnEvalJsCode(props.valueJs);
        else if (props.hasOwnProperty('value') && props.value !== undefined) eleProps.value = props.value;

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <TimePicker
                style={style}
                key={treeId}
                //ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            />
        );
        return output;
    }

    getAUploadNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};
        // if(props.hasOwnProperty('placeholder') && props.placeholder !== undefined)eleProps.placeholder = props.placeholder;	
        // if(props.hasOwnProperty('allowClear') && props.allowClear !== undefined)eleProps.allowClear = props.allowClear;

        if (props.hasOwnProperty('maxCountType') && props.maxCountType == 'js') eleProps.maxCount = this.returnEvalJsCode(props.maxCountJs);
        else if (props.hasOwnProperty('maxCount') && props.maxCount !== undefined) eleProps.maxCount = props.maxCount;


        if (props.hasOwnProperty('multipleType') && props.multipleType == 'js') eleProps.multiple = this.returnEvalJsCode(props.multipleJs);
        else if (props.hasOwnProperty('multiple') && props.multiple !== undefined) eleProps.multiple = props.multiple;

        if (props.hasOwnProperty('acceptType') && props.acceptType == 'js') eleProps.accept = this.returnEvalJsCode(props.acceptJs);
        else if (props.hasOwnProperty('accept') && props.accept !== undefined) eleProps.accept = props.accept;

        if (props.hasOwnProperty('listTypeType') && props.listTypeType == 'js') eleProps.listType = this.returnEvalJsCode(props.listTypeJs);
        else if (props.hasOwnProperty('listType') && props.listType !== undefined) eleProps.listType = props.listType;

        if (props.hasOwnProperty('fileListJs') && props.fileListJs !== undefined) eleProps.fileList = this.returnEvalJsCode(props.fileListJs);

        if (props.hasOwnProperty('disabledType') && props.disabledType == 'js') eleProps.disabled = this.returnEvalJsCode(props.disabledJs);
        else if (props.hasOwnProperty('disabled') && props.disabled !== undefined) eleProps.disabled = props.disabled;

        if (props.hasOwnProperty('showUploadListType') && props.showUploadListType == 'js') eleProps.showUploadList = this.returnEvalJsCode(props.showUploadListJs);
        else if (props.hasOwnProperty('showUploadList') && props.showUploadList !== undefined) eleProps.showUploadList = props.showUploadList;

        eleProps.beforeUpload = (file) => {
            //console.log('upload.自定义上传', file)
            return false
        };
        /* eleProps.customRequest = ({file}) => {
            console.log('upload.自定义上传', file)
        }; */

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Upload
                style={style}
                key={treeId}
                //ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            >
                {typeof child === 'function' && child()}
            </Upload>
        );
        return output;
    }

    getATreeNode({ $refs, treeId, style, props }) {

        let output = '';

        // let treeData = this.returnEvalJsCode(props.dataSource);
        // treeData = treeData?treeData:[];

        let eleProps = {};
        //eleProps.treeData = treeData;

        if (props.hasOwnProperty('treeDataType') && props.treeDataType == 'js') eleProps.treeData = this.returnEvalJsCode(props.treeDataJs);
        if (props.hasOwnProperty('treeData') && props.treeData !== undefined) eleProps.treeData = props.treeData;

        if (props.hasOwnProperty('checkedKeys')) eleProps.checkedKeys = this.returnEvalJsCode(props.checkedKeys);
        if (props.hasOwnProperty('loadedKeys')) eleProps.loadedKeys = this.returnEvalJsCode(props.loadedKeys);
        eleProps.selectable = props.selectable ? props.selectable : false;
        if (props.hasOwnProperty('checkable')) eleProps.checkable = props.checkable ? props.checkable : false;
        if (props.hasOwnProperty('checkStrictly')) eleProps.checkStrictly = props.checkStrictly ? props.checkStrictly : false;
        if (props.hasOwnProperty('heightType') && props.heightType == 'js') eleProps.height = Number(this.returnEvalJsCode(props.heightJs));
        else if (props.hasOwnProperty('height')) eleProps.height = props.height ? Number(props.height) : '';


        if (props.hasOwnProperty('blockNode')) eleProps.blockNode = props.blockNode ? props.blockNode : false;
        // if(props.hasOwnProperty('titleNode')){
        //     eleProps.titleRender = (nodeData)=>{
        //         //console.log('aTree.titleRender',nodeData);
        //         nodeData.text = nodeData.title;
        //         return (
        //             <TreeTitleContext.Provider value={nodeData}>
        //                 <TreeTitleComponent treeId={props.titleNode} 
        //                     _this={this}
        //                 />
        //             </TreeTitleContext.Provider>
        //         );
        //     }
        // }

        let events = props.hasOwnProperty("events") ? props.events : [];
        events = this.eventsHandler($refs, events)

        let eventsObj = {};
        if (events.hasOwnProperty('loadData'))
            eventsObj.loadData = ({ key, children }) => new Promise((resolve) => {
                events.loadData({ key, resolve });
                //resolve(undefined);
            });
        if (events.hasOwnProperty('onSelect'))
            eventsObj.onSelect = events.onSelect;
        if (events.hasOwnProperty('onCheck'))
            eventsObj.onCheck = events.onCheck;

        output = (
            <Tree
                style={style}
                key={treeId}
                //ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...eventsObj}
            />
        );
        return output;
    }

    getAStatisticNode({ $refs, treeId, style, props }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('valueType') && props.valueType == 'js') eleProps.value = this.returnEvalJsCode(props.valueJs);
        else eleProps.value = props.value ? props.value : '';

        if (props.hasOwnProperty('titleType') && props.titleType == 'js') eleProps.title = this.returnEvalJsCode(props.titleJs);
        else eleProps.title = props.title ? props.title : '';

        if (props.hasOwnProperty('formatterType') && props.formatterType == 'js') eleProps.formatter = this.returnEvalJsCode(props.formatterJs);
        else eleProps.formatter = props.formatter ? props.formatter : '';

        if (props.hasOwnProperty('precisionType') && props.precisionType == 'js') eleProps.precision = this.returnEvalJsCode(props.precisionJs);
        else eleProps.precision = props.precision ? props.precision : '';



        var events = props.hasOwnProperty("events") ? props.events : [];
        //if(props.hasOwnProperty('value'))eleProps.value = props.value;

        output = (
            <Statistic
                style={style}
                key={treeId}
                //ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            />
        );
        return output;
    }

    getACascaderNode({ $refs, treeId, style, props }) {

        let output = '';

        let eleStyle = {};

        let eleProps = {};
        if (props.hasOwnProperty('optionsJs')) eleProps.options = this.returnEvalJsCode(props.optionsJs);
        eleProps.placeholder = props.placeholder ? props.placeholder : '请选择';
        eleProps.allowClear = props.allowClear ? props.allowClear : false;

        if (props.hasOwnProperty('fieldNamesJs')) eleProps.fieldNames = this.returnEvalJsCode(props.fieldNamesJs);

        //eleProps.checked = props.checked?props.checked:true;

        if (props.hasOwnProperty('valueType') && props.valueType == 'js') eleProps.value = this.returnEvalJsCode(props.valueJs);
        else if (props.hasOwnProperty('value') && props.value !== undefined) eleProps.value = props.value;

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Cascader
                style={style}
                key={treeId}
                ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            />
        );
        return output;
    }

    getACalendarNode({ $refs, treeId, style, props }) {
        let output = '';
        let eleProps = {};

        if (props.hasOwnProperty('dateCellRenderType') && props.dateCellRenderType == 'js') eleProps.dateCellRender = this.returnEvalJsCode(props.dateCellRenderJs);
        else if (props.hasOwnProperty('dateCellRender')) eleProps.dateCellRender = props.dateCellRender;

        let events = props.hasOwnProperty("events") ? props.events : [];
        output = (
            <Calendar
                key={treeId}
                style={style}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            />

        );
        return output;
    }

    getAConfigNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let eleProps = {};

        try {

            if (props.hasOwnProperty('theme')) eleProps.theme = props.theme ? this.returnEvalJsCode(props.theme) : {};
            if (props.hasOwnProperty('componentSize')) eleProps.componentSize = props.componentSize;

            let isDark = false;
            if (props.hasOwnProperty('isDarkType') && props.isDarkType == 'js') isDark = this.returnEvalJsCode(props.isDarkJs);
            else if (props.hasOwnProperty('isDark')) isDark = props.isDark ? props.isDark : '';

            if (isDark) {
                if (!eleProps.theme || Object.keys(eleProps.theme).length === 0) eleProps.theme = {};
                eleProps.theme.algorithm = [darkAlgorithm]
            }


            output = (
                <ConfigProvider key={treeId}
                    //className={this.getClassName({$refs,treeId,props})}
                    //style={style} 
                    //ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                >
                    <App>
                        {typeof child === 'function' && child()}
                    </App>

                </ConfigProvider>
            );
        } catch (error) {
            console.log('getAConfigNode', error)
            output = (
                <React.Fragment key={treeId}>
                    {typeof child === 'function' && child()}
                </React.Fragment>
            );
        }
        return output;
    }

    getATabsNode({ $refs, treeId, style, props }) {

        let output = '';

        let eleProps = {};
        if (props.hasOwnProperty('itemsJs') && props.itemsJs !== undefined) eleProps.items = this.returnEvalJsCode(props.itemsJs);
        else if (props.hasOwnProperty('items') && props.items !== undefined) eleProps.items = props.items;

        if (props.hasOwnProperty('tabBarExtraContentJs') && props.tabBarExtraContentJs !== undefined) eleProps.tabBarExtraContent = this.returnEvalJsCode(props.tabBarExtraContentJs);
        else if (props.hasOwnProperty('tabBarExtraContent') && props.tabBarExtraContent !== undefined) eleProps.tabBarExtraContent = props.tabBarExtraContent;

        if (props.hasOwnProperty('activeKeyType') && props.activeKeyType == 'js') eleProps.activeKey = this.returnEvalJsCode(props.activeKeyJs);

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Tabs
                style={style}
                key={treeId}
                //ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            />
        );
        return output;
    }

    getASliderNode({ $refs, treeId, style, props }) {
        let output = '';
        let eleProps = {};

        if (style.width === undefined) style.width = '300px';

        if (props.hasOwnProperty('maxType') && props.maxType == 'js') eleProps.max = this.returnEvalJsCode(props.maxJs);
        else eleProps.max = props.max ? props.max : '';

        if (props.hasOwnProperty('minType') && props.minType == 'js') eleProps.min = this.returnEvalJsCode(props.minJs);
        else eleProps.min = props.min ? props.min : '';

        if (props.hasOwnProperty('valueType') && props.valueType == 'js') eleProps.value = this.returnEvalJsCode(props.valueJs);
        else eleProps.value = props.value ? props.value : '';

        /* eleProps.tooltip={
            open: true,
        }; */
        /* eleProps.marks = {};
        eleProps.marks[eleProps.min] = eleProps.min + 'km';
        eleProps.marks[eleProps.max] = eleProps.max + 'km'; */
        if (props.hasOwnProperty('marksJs')) eleProps.marks = this.returnEvalJsCode(props.marksJs);

        //console.log('getASliderNode.props',props,eleProps);

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Slider
                key={treeId}
                style={style}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            />

        );
        return output;
    }

    getASpinNode({ $refs, treeId, style, props, child }) {
        let output = '';
        let eleProps = {};
        if (props.hasOwnProperty('size')) eleProps.size = props.size;

        if (props.hasOwnProperty('spinningType') && props.spinningType == 'js') eleProps.spinning = this.returnEvalJsCode(props.spinningJs);
        else if (props.hasOwnProperty('spinning')) eleProps.spinning = props.spinning;

        let events = props.hasOwnProperty("events") ? props.events : [];
        output = (
            <Spin
                key={treeId}
                style={style}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            >
                {typeof child === 'function' && child()}
            </Spin>

        );
        return output;
    }

    getABadgeNode({ $refs, treeId, style, props, child }) {
        let output = '';
        let eleProps = {};

        if (props.hasOwnProperty('countType') && props.countType === 'js') eleProps.count = this.returnEvalJsCode(props.countJs);
        else if (props.hasOwnProperty('count') && props.count !== undefined) eleProps.count = props.count;

        if (props.hasOwnProperty('showZero')) eleProps.showZero = props.showZero;
        if (props.hasOwnProperty('size')) eleProps.size = props.size;
        if (props.hasOwnProperty('dot')) eleProps.dot = props.dot;

        let events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Badge
                key={treeId}
                style={style}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            >
                {typeof child === 'function' && child()}
            </Badge>

        );
        return output;
    }

    getAProgressNode({ $refs, treeId, style, props }) {
        let output = '';
        let eleProps = {};

        if (props.hasOwnProperty('percentType') && props.percentType == 'js') eleProps.percent = this.returnEvalJsCode(props.percentJs);
        else if (props.hasOwnProperty('percent')) eleProps.percent = props.percent;

        let events = props.hasOwnProperty("events") ? props.events : [];
        output = (
            <Progress
                key={treeId}
                style={style}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            />

        );
        return output;
    }

    getADividerNode({ $refs, treeId, style, props }) {

        let output = '';

        let eleProps = {};
        eleProps.type = props.direction ? props.direction : 'horizontal';

        //console.log('getADropdownNode.child',child)
        output = (
            <Divider
                style={style}
                key={treeId}
                //ref={ref => $refs[treeId] = ref}
                {...eleProps}
            />
        );
        return output;
    }

    getAModalNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let bodyStyle = {};
        //bodyStyle.height = 300;
        if (props.hasOwnProperty('heightType') && props.heightType == 'js') bodyStyle.height = this.returnEvalJsCode(props.heightJs) || bodyStyle.height;
        else if (props.height) bodyStyle.height = props.height;

        let modalWidth;
        //modalWidth = 520;
        if (props.hasOwnProperty('widthType') && props.widthType == 'js') modalWidth = this.returnEvalJsCode(props.widthJs) || modalWidth;
        else if (props.width) modalWidth = props.width;

        let eleProps = {};

        if (props.hasOwnProperty('titleType') && props.titleType == 'js') eleProps.title = this.returnEvalJsCode(props.titleJs);
        else eleProps.title = props.title ? props.title : '';

        if (props.hasOwnProperty('isOpenType') && props.isOpenType == 'js') eleProps.open = this.returnEvalJsCode(props.isOpenJs);
        else eleProps.open = props.isOpen ? props.isOpen : false;

        if (props.hasOwnProperty('destroyOnCloseType') && props.destroyOnCloseType == 'js') eleProps.destroyOnClose = this.returnEvalJsCode(props.destroyOnCloseJs);
        else eleProps.destroyOnClose = props.destroyOnClose ? props.destroyOnClose : false;
        //eleProps.mask = false;

        var events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Modal
                bodyStyle={bodyStyle}
                width={modalWidth}
                key={treeId}
                //ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            >
                {/* {child()} */}
                <ChildComponent treeId={treeId} child={child} />
            </Modal>
        );
        return output;
    }

    getADrawerNode({ $refs, treeId, style, props, child }) {

        let output = '';

        let bodyStyle = {};
        //if(props.hasOwnProperty('height'))bodyStyle.height = props.height;

        let modalWidth = 378;

        if (props.hasOwnProperty('widthType') && props.widthType == 'js') modalWidth = this.returnEvalJsCode(props.widthJs);
        else modalWidth = props.width;


        let eleProps = {};

        if (props.hasOwnProperty('titleType') && props.titleType == 'js') eleProps.title = this.returnEvalJsCode(props.titleJs);
        else eleProps.title = props.title ? props.title : '';

        if (props.hasOwnProperty('isOpenType') && props.isOpenType == 'js') eleProps.open = this.returnEvalJsCode(props.isOpenJs);
        else eleProps.open = props.isOpen ? props.isOpen : false;

        if (props.hasOwnProperty('destroyOnCloseType') && props.destroyOnCloseType == 'js') eleProps.destroyOnClose = this.returnEvalJsCode(props.destroyOnCloseJs);
        else eleProps.destroyOnClose = props.destroyOnClose ? props.destroyOnClose : false;

        if (props.hasOwnProperty('getContainer') && props.getContainer) eleProps.getContainer = !props.getContainer;
        //console.log('getADrawerNode.getContainer',eleProps.getContainer)

        if (props.hasOwnProperty('mask')) eleProps.mask = props.mask;

        if (props.hasOwnProperty('extraType') && props.extraType == 'js') {
            eleProps.extra = this.returnEvalJsCode(props.extraJs);
        } else if (props.hasOwnProperty('extra') && props.extra) {
            eleProps.extra = this.outputTreeArr($refs, this.state.gData, props.extra);
        }

        var events = props.hasOwnProperty("events") ? props.events : [];

        output = (
            <Drawer
                bodyStyle={bodyStyle}
                width={modalWidth}
                key={treeId}
                //ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...this.eventsHandler($refs, events)}
            >
                {typeof child === 'function' && child()}
            </Drawer>
        );
        return output;
    }

    getATreeSelectNode({ $refs, treeId, style, props }) {

        let output = '';

        let treeData = this.returnEvalJsCode(props.dataSource);
        treeData = treeData ? treeData : [];

        let eleProps = {};
        eleProps.treeData = treeData;
        eleProps.placeholder = props.placeholder ? props.placeholder : '请选择';
        eleProps.allowClear = props.allowClear ? props.allowClear : false;
        eleProps.showSearch = props.showSearch ? props.showSearch : false;

        if (props.hasOwnProperty('valueType') && props.valueType == 'js') eleProps.value = this.returnEvalJsCode(props.valueJs);
        else eleProps.value = props.value ? props.value : '';

        let events = props.hasOwnProperty("events") ? props.events : [];
        events = this.eventsHandler($refs, events)

        let eventsObj = {};
        if (events.hasOwnProperty('loadData'))
            eventsObj.loadData = ({ id }) => new Promise((resolve) => {
                events.loadData({ id, resolve });
                //resolve(undefined);
            });
        if (events.hasOwnProperty('onChange'))
            eventsObj.onChange = events.onChange;

        output = (
            <TreeSelect
                style={style}
                key={treeId}
                //ref={ref => $refs[treeId] = ref}
                {...eleProps}
                {...eventsObj}
                dropdownMatchSelectWidth={false}
                treeDataSimpleMode={true}
            //loadData={onLoadData}
            />
        );
        return output;
    }

    getAQRCodeNode({ $refs, treeId, style, props, type }) {
        let output = '';
        let eleProps = this.propsAttrJsHandler(props);

        let events = props.hasOwnProperty("events") ? props.events : [];
        output = React.createElement(QRCode, {
            //key: treeId,
            style,
            ...eleProps,
            ...this.eventsHandler($refs, events),
        });
        return output;
    }

    getARichtextNode({ $refs, treeId, style, props }) {
        let output = '';
        style = { ...style };

        let eleProps = {};
        if (props.hasOwnProperty('widthType') && props.widthType == 'js') style.width = this.returnEvalJsCode(props.widthJs);
        else style.width = props.width;

        if (props.hasOwnProperty('heightType') && props.heightType == 'js') style.height = this.returnEvalJsCode(props.heightJs);
        else style.height = props.height;

        if (props.hasOwnProperty('htmlType') && props.htmlType == 'js') eleProps.html = this.returnEvalJsCode(props.htmlJs);
        else eleProps.html = props.html;



        output = (
            <div style={style} key={treeId}>
                <HtmlParse id={treeId}
                    ref={ref => $refs[treeId] = ref}
                    {...eleProps}
                />
            </div>
        );
        return output;
    }

    // getARichtextEditorNode({ $refs, treeId, style, props }) {
    //     let output = '';

    //     let eleProps = {};
    //     if (props.hasOwnProperty('widthType') && props.widthType == 'js') eleProps.width = this.returnEvalJsCode(props.widthJs);
    //     else eleProps.width = props.width;

    //     if (props.hasOwnProperty('heightType') && props.heightType == 'js') eleProps.height = this.returnEvalJsCode(props.heightJs);
    //     else eleProps.height = props.height;

    //     if (props.hasOwnProperty('htmlType') && props.htmlType == 'js') eleProps.html = this.returnEvalJsCode(props.htmlJs);
    //     else eleProps.html = props.html;

    //     let events = props.hasOwnProperty("events") ? props.events : [];

    //     output = (
    //         // <div style={style} key={treeId}>
    //         //     <Ueditor id={treeId} 
    //         //     //onContentChange={(content) => this.updateProps(treeId,'html',content)} 
    //         //     {...eleProps}
    //         //     readOnly={true}
    //         // />
    //         // </div>
    //         <WangEditor
    //             key={treeId}
    //             ref={ref => $refs[treeId] = ref}
    //             style={style}
    //             {...eleProps}
    //             {...this.eventsHandler($refs, events)}
    //         //onChange={(html) => this.updateProps(treeId,'html',html)} 
    //         />

    //     );
    //     return output;
    // }


}


class FNodeComponent extends AntUI {
    static contextType = GlobalContext;
    constructor(props) {
        super(props);
        //console.log('FNodeComponent',props)

        this.$refs = props._this.$refs;
        this.state = props._this.state;
        this.modules = props._this.modules;
        this.AppCode = props._this.AppCode;
        this.frontCode = props._this.frontCode;
        this.nodeCaches = props._this.nodeCaches;
        this.inComponent = props._this.inComponent;
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        //console.log(prevProps)
        if (prevProps.rnd !== this.props.rnd) this.setState({ rnd: Math.random() });
    }

    getProps() {
        return this.props;
    }

    getState() {
        return this.state;
    }

    getThis() {
        return this.props._this;
    }

    getContext() {
        // if(this.props.isIf){
        //     return this.props._this.context;
        // }else{
        //     return this.context;
        // }

        return this.context;
    }

    render() {
        //console.log('render',treeData);
        // return this.outputNodes(this.props.treeCode)

        const children = this.outputNodes(this.props.treeCode);
        if (this.props.hasOwnProperty('onOutputNodes')) this.props.onOutputNodes(children);
        return children;
    }
}

class CommonComponent extends AntUI {
    static contextType = GlobalContext;
    constructor(props) {
        super(props);

        this.$refs = props._this.$refs;
        this.state = props._this.state;
        this.modules = props._this.modules;
        this.AppCode = props._this.AppCode;
        this.frontCode = props._this.frontCode;
        this.nodeCaches = props._this.nodeCaches;
        this.inComponent = props._this.inComponent;
        //this.context = props._this.context;
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        //console.log(prevProps)
        if (prevProps.rnd !== this.props.rnd) this.setState({ rnd: Math.random() });
    }

    getProps() {
        return this.props;
    }

    getState() {
        return this.state;
    }

    getThis() {
        return this.props._this;
    }

    getContext() {
        return this.context;
    }

    render() {
        //console.log('render',treeData);
        const output = this.outputNodes(this.props.treeCode)
        //console.log('CommonComponent', this, output);//this.context
        return output;
    }
}

class DComponent extends AntUI {
    static contextType = GlobalContext;
    constructor(props) {
        super(props);
        //console.log('DComponent',props)
        this.$refs = {};
        this.modules = {};
        this.nodeCaches = {};
        this.AppCode = props.treeCode;
        this.frontCode = getFrontCode(props.treeCode);
        this.gData = flattenTree(props.treeCode);
        this.inComponent = true;

        this.state = {
            //gData: props.treeData,
            //gData: flattenTree(props.treeCode),
            gData: [],
            //AppCode: props.treeCode,
            AppCode: [],
            modules: {},
            //frontCode: getFrontCode(props.treeCode),
            frontCode: [],
            nodeCaches: {},
            // $vars:{
            //     ...this.attrHandler(props.attr)
            // }
            ...this.attrHandler(props.attr),
            rnd: 0//Math.random()
        };
    }


    updateAppCode(appCode = []) {

        //console.log('DComponent.updateAppCode', appCode,this.props.rnd,this.state.rnd)
        //this.setState({ AppCode: appCode });

        this.modules = {};
        this.nodeCaches = {};
        this.frontCode = [];

        this.AppCode = appCode;

        //this.setState({ gData: flatTree });
        this.gData = flattenTree(appCode);

        this.setFrontCode(appCode);

        this.setState({ rnd: Math.random() });
    }

    componentDidMount() {
        if (!this.loaded) {
            //console.log('DComponent.componentDidMount', this.props.treeCode,this.props.rnd,this.state.rnd);
            this.loaded = true;
            // if (getStore('IN_EDITOR')) {
            //     playerEventEmitter.on('UPDATE_APP_CODE', this.updateAppCode.bind(this));
            // }
        }
    }

    componentWillUnmount() {
        // playerEventEmitter.off('UPDATE_APP_CODE', this.updateAppCode.bind(this));
    }

    componentDidUpdate(prevProps) {
        //console.log(prevProps)
        //console.log(this.props)

        //if (prevProps.treeCode !== this.props.treeCode) this.updateAppCode(this.props.treeCode);
        if (prevProps.rnd !== this.props.rnd) this.updateAppCode(this.props.treeCode);

        /* const { treeData } = prevProps
        const { treeData: newTreeData } = this.props;
        if (treeData != newTreeData) {
            this.setState({
                gData: newTreeData
            })
        }

        const { modules } = prevProps
        const { modules: newModules } = this.props;
        if (modules != newModules) {
            this.setState({
                modules: newModules
            })
        } */

        const { attr } = prevProps
        const { attr: newAttr } = this.props;
        if (attr != newAttr) {
            this.setState({
                // $vars: {
                //     ...this.attrHandler(newAttr)
                // }
                ...this.attrHandler(newAttr)
            })
        }
    }

    attrHandler(attr) {
        var output = {};
        if (attr)
            attr.map(item => {
                output[item.attrId] = item.attrValue;
            })

        return output;
    }

    callMethod({ method, param, callback }) {
        try {
            return this.$refs[method](param, callback);
        } catch (error) {
            callback(error);
        }

    }

    getProps() {
        return this.props;
    }

    getState() {
        return this.state;
    }

    getThis() {
        //return this.props._this;
        return this;
    }

    getContext() {
        return this.context;
    }

    render() {
        //console.log('render',treeData);
        return (
            <React.Fragment>
                {this.getOutputNode()}
                {/* {this.getMessageNode()} */}
            </React.Fragment>
        )
    }
}

class Player extends AntUI {
    static contextType = GlobalContext;
    constructor(props) {
        super(props);
        this.$refs = {};
        this.loaded = false;
        this.modules = {};
        this.nodeCaches = {};
        this.AppCode = [];
        this.frontCode = [];
        this.gData = [];
        this.state = {
            //AppCode:editorGetStore('AppCode'),
            AppCode: [],
            gData: [],
            frontCode: [],
            modules: {},
            nodeCaches: {},
            rnd: Math.random()
        }
    }


    updateAppCode(appCode = []) {
        //console.log('Player.updateAppCode', appCode,this.state.rnd);

        // appCode = [...appCode];
        // if (this.state.AppCode !== appCode) {

        //     this.setState({ AppCode: appCode });

        //     const flatTree = flattenTree(appCode);

        //     this.setState({ gData: flatTree });

        //     setStore('APP_CODE', appCode);

        //     this.setFrontCode(appCode);

        // }

        setStore('APP_CODE', appCode);
        this.AppCode = appCode;
        this.gData = flattenTree(appCode);

        this.modules = {};
        this.nodeCaches = {};
        this.frontCode = [];

        this.setFrontCode(appCode);

        this.setState({ rnd: Math.random() });
    }

    componentDidMount() {
        if (!this.loaded) {
            //console.log('Player.componentDidMount', this.props.appCode);
            this.loaded = true;

            // if (this.state.AppCode.length <= 0 && this.props.appCode) {
            //     this.updateAppCode(this.props.appCode);
            // }

            if (this.AppCode.length <= 0 && this.props.appCode) {
                this.updateAppCode(this.props.appCode);
            }


            if (getStore('IN_EDITOR')) {
                playerEventEmitter.on('DEBUG_JS_FUN', this.debugJsFuncCode.bind(this));
                playerEventEmitter.on('UPDATE_APP_CODE', this.updateAppCode.bind(this));
            }
        }

    }

    componentWillUnmount() {
        playerEventEmitter.off('DEBUG_JS_FUN', this.debugJsFuncCode.bind(this));

        playerEventEmitter.off('UPDATE_APP_CODE', this.updateAppCode.bind(this));

        // if (this.unsubscribe) this.unsubscribe();
    }

    getProps() {
        return this.props;
    }

    getState() {
        return this.state;
    }

    getThis() {
        return this;
    }

    getContext() {
        return this.context;
    }

    render() {
        return (
            <React.Fragment>

                <ConfigProvider
                    locale={zhCN}
                    theme={{
                        "token": {
                            colorPrimary: "#1677ff",
                        },
                        algorithm: [
                            defaultAlgorithm,
                            //darkAlgorithm, 
                            //compactAlgorithm
                        ]
                    }}
                >
                    <App>
                        <HashRouter>
                            {this.getOutputNode()}
                        </HashRouter>
                    </App>
                </ConfigProvider>


            </React.Fragment>
        );
    }
}

//export default Player;

const AppHook = (props) => {
    const { message, notification, modal } = App.useApp();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    //const isMobile = false;


    //console.log('useMediaQuery.IS_MOBILE',isMobile);

    const onMessage = (options) => {
        message.open(options);
    }

    const onModal = (type, options) => {
        modal[type](options);
    }

    useEffect(() => {
        setStore('IS_MOBILE', isMobile);
    }, [isMobile]);

    useEffect(() => {
        playerEventEmitter.on('SHOW_MESSAGE', onMessage);
        return () => {
            playerEventEmitter.off('SHOW_MESSAGE', onMessage);
        };
    }, []);

    useEffect(() => {
        playerEventEmitter.on('SHOW_MODAL', onModal);
        return () => {
            playerEventEmitter.off('SHOW_MODAL', onModal);
        };
    }, []);
    return (
        <></>
    )
}

const withModal = (WrappedComponent) => {
    return React.forwardRef((props, ref) => {


        return (
            <App>
                <WrappedComponent ref={ref} {...props} />
                <AppHook />
            </App>
        );


    });
};

export default withModal(Player);