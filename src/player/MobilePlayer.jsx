import React, { Component, useState, useEffect, useContext } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, HashRouter } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames/dedupe';
import styled from "styled-components";
import {
    Row, Col, Button, Grid, ConfigProvider, Cell, CellGroup, Image, Divider, Tabs, Picker, Checkbox, DatePicker, Form, Input, InputNumber, Menu, MenuItem, Radio, Switch, TextArea, Uploader, Badge, Dialog, Popup, Avatar, Table, Card, Price, Tag, VirtualList, Range, Swiper, SwiperItem, Notify, NavBar, Toast, SearchBar, Tabbar, TabbarItem, InfiniteLoading,Space
} from '@nutui/nutui-react';
import Store, { getStore, setStore } from "./redux_store";
import UserStore, { getStore as userGetStore, setStore as userSetStore } from "./user_store";
import { flattenTree, findNodeById, filterObjectByProperty, getFrontCode, hasHttpOrHttps } from './player_utils';
import playerEventEmitter from './player_global_events';
import runJs from "./runJs"
import Api from './player_api';
//import HtmlParse from "./../common/htmlParse"
import '@nutui/nutui-react/dist/style.css'
import "./mobile_styles.css"

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from "@nutui/nutui-react/dist/locales/zh-CN";




const GlobalContext = React.createContext({});

const OSS_HOST = 'https://oss.d8dcloud.com';//CONFIG.OSS_HOST;


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
    else if (type === "if") output.push(<IfNode key={treeId} {...{ _this: _this, $refs, treeId, props, child }} />);
    // else if (type === "for") output.push(<ForNode key={treeId} d8dprops={{ _this: _this, $refs, treeId, props, child }} />);
    // else if (type === "for") output.push(<ForNode key={treeId} d8dprops={{ _this: _this, $refs, treeId, props, child }} >{child()}</ForNode>);
    else if (type === "for") output.push(ForNode({ d8dprops: { _this: _this, $refs: null, treeId, style, props, child } }));

    else if (type === "form") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Form }));
    else if (type === "form.item") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Form.Item }));
    else if (type === "inputnumber") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: InputNumber }));
    else if (type === "input") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Input }));
    else if (type === "textarea") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: TextArea }));
    // else if (type === "picker") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Picker }));    
    else if (type === "picker") output.push(NPickerNode({ d8dprops: { _this: _this, $refs: null, treeId, style, props, child, Element: Picker } }));
    else if (type === "switch") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Switch }));
    else if (type === "button") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Button }));
    else if (type === "space") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Space }));
    else if (type === "row") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Row }));
    // else if (type === "col") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Col }));
    else if (type === "col") output.push(<BCommonNode key={treeId} d8dprops={{ _this: _this, $refs: null, treeId, style, props, child, Element: Col }} />);
    // else if (type === "cell") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Cell }));
    // else if (type === "row") output.push(BCommonNode({d8dprops:{ _this: _this, $refs: null, treeId, style, props, child, Element: Row }}));
    // else if (type === "col") output.push(BCommonNode({d8dprops:{ _this: _this, $refs: null, treeId, style, props, child, Element: Col }}));
    // else if (type === "cell") output.push(NCellNode({d8dprops:{ _this: _this, $refs: null, treeId, style, props, child, Element: Cell }}));
    else if (type === "cell") output.push(<BCommonNode key={treeId} d8dprops={{ _this: _this, $refs: null, treeId, style, props, child, Element: Cell }} />);
    else if (type === "cell.group") output.push(<BCommonNode key={treeId} d8dprops={{ _this: _this, $refs: null, treeId, style, props, child, Element: Cell.Group }} />);
    else if (type === "grid") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Grid }));
    // else if (type === "grid.item") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Grid.Item }));
    else if (type === "grid.item") output.push(NChildItemNode({ d8dprops: { _this: _this, $refs: null, treeId, style, props, child, Element: Grid.Item } }));
    else if (type === "img") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: 'img', elePropsCallback: _this.getImgProps.bind(_this) }));
    else if (type === "image") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: Image, elePropsCallback: _this.getAImageProps.bind(_this) }));
    else if (type === "div") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'div' }));
    // else if (type === "span") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'span' }));
    // else if (type === "div") output.push(BCommonNode({d8dprops:{ _this: _this, $refs: null, treeId, style, props, child, Element: 'div' }}));
    // else if (type === "span") output.push(BCommonNode({d8dprops:{ _this: _this, $refs: null, treeId, style, props, child, Element: 'span' }}));
    else if (type === "span") output.push(<BCommonNode key={treeId} d8dprops={{ _this: _this, $refs: null, treeId, style, props, child, Element: 'span' }} />);
    else if (type === "h1") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h1' }));
    else if (type === "h2") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h2' }));
    else if (type === "h3") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h3' }));
    else if (type === "h4") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h4' }));
    else if (type === "h5") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h5' }));
    // else if (type === "menu") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Menu }));
    // else if (type === "menu.item") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: MenuItem }));    
    // else if (type === "menu") output.push(<NMenuNode key={treeId} d8dprops={{ _this: _this, $refs, treeId, props, child }} />);
    // else if (type === "menu.item") output.push(<NMenuItemNode key={treeId} d8dprops={{ _this: _this, $refs, treeId, props, child }} />);
    // else if (type === "menu.item") output.push(NMenuItemNode({d8dprops:{ _this: _this, $refs: null, treeId, style, props, Element: MenuItem }}));
    // else if (type === "menu") output.push(BCommonNode({d8dprops:{ _this: _this, $refs: null, treeId, style, props, child, Element: Menu }}));
    else if (type === "menu") output.push(<BCommonNode key={treeId} d8dprops={{ _this: _this, $refs: null, treeId, style, props, child, Element: Menu }} />);
    else if (type === "menu.item") output.push(BCommonNode({ d8dprops: { _this: _this, $refs: null, treeId, style, props, Element: MenuItem } }));
    else if (type === "tabbar") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Tabbar }));
    else if (type === "tabbar.item") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: Tabbar.Item }));
    else if (type === "card") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Card }));
    else if (type === "table") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: Table }));
    else if (type === "virtualList") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: VirtualList }));
    else if (type === "list.item.meta") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: List.Item.Meta }));
    else if (type === "radio") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Radio }));
    else if (type === "radio.group" || type === "radiogroup") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Radio.Group }));
    else if (type === "checkbox") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Checkbox }));
    else if (type === "checkbox.group" || type === "checkbox.group") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Checkbox.Group }));
    // else if (type === "datepicker") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: DatePicker }));
    else if (type === "datepicker") output.push(NPickerNode({ d8dprops: { _this: _this, $refs: null, treeId, style, props, child, Element: DatePicker } }));
    // else if (type === "uploader") output.push(NUploaderNode({ d8dprops: { _this: _this, $refs: null, treeId, style, props, child, } }));
    else if (type === "uploader") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Uploader }));
    else if (type === "calendar") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Calendar }));
    else if (type === "configprovider") output.push(<NConfigProviderNode key={treeId} d8dprops={{ _this: _this, $refs, treeId, props, child }} />);
    else if (type === "tabs") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Tabs }));
    // else if (type === "tabs") output.push(<NTabsNode key={treeId} d8dprops={{ _this: _this, $refs, treeId, props, child }} ><ChildComponent treeId={'child' + treeId} child={child} /></NTabsNode>);
    // else if (type === "tabs.tabpane") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Tabs.TabPane }));
    else if (type === "tabs.tabpane") output.push(NChildItemNode({ d8dprops: { _this: _this, $refs: null, treeId, style, props, child, Element: Tabs.TabPane } }));
    else if (type === "range") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Range }));
    else if (type === "badge") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Badge }));
    else if (type === "progress") output.push(_this.getACommonNode({ $refs, treeId, style, props, Element: Progress }));
    else if (type === "divider") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, Element: Divider }));
    else if (type === "dialog") output.push(<NDialogNode key={treeId} {...{ _this: _this, $refs, treeId, style, props, child }} />);
    else if (type === "popup") output.push(<NPopupNode key={treeId} {...{ _this: _this, $refs, treeId, style, props, child }} />);
    else if (type === "swiper") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: Swiper }));
    else if (type === "swiperitem") output.push(_this.getACommonNode({ $refs, treeId, style, props, child, Element: SwiperItem }));
    else if (type === "navbar") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: NavBar }));
    else if (type === "searchbar") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: SearchBar }));
    else if (type === "infiniteloading") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: InfiniteLoading }));
    // else if (type === "navbar") output.push(BCommonNode({d8dprops:{ _this: _this, $refs: null, treeId, style, props, child, Element: NavBar }}));
    // else if (type === "searchbar") output.push(BCommonNode({d8dprops:{ _this: _this, $refs: null, treeId, style, props, child, Element: SearchBar }}));
    // else if (type === "infiniteloading") output.push(BCommonNode({d8dprops:{ _this: _this, $refs: null, treeId, style, props, child, Element: InfiniteLoading }}));
    else if (type === "tag") output.push(_this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Tag }));

    return output;
}

function _F(treeId) {
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

                if (method == 'getItem') {
                    // console.log(treeId + '.callMethod', this.getContext('fNodeItem'), this);
                    return val;
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
                //console.log(treeId+'.callMethod' + '.',method,'.param',param);
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
                    if (this.getThis().$refs[treeId])
                        return this.getThis().$refs[treeId];
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
    else if (treeId.indexOf('aRichtextEditor_') > -1) {
        return {
            callMethod: (method, param) => {
                //console.log(treeId+'.callMethod' + '.',method,'.param',param);
                if (method == 'getHtml') {
                    return this.$refs[treeId] && typeof this.$refs[treeId].getHtml == 'function' ? this.$refs[treeId].getHtml() : undefined;
                } else if (method == 'setHtml') {
                    if (this.$refs[treeId] && typeof this.$refs[treeId].setHtml == 'function') this.$refs[treeId].setHtml(param);
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
            callSync: (param, callback) => {
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
            call: (param) => {
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




                if (method == 'navigate' || method == 'switch') {


                    //let _this = getPlayerThis(this);

                    //console.log(treeId + 'getPlayerThis',getPlayerThis(this).navigateTo,_this.navigateTo);

                    //_this.setWebTitle(param.path);
                    /* if (_this.navigateTo) {
                      _this.navigateTo(param.path);
                    } else {
                      console.log('navigateTo不存在', _this, param.path);
                    } */
                    /* function objectToQueryString(obj) {
                        let queryArr = Object.keys(obj);
                        if (Array.isArray(queryArr)) {
                            return '?' + queryArr.map(key => key + '=' + encodeURIComponent(obj[key])).join('&');
                        }
                        return ''
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

                    if (param.memParams) {
                        let memParams = param.memParams;

                        try {
                            memParams = JSON.parse(JSON.stringify(memParams));
                        } catch (error) {
                            memParams = undefined;
                        }
                        setStore('MEM_PARAMS', memParams);
                    }

                }
                else if (method == 'navigateBack') {
                    playerEventEmitter.emit('ON_NAVIGATE', param);
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
                else if (method === 'getMemParams') {
                    let memParams = getStore('MEM_PARAMS');

                    try {
                        memParams = JSON.parse(JSON.stringify(memParams));
                    } catch (error) {
                        memParams = undefined;
                    }
                    setStore('MEM_PARAMS', undefined);

                    return memParams;
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
                        resolve(res);
                        if (typeof callback.success === 'function') callback.success(res);
                    }
                    const fail = (err) => {
                        reject(err);
                        if (typeof callback.fail === 'function') callback.fail(err);
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
        setFNodeCode(tmpFNodeCode);
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

                fNodeItem[treeId] = item;

                const treeCode = FNodeCode.children;


                // console.log('onOutputTmpNode', outputNode[index], index)

            

                output.push((
                    <TmpForNode
                        key={treeId + 'for' + index}
                        {...outputNode[index]?.props}
                    >
                        <GlobalContext.Provider value={fNodeItem}>
                            <FNodeComponent
                                // key={treeId}
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

                // if (outputNode[index]) {
                //     // output.push(outputNode[index])
                //     const forItemNode = outputNode[index];
                //     const cloneNode = React.cloneElement(forItemNode, {
                //         ...forItemNode.props,
                //         key: forItemNode.key + index
                //     }, forItemNode.props.children);

                //     output.push(cloneNode);
                // } else
                //     output.push((
                //         <TmpNode
                //             key={treeId + 'for' + index}
                //             {...outputNode[index]?.props}
                //         >
                //             <GlobalContext.Provider value={fNodeItem}>
                //                 <FNodeComponent
                //                     // key={treeId}
                //                     // ref={ref => console.log('ref', ref)}
                //                     _this={_this}
                //                     treeCode={treeCode}
                //                     rnd={_this.getState().rnd}
                //                     onOutputNodes={(forItemNode) => onOutputNodes(forItemNode, index)}
                //                 />
                //             </GlobalContext.Provider>
                //         </TmpNode>
                //     )
                //     );


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

function IfNode({ _this, $refs, treeId, props, child }) {
    const [condRes, setCondRes] = useState(false);

    useEffect(() => {
        if (props.hasOwnProperty('conditionJs')) {
            const condition = _this.returnEvalJsCode(props.conditionJs);
            setCondRes(condition);
            //console.log("IfNode", treeId, props.condition, condition)
        }
        else if (props.hasOwnProperty('condition')) {
            const condition = _this.returnEvalJsCode(props.condition);
            setCondRes(condition);
            //console.log("IfNode", treeId, props.condition, condition)
        }
    }, [_this.state]);

    if (condRes) {
        return (
            <ChildComponent child={child} />
        )
    }
    else
        return '';

}

function NChildItemNode(superProps) {
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

function NUploaderNode(superProps) {
    const { d8dprops, ...rest } = superProps;
    const { _this, $refs, treeId, props, child, Element } = d8dprops;

    let output = '';
    let eleProps = _this.propsAttrJsHandler(props);

    var events = props.hasOwnProperty("events") ? props.events : [];

    output = (
        <Uploader
            key={treeId}
            //ref={ref => $refs[treeId] = ref}
            {...eleProps}
            {..._this.eventsHandler($refs, events)}
            {...rest}
        />
    );
    return output;
}


function NPickerNode(superProps) {
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
        >

            {(value) => {
                return (
                    <Cell
                        style={{
                            padding: 0,
                            '--nutui-cell-divider-border-bottom': '0',
                        }}
                        className="nutui-cell--clickable"
                        title={
                            value.length
                                ? eleProps.options.filter((po) => po.value === value[0])[0]
                                    ?.text
                                : eleProps.title ? eleProps.title : '请选择'
                        }
                        extra={'>'}
                        align="center"
                    />
                )
                // return (
                //     <ChildComponent treeId={treeId} child={child} />
                // )
            }}
        </Element>
    );
    return output;
}

function NDialogNode({ _this, $refs, treeId, style, props, child }) {

    let output = '';
    let eleProps = _this.propsAttrJsHandler(props);


    if (eleProps.hasOwnProperty('isOpen')) {
        const isOpen = eleProps.isOpen;
        eleProps = filterObjectByProperty(eleProps, 'buttonType');
        eleProps.open = isOpen;
    }

    var events = props.hasOwnProperty("events") ? props.events : [];

    output = (
        <Dialog
            key={treeId}
            //ref={ref => $refs[treeId] = ref}
            {...eleProps}
            {..._this.eventsHandler($refs, events)}
        >
            <ChildComponent treeId={treeId} child={child} />
        </Dialog>
    );
    return output;
}

function NPopupNode({ _this, $refs, treeId, style, props, child }) {

    let output = '';
    let eleProps = _this.propsAttrJsHandler(props);


    if (eleProps.hasOwnProperty('isOpen')) {
        const isOpen = eleProps.isOpen;
        eleProps = filterObjectByProperty(eleProps, 'buttonType');
        eleProps.open = isOpen;
    }

    var events = props.hasOwnProperty("events") ? props.events : [];

    output = (
        <Popup
            key={treeId}
            //ref={ref => $refs[treeId] = ref}
            {...eleProps}
            {..._this.eventsHandler($refs, events)}
        >
            <ChildComponent treeId={treeId} child={child} />
        </Popup>
    );
    return output;
}


function NCellNode(superProps) {
    const { d8dprops, ...rest } = superProps;
    const { _this, $refs, treeId, props, child } = d8dprops;

    let output = '';
    let eleProps = _this.propsAttrJsHandler(props);

    var events = props.hasOwnProperty("events") ? props.events : [];

    // console.log("NMenuNode.rest", treeId, rest)

    // output = (
    //     <Menu
    //         key={treeId}
    //         //ref={ref => $refs[treeId] = ref}
    //         {...eleProps}
    //         {..._this.eventsHandler($refs, events)}
    //         {...rest}
    //     >
    //         <ChildComponent treeId={treeId} child={child} />
    //     </Menu>
    // ); 

    // const Span = React.createElement('span',null,'2342424232');

    output = (
        <Cell>
            {child()}
            {/* <Span>9384298</Span> */}
            {/* {Span} */}
        </Cell>
    );
    return output;
}


function NMenuItemNode(superProps) {
    const { d8dprops, ...rest } = superProps;
    const { _this, $refs, treeId, props, child } = d8dprops;

    let output = '';
    let eleProps = _this.propsAttrJsHandler(props);

    var events = props.hasOwnProperty("events") ? props.events : [];

    console.log("NMenuItemNode.rest", treeId, rest)

    output = (
        <MenuItem
            key={treeId}
            //ref={ref => $refs[treeId] = ref}
            {...eleProps}
            // title="jfwiejowfjow"
            {..._this.eventsHandler($refs, events)}
            {...rest}
        >
            {/* <ChildComponent treeId={treeId} child={child} /> */}
        </MenuItem>
    );
    return output;
}

function NNavBarNode({ _this, $refs, treeId, style, props, child }) {

    let output = '';
    let eleProps = _this.propsAttrJsHandler(props);

    var events = props.hasOwnProperty("events") ? props.events : [];

    // output = (
    //     <NavBar
    //         key={treeId}
    //         //ref={ref => $refs[treeId] = ref}
    //         {...eleProps}
    //         {..._this.eventsHandler($refs, events)}
    //     >
    //         {/* <ChildComponent treeId={treeId} child={child} /> */}
    //         <span>abc</span>
    //     </NavBar>
    // );


    output = (
        <NavBar
            // back={
            // <>
            //     <Left name="left" color="#979797" />
            //     返回
            // </>
            // }
            // left={<Close width={12} />}
            // right={
            // <span onClick={(e) =>  Toast.text('icon')}>
            //     <Share />
            // </span>
            // }
            onClickBack={(e) => Toast.text("返回4242")}
        >
            <span onClick={(e) => Toast.text("标题")}>
                订单详情
            </span>订单详情222
        </NavBar>
    )

    return output;
}

function NConfigProviderNode(superProps) {
    const { d8dprops, ...rest } = superProps;
    const { _this, $refs, treeId, props, child } = d8dprops;

    let output = '';
    let eleProps = _this.propsAttrJsHandler(props);

    output = (
        <ConfigProvider
            locale={zhCN}
            key={treeId}
            {...eleProps}
        >
            <ChildComponent treeId={treeId} child={child} />
        </ConfigProvider>
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
    let eleProps = _this.propsAttrJsHandler(elePropsCallback ? elePropsCallback(props) : props);
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


    // if (treeId.toLowerCase().indexOf('menu.item_') > -1)
    //     console.log("eleProps", treeId, eleProps, props, child, children)

    // if (treeId.indexOf('grid_4FS3dyh4j2') > -1)
    //     console.log("eleProps", treeId, eleProps, props, events, style, eventProps, child, children)
    // if (treeId.indexOf('swiper') > -1)
    //     console.log("getACommonNode", treeId, child, children,child())

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

    if (treeId.indexOf('form_') > -1) {
        const [form] = Form.useForm();
        eleProps.form = form;
        _this.$refs[treeId] = form;
    }

    if (getStore('IN_EDITOR')) {
        if (treeId.toLowerCase().indexOf('image_') > -1 && (eleProps.width === undefined || eleProps.width === '')) {
            // console.log("eleProps", treeId, eleProps, props)
            eleProps.width = '375px';
        }
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
            key={'BCommonNode_' + treeId}
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

        // const F = (treeId) => {
        //     //var treeId = this.devIdHandler(devId);
        //     //var treeId = this.devIdHandler(devId);
        //     //treeId = treeId ? treeId : devId;
        //     //console.log("jsFuncHandler.F.treeId",treeId)

        //     const getPlayerThis = (_this) => {
        //         //console.log('getPlayerThis',_this);
        //         if (_this.inComponent) return getPlayerThis(_this.getThis());
        //         else return _this
        //     };


        //     if (treeId.indexOf('variable_') > -1) {
        //         return {
        //             callMethod: (method, param, callback) => {

        //                 //if(treeId == 'variable_FpSnM6QZE5')console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.state',this.state[treeId],this.state,this.$refs,this);


        //                 if (method == 'get') {
        //                     //var $vars = this.state.$vars;
        //                     var $vars = this.getState();
        //                     //console.log(treeId+'.',method,param,$vars,this)
        //                     var val = $vars[treeId] === undefined ? this.$refs[treeId] : $vars[treeId];
        //                     //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',this.$refs[treeId],$vars[treeId],this.$refs);
        //                     if (param) {
        //                         if (val && val.hasOwnProperty(param)) return val[param];
        //                         else return undefined;
        //                     }
        //                     else
        //                         return val;
        //                 }
        //                 else if (method == 'set') {
        //                     //var $vars = CircularJSON.parse(CircularJSON.stringify(this.state.$vars));
        //                     var $vars = {};
        //                     $vars[treeId] = param;

        //                     this.setState($vars, callback);

        //                 }
        //                 else if (method == 'isNull') {
        //                     //var $vars = this.state.$vars;
        //                     var $vars = this.getState();
        //                     //console.log(treeId+'.',method,param,$vars,this)
        //                     var val = $vars[treeId] === undefined ? this.$refs[treeId] : $vars[treeId];

        //                     if (val === undefined) return true;
        //                     else if (val === null) return true;
        //                     else if (typeof val === 'object') return Object.keys(val).length == 0;
        //                     else return false;
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('aList_') > -1) {
        //         return {
        //             callMethod: (method, param, callback) => {

        //                 let listItem = this.getContext('listItem') || {};
        //                 let val = listItem[treeId] || [];

        //                 if (method == 'getItem') {
        //                     return val;
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('aTable_') > -1) {
        //         return {
        //             callMethod: (method, param, callback) => {

        //                 //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.state',this.state.$vars[treeId],this.state,this.$refs);

        //                 var val = this.context[treeId] ? this.context[treeId] : [];

        //                 if (method == 'getItem') {
        //                     //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',val);
        //                     //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',this.$refs[treeId],$vars[treeId],this.$refs);
        //                     return val;
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('aTree_') > -1) {
        //         return {
        //             callMethod: (method, param, callback) => {

        //                 //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.state',this.state.$vars[treeId],this.state,this.$refs);

        //                 var val = this.context[param] ? this.context[param] : '';

        //                 if (method == 'getItem') {
        //                     //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',val);
        //                     //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',this.$refs[treeId],$vars[treeId],this.$refs);
        //                     return val;
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('for_') > -1) {
        //         return {
        //             /* callMethod: (method, param, callback) => {
        //                 var forItem = this.getForItem(treeId);

        //                 //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.forItem',forItem,this);

        //                 var val = forItem[param] || forItem[param] === 0 || forItem[param] === '0' ? forItem[param] : '';

        //                 if (method == 'getItem') {
        //                     //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',val);
        //                     //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.val',this.$refs[treeId],$vars[treeId],this.$refs);
        //                     return val;
        //                 }
        //             } */
        //             callMethod: (method, param, callback) => {

        //                 //console.log(treeId + '.callMethod', this.getContext(), this);

        //                 let fNodeItem = this.getContext('fNodeItem') || {};
        //                 let val = fNodeItem[treeId] || [];

        //                 if (method == 'getItem') {
        //                     return val;
        //                 }
        //             }

        //         }
        //     }
        //     else if (treeId.indexOf('global_func') > -1) {
        //         return {
        //             callMethod: (method, param, callback) => {

        //                 //console.log(treeId+'.callMethod' + '.method',method,'.param',param,'.context',this.context);

        //                 if (method == 'getConfig') {
        //                     let treeData = getStore('APP_CODE');
        //                     let treeInfo = treeData.find(item => item.type == 'config') || {};
        //                     let config = treeInfo.props;
        //                     let name = treeInfo.name;
        //                     var val = '';
        //                     if (param == 'apiHost') {
        //                         let preApiHost = config['preApiHost'] || '';
        //                         let prdApiHost = config['prdApiHost'] || '';
        //                         let hostname = window.location.hostname;
        //                         if (['prev2.d8dcloud.com'].indexOf(hostname) > -1) {
        //                             preApiHost = preApiHost.replace('8090.dev.d8dcloud.com', 'prev2.d8dcloud.com');
        //                             val = preApiHost;
        //                         } else if (['editorv2.d8dcloud.com'].indexOf(hostname) > -1) {
        //                             preApiHost = preApiHost.replace('prev2.d8dcloud.com', 'editorv2.d8dcloud.com');
        //                             val = preApiHost;
        //                         } else if (['docker.d8dcloud.com'].indexOf(hostname) > -1) {
        //                             preApiHost = preApiHost.replace('prev2.d8dcloud.com', 'docker.d8dcloud.com').replace('8090.dev.d8dcloud.com', 'docker.d8dcloud.com');
        //                             val = preApiHost;
        //                         } else if (['8090.dev.d8dcloud.com'].indexOf(hostname) > -1) {
        //                             preApiHost = preApiHost.replace('prev2.d8dcloud.com', '8090.dev.d8dcloud.com');
        //                             val = preApiHost;
        //                         } else if (['8820.dev.d8dcloud.com'].indexOf(hostname) > -1) {
        //                             preApiHost = preApiHost.replace('prev2.d8dcloud.com', '8820.dev.d8dcloud.com');
        //                             val = preApiHost;
        //                         } else
        //                             val = prdApiHost;
        //                     }
        //                     else if (param == 'siteName') {
        //                         val = name;
        //                     } else {
        //                         val = config[param] ? config[param] : '';
        //                     }

        //                     return val;
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('input_') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param);
        //                 if (method == 'getValue') {
        //                     return this.$refs[treeId] && typeof this.$refs[treeId].getValue == 'function' ? this.$refs[treeId].getValue() : undefined;
        //                 } else if (method == 'setValue') {
        //                     if (this.$refs[treeId] && typeof this.$refs[treeId].setValue == 'function') this.$refs[treeId].setValue(param);
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('form_') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param,this.getThis(),this);
        //                 if (method == 'getInstance') {
        //                     if (this.getThis().$refs[treeId])
        //                         return this.getThis().$refs[treeId];
        //                     else {
        //                         console.log(treeId + '不存在，请检查是否未加载就先调用了');
        //                         return undefined;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('aInputNumber_') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param);
        //                 if (method == 'getValue') {
        //                     return this.$refs[treeId] && typeof this.$refs[treeId].getValue == 'function' ? this.$refs[treeId].getValue() : undefined;
        //                 } else if (method == 'setValue') {
        //                     if (this.$refs[treeId] && typeof this.$refs[treeId].setValue == 'function') this.$refs[treeId].setValue(param);
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('aRichtextEditor_') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param);
        //                 if (method == 'getHtml') {
        //                     return this.$refs[treeId] && typeof this.$refs[treeId].getHtml == 'function' ? this.$refs[treeId].getHtml() : undefined;
        //                 } else if (method == 'setHtml') {
        //                     if (this.$refs[treeId] && typeof this.$refs[treeId].setHtml == 'function') this.$refs[treeId].setHtml(param);
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('aFlow_') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param);
        //                 if (method == 'getValue') {
        //                     return this.$refs[treeId] && typeof this.$refs[treeId].toObject == 'function' ? this.$refs[treeId].toObject() : undefined;
        //                 } else if (method == 'setValue') {
        //                     if (this.$refs[treeId] && typeof this.$refs[treeId].fromObject == 'function') this.$refs[treeId].fromObject(param);
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('aSwitch_') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param,this);
        //                 if (method == 'getValue') {
        //                     return this.$refs[treeId] ? this.$refs[treeId].getValue() : undefined;
        //                 } else if (method == 'setValue') {
        //                     if (this.$refs[treeId]) this.$refs[treeId].setValue(param);
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('aCascader_') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param,this);
        //                 if (method == 'getValue') {
        //                     return this.$refs[treeId] ? this.$refs[treeId].getValue() : undefined;
        //                 } else if (method == 'setValue') {
        //                     if (this.$refs[treeId]) this.$refs[treeId].setValue(param);
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('fApi_') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param);

        //                 if (method == 'send') {
        //                     //console.log('callMethod.$refs[%s]',treeId,$refs[treeId]);
        //                     //return $refs[treeId]?$refs[treeId].input.value:undefined;
        //                     let apiProps = $refs[treeId];
        //                     let sendParam = {
        //                         method: param.method ? param.method : apiProps.method,
        //                         dataType: param.dataType ? param.dataType : apiProps.dataType,
        //                         url: param.url ? param.url : apiProps.url,
        //                         header: param.headers ? param.headers : apiProps.headers,
        //                         body: param.body,
        //                     }

        //                     //console.log('sendParam:',sendParam);

        //                     if (sendParam.method == 'post' && sendParam.dataType == 'json')

        //                         //console.log('apiPost:',sendParam);
        //                         Api.apiPost({
        //                             url: sendParam.url,
        //                             param: sendParam.body,
        //                             success: param.success,
        //                             fail: param.fail
        //                         })
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('jsFunc_') > -1) {
        //         return {
        //             callSync: (param, callback) => {
        //                 //console.log(treeId+'.call','.param',param);
        //                 //return this.$refs[treeId] ? this.$refs[treeId](param, callback) : undefined;
        //                 if (this.getThis().$refs[treeId]) {
        //                     return this.getThis().$refs[treeId](param, callback);
        //                 } else {
        //                     //console.log(treeId+'.callMethod','.method',method,'.param',param,'.this.$refs[treeId] 不存在');
        //                     console.log(treeId + '不存在，请检查是否未加载就先调用了');
        //                     return undefined;
        //                 }
        //             },
        //             call: (param) => {
        //                 //console.log(treeId+'.call','.param',param);
        //                 return new Promise((resolve, reject) => {
        //                     if (this.getThis().$refs[treeId]) {
        //                         const _callback = (res) => {
        //                             resolve(res);
        //                         }
        //                         this.getThis().$refs[treeId](param, _callback);
        //                     } else {
        //                         //console.log(treeId+'.callMethod','.method',method,'.param',param,'.this.$refs[treeId] 不存在');
        //                         console.log(treeId + '不存在，请检查是否未加载就先调用了');
        //                         reject(undefined);
        //                     }
        //                 })
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('page_func') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param,this,this.getThis());




        //                 if (method == 'navigate') {


        //                     //let _this = getPlayerThis(this);

        //                     //console.log(treeId + 'getPlayerThis',getPlayerThis(this).navigateTo,_this.navigateTo);

        //                     //_this.setWebTitle(param.path);
        //                     /* if (_this.navigateTo) {
        //                       _this.navigateTo(param.path);
        //                     } else {
        //                       console.log('navigateTo不存在', _this, param.path);
        //                     } */
        //                     /* function objectToQueryString(obj) {
        //                         let queryArr = Object.keys(obj);
        //                         if (Array.isArray(queryArr)) {
        //                             return '?' + queryArr.map(key => key + '=' + encodeURIComponent(obj[key])).join('&');
        //                         }
        //                         return ''
        //                     } */

        //                     function objectToQueryString(obj) {
        //                         let queryArr = Object.keys(obj);
        //                         if (Array.isArray(queryArr)) {
        //                             return '?' + queryArr.map(key => key + '=' + encodeURIComponent(obj[key])).join('&');
        //                         }
        //                         return ''
        //                     }

        //                     let query = {
        //                         ...param.query
        //                     }
        //                     //Taro.navigateTo({ url: `/route/index?_=#${param.path}${objectToQueryString(query)}` })
        //                     let url = `${param.path}${objectToQueryString(query)}`
        //                     playerEventEmitter.emit('ON_NAVIGATE', url);

        //                 }
        //                 else if (method == 'openNew') {
        //                     window.open(param, "_blank");
        //                 }
        //                 else if (method == 'getHost') {
        //                     return window.location.protocol + '//' + window.location.host;
        //                 }
        //                 else if (method == 'getFirstHost') {
        //                     return window.location.host.split('.').slice(-2).join('.');
        //                 }
        //                 else if (method == 'getHostname') {
        //                     return window.location.host;
        //                 }
        //                 else if (method == 'getUrlParams') {
        //                     var getUrlParams = (url) => {
        //                         let urlStr = url.split('?')[1]
        //                         const urlSearchParams = new URLSearchParams(urlStr)
        //                         const result = Object.fromEntries(urlSearchParams.entries())
        //                         if (param) return result[param];
        //                         else return result;
        //                     }
        //                     return getUrlParams(window.location.href);
        //                 }
        //                 else if (method == 'setSiteTitle') {
        //                     return document.title = param;
        //                 }
        //                 else if (method === 'isMobile') {
        //                     //console.log('IS_MOBILE',getStore('IS_MOBILE'));
        //                     return getStore('IS_MOBILE');
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('message_func') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param,getPlayerThis(this));
        //                 if (['success', 'error', 'warning', 'loading'].indexOf(method) > -1) {
        //                     //getPlayerThis(this).messageShow(method, param);
        //                     if (typeof param === 'string') {
        //                         playerEventEmitter.emit('SHOW_MESSAGE', {
        //                             type: method,
        //                             content: param
        //                         });
        //                     } else if (typeof param === 'object') {
        //                         playerEventEmitter.emit('SHOW_MESSAGE', {
        //                             type: method,
        //                             ...param
        //                         });
        //                     }
        //                 }
        //                 else console.log(treeId + `的method传参仅限success/error/warning/loading`);
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('date_func') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param);
        //                 if (method == 'timestamp2YMDHIS') {
        //                     return (new Date(param * 1000)).Format("yyyy-MM-dd hh:mm:ss")
        //                 }
        //                 else if (method == 'getNowMicroTime') {
        //                     return (new Date().getTime());
        //                 }
        //                 else if (method == 'dayjs') {
        //                     return dayjs;
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('fEvent_') > -1) {
        //         return {
        //             call: (param) => {
        //                 //console.log(treeId+'.call','.param',param,this);
        //                 //return $refs[treeId]?$refs[treeId](param,callback):undefined;
        //                 // let props = this.props;
        //                 let props = this.getProps();
        //                 if (props.hasOwnProperty(treeId)) props[treeId](param);
        //                 else {
        //                     //console.log(treeId+'.call.props',props,this);
        //                     console.log(treeId + '不存在，请检查');
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('text_') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 console.log(treeId + '.callMethod' + '.', method, '.param', param);
        //                 if (method == 'setValue') {
        //                     $refs[treeId].children[0].innerHTML = param;
        //                     //console.log('callMethod.$refs[%s]',treeId,$refs[treeId].children[0]);
        //                 }
        //                 else if (method == 'getValue') {
        //                     return $refs[treeId].children[0].innerHTML;
        //                     //console.log('callMethod.$refs[%s]',treeId,$refs[treeId].children[0]);
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('aMenu_') > -1 || treeId.toLowerCase().indexOf('menu_') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param,this);
        //                 //console.log('callMethod.$refs[%s]',treeId,$refs[treeId]);
        //                 if (method == 'setCurrent') this.$refs[treeId].setCurrent(param);
        //                 else if (method == 'setItems') this.$refs[treeId].setItems(param);
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('fComponent_') > -1) {
        //         return {
        //             callMethod: (method, param, callback) => {
        //                 //console.log(treeId+'.callMethod','.method',method,'.param',param,'.$refs',this.$refs,'.this',this);
        //                 if (this.$refs[treeId]) {
        //                     const _callback = (res) => {
        //                         if (typeof callback === 'function') callback(res);
        //                     }
        //                     return this.$refs[treeId].callMethod({ method, param, callback: _callback });
        //                 }
        //                 else {
        //                     console.log(treeId + '.callMethod', '.method', method, '.param', param, '.this.$refs[treeId] 不存在', this);
        //                     console.log(treeId + '不存在，请检查是否未加载就先调用了');
        //                     return undefined;
        //                 }
        //             },
        //             callMethodSync: (method, param) => {
        //                 //console.log(treeId+'.callMethod','.method',method,'.param',param,'.$refs',this.$refs,'.this',this);

        //                 return new Promise((resolve, reject) => {
        //                     if (this.$refs[treeId]) {
        //                         const _callback = (res) => {
        //                             resolve(res);
        //                         }
        //                         this.$refs[treeId].callMethod({ method, param, callback: _callback });
        //                     } else {
        //                         //console.log(treeId+'.callMethod','.method',method,'.param',param,'.this.$refs[treeId] 不存在');
        //                         console.log(treeId + '不存在，请检查是否未加载就先调用了');
        //                         reject(undefined);
        //                     }
        //                 })


        //             },
        //         }
        //     }
        //     else if (treeId.indexOf('nInput_') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 console.log(treeId + '.callMethod' + '.', method, '.param', param);
        //                 //if(method == 'get')return $refs[treeId]?$refs[treeId]:param.default;
        //                 if (method == 'getValue') {
        //                     //console.log('callMethod.$refs[%s]',treeId,$refs[treeId],$refs[treeId].value);
        //                     return $refs[treeId] ? $refs[treeId].value : undefined;
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('fNode_') > -1) {
        //         return {
        //             call: (param = {}) => {
        //                 //console.log(treeId+'.call',param,this);
        //                 // if (param !== undefined) {
        //                 //     return this.getFNodeItemNode({ treeId, item: param });
        //                 // } else {
        //                 //     return this.outputTreeArr($refs, this.state.gData, treeId);
        //                 // }
        //                 //return this.getFNodeItemNode({ treeId, item: param });
        //                 return <FNodeItemNode d8dprops={{ _this: this, treeId, item: param }} />;
        //             },
        //             callMethod: (method, param, callback) => {

        //                 // if(treeId === 'fNode_XzB8XWNB52')
        //                 //     console.log(treeId + '.callMethod', this.getContext(), this);

        //                 // if(treeId === 'fNode_YCphkinSn3')
        //                 //     console.log(treeId + '.callMethod', this.getContext(), this);

        //                 let fNodeItem = this.getContext('fNodeItem') || {};
        //                 let val = fNodeItem[treeId] || [];

        //                 if (method == 'getItem') {
        //                     return val;
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('string_func') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.' + method,param);

        //                 if (method == 'randomString') {
        //                     var randomString = function ({ length, type }) {
        //                         if (type === 'number')
        //                             var str = '0123456789';
        //                         else
        //                             var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        //                         var result = '';
        //                         for (var i = length; i > 0; --i)
        //                             result += str[Math.floor(Math.random() * str.length)];
        //                         return result;
        //                     }
        //                     return randomString(param);
        //                 }
        //             }
        //         }

        //     }
        //     else if (treeId.indexOf('store_func') > -1) {
        //         return {
        //             callMethod: (method, param) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param);
        //                 if (method == 'set') {
        //                     return userSetStore(param.key, param.value);
        //                 }
        //                 else if (method == 'get') {
        //                     return userGetStore(param.key);
        //                 }
        //                 else if (method == 'subscribe') {
        //                     return UserStore.subscribe(param.callback);
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('module_func') > -1) {
        //         return {
        //             callMethod: (method, param, callback) => {
        //                 //console.log(treeId+'.callMethod' + '.',method,'.param',param);
        //                 if (method == 'import') {
        //                     // if(param == 'xlsx'){
        //                     //     import('xlsx/xlsx.mjs').then((module) => {
        //                     //         //const MobilePlayer = module.default;
        //                     //         console.log('module_func.xlsx', module);
        //                     //         if(typeof callback === 'function')callback(module);
        //                     //     });
        //                     // }
        //                     // else if(param == 'axios'){
        //                     //     return import('axios');
        //                     // }
        //                     // else if(param == 'file-saver'){
        //                     //     return import('file-saver');
        //                     // }
        //                     if (param == 'axios') {
        //                         return import('axios');
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     else if (treeId.indexOf('service_') > -1) {
        //         return {
        //             call: (param, callback = {}) => {
        //                 //console.log(treeId+'.call','.param',param);
        //                 return new Promise((resolve, reject) => {
        //                     const success = (res) => {
        //                         resolve(res);
        //                         if (typeof callback.success === 'function') callback.success(res);
        //                     }
        //                     const fail = (err) => {
        //                         reject(err);
        //                         if (typeof callback.fail === 'function') callback.fail(err);
        //                     }
        //                     Api.apiPost({
        //                         url: `${CONFIG.PRE_API_HOST}/api/${getStore('APP_ID')}/${treeId}`,
        //                         param: param,
        //                         success,
        //                         fail
        //                     })
        //                 })

        //             }
        //         }
        //     }
        // };

        const F = _F.bind(this);

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
        // let frontCode = moduleObj.children || [];
        let frontCode = [moduleObj];

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
            else if (name.includes('nativeType') && props.hasOwnProperty(name) && props[name] !== undefined) eleProps[name] = props[name];
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


    getAImageProps(eleProps) {
        if (eleProps.hasOwnProperty('src')) {
            //console.log('getAImageProps',eleProps);
            let src = eleProps.src;
            const hasHttpOrHttps = function (url = '') {
                return url.includes('http://') || url.includes('https://');
            }

            src = hasHttpOrHttps(src) ? src : OSS_HOST + src;
            eleProps.src = src;
        }

        if (!eleProps.hasOwnProperty('preview')) eleProps.preview = false;

        if (!eleProps.hasOwnProperty('placeholder')) eleProps.placeholder = false;

        return eleProps;
    }

    getImgProps(eleProps) {
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

    outputNodes(treeCode) {
        //let treeCode = [...this.state.gData];
        //console.log('treeCode', treeCode)
        treeCode = JSON.parse(JSON.stringify(treeCode));

        const findChild = (tree) => {
            if (typeof tree === 'string') return tree;
            if (typeof tree === 'object' && !Array.isArray(tree)) { tree = [tree]; }

            // console.log('tree', tree);

            let output = [];
            for (let index = 0; index < tree.length; index++) {
                const element = tree[index];

                const $refs = {};
                let treeId = element.id;
                let type = element.type;
                type = type.toLowerCase();
                let props = element.props || {};

                if (props?.key) treeId = props?.key;

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
                        // console.log('findChild.treeId', treeId, element)
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
                        // src = ['http', 'https'].indexOf(src) > -1 ? src : OSS_HOST + src;
                        src = hasHttpOrHttps(src) ? src : OSS_HOST + src;
                        style.backgroundImage = `url(${src})`;
                    }
                }

                output = getEleNode({ _this: this, $refs, treeId, style, props, child, findChild, type, output });

                // if (type == 'front') output.push(<ChildComponent key={treeId} treeId={treeId} child={child} />);
                // else if (type == 'dom') output.push(<ChildComponent key={treeId} treeId={treeId} child={child} />);
                // else if (type == 'group') output.push(<ChildComponent key={treeId} treeId={treeId} child={child} />);
                // else if (type === "stylecss") output.push(this.getStyleCssNode({ $refs, treeId, style, props, child }));
                // else if (type == 'fchild') output.push(<FChildNode key={treeId} {...{ _this: this, $refs, treeId, props }} />);
                // else if (type == 'routes' || type == 'pageContainer') output.push(this.getRoutesNode({ $refs, treeId, props, child }));
                // else if (type == 'route' || type == 'page') output.push(this.getRouteNode({ $refs, treeId, props, child: () => { return findChild(props.element) } }));
                // else if (type.indexOf("component") > -1) output.push(<FComponentNode key={treeId} {...{ _this: this, $refs, treeId, props, child }} />);
                // else if (type === "if") output.push(<IfNode key={treeId} {...{ _this: this, $refs, treeId, props, child }} />);
                // else if (type === "for") output.push(<ForNode key={treeId} d8dprops={{ _this: this, $refs, treeId, props, child }} />);

                // else if (type === "form") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Form }));
                // else if (type === "form.item") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Form.Item }));
                // else if (type === "inputnumber") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: InputNumber }));
                // else if (type === "input") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Input }));
                // else if (type === "textarea") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: TextArea }));
                // else if (type === "picker") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Picker }));
                // else if (type === "switch") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Switch }));
                // else if (type === "button") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Button }));
                // else if (type === "row") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Row}));
                // else if (type === "col") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Col }));
                // else if (type === "grid") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Grid }));
                // else if (type === "grid.item") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Grid.Item }));
                // else if (type === "img") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: 'img', elePropsCallback: this.getImgProps.bind(this) }));
                // else if (type === "image") output.push(this.getACommonNode({ $refs: null, treeId, style, props, Element: Image, elePropsCallback: this.getAImageProps.bind(this) }));
                // else if (type === "div") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'div' }));
                // else if (type === "span") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'span' }));
                // else if (type === "h1") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h1' }));
                // else if (type === "h2") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h2' }));
                // else if (type === "h3") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h3' }));
                // else if (type === "h4") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h4' }));
                // else if (type === "h5") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: 'h5' }));
                // else if (type === "menu") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: AMenu }));
                // else if (type === "card") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Card }));
                // else if (type === "table") output.push(this.getACommonNode({ $refs: null, treeId, style, props, Element: Table }));
                // else if (type === "virtualList") output.push(this.getACommonNode({ $refs: null, treeId, style, props, Element: VirtualList }));
                // else if (type === "list.item.meta") output.push(this.getACommonNode({ $refs: null, treeId, style, props, Element: List.Item.Meta }));
                // else if (type === "radio") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Radio }));
                // else if (type === "radio.group" || type === "radiogroup") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Radio.Group }));
                // else if (type === "checkbox") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Checkbox }));
                // else if (type === "checkbox.group" || type === "checkbox.group") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Checkbox.Group }));
                // else if (type === "datepicker") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Datepicker }));
                // else if (type === "uploader") output.push(this.getAUploadNode({ $refs, treeId, style, props, child }));
                // else if (type === "calendar") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Calendar }));
                // else if (type === "configprovider") output.push(this.getAConfigNode({ $refs, treeId, style, props, child }));
                // else if (type === "tabs") output.push(this.getACommonNode({ $refs:null, treeId, style, props, Element: Tabs }));
                // else if (type === "range") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Range }));
                // else if (type === "badge") output.push(this.getACommonNode({ $refs, treeId, style, props, child, Element: Badge }));
                // else if (type === "progress") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Progress }));
                // else if (type === "divider") output.push(this.getACommonNode({ $refs, treeId, style, props, Element: Divider }));
                // else if (type === "dialog") output.push(<ADialogNode key={treeId} {...{ _this: this, $refs, treeId, style, props, child }} />);
                // else if (type === "popup") output.push(<APopupNode key={treeId} {...{ _this: this, $refs, treeId, style, props, child }} />);
                // else if (type === "swiper") output.push(this.getACommonNode({ $refs: null, treeId, style, props, child, Element: Swiper  }));

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


class FNodeComponent extends UICommon {
    static contextType = GlobalContext;
    constructor(props) {
        super(props);
        // console.log('FNodeComponent', props.children)

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
        // console.log('render',this.outputNodes(this.props.treeCode));
        const children = this.outputNodes(this.props.treeCode);
        if (this.props.hasOwnProperty('onOutputNodes')) this.props.onOutputNodes(children);
        return children;
        // return null;
    }
}

class DComponent extends UICommon {
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

        const flatTree = flattenTree(appCode);

        this.setState({ gData: flatTree });

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

class Player extends UICommon {
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

    updateRnd() {
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

            playerEventEmitter.on('IS_MOBILE_CHANGE', this.updateRnd.bind(this));
        }

    }

    componentWillUnmount() {
        playerEventEmitter.off('DEBUG_JS_FUN', this.debugJsFuncCode.bind(this));

        playerEventEmitter.off('UPDATE_APP_CODE', this.updateAppCode.bind(this));

        playerEventEmitter.off('IS_MOBILE_CHANGE', this.updateRnd.bind(this));

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
        let output = (
            <ConfigProvider
                locale={zhCN}
                theme={{
                    nutuiBrandColor: '#1677ff',
                    nutuiBrandColorStart: '#1677ff',
                    nutuiBrandColorEnd: '#1677ff',
                    nutuiColDefaultMarginBottom: '0px',
                }}
            >
                <HashRouter>
                    {this.getOutputNode()}
                </HashRouter>
            </ConfigProvider>
        );
        if (getStore('IN_EDITOR') && !getStore('IS_MOBILE')) {
            output = (
                <Row type="flex" justify="center" align="center" style={{ height: '100vh', background: '#1f1f1f' }}>
                    <Col style={{ width: '375px', height: '812px', background: '#fff' }}>{output}</Col>
                </Row>
            )

        }
        return (
            <React.Fragment>
                {output}
            </React.Fragment>
        );
    }
}


const AppHook = (props) => {
    //const { message, notification, modal } = App.useApp();
    const isMobile = useMediaQuery({ maxWidth: 767 });


    //console.log('useMediaQuery.IS_MOBILE',isMobile);

    const onMessage = (options) => {
        //message.open(options);
        let type = options.type;  //primary，success ，danger，warning
        if (type === 'warning') type = 'warn';
        if (type === 'error') type = 'danger';

        Notify[type](options.content, { ...options });
    }

    useEffect(() => {
        setStore('IS_MOBILE', isMobile);
        playerEventEmitter.emit('IS_MOBILE_CHANGE', isMobile);
    }, [isMobile]);

    useEffect(() => {
        playerEventEmitter.on('SHOW_MESSAGE', onMessage);
        return () => {
            playerEventEmitter.off('SHOW_MESSAGE', onMessage);
        };
    }, []);
    return (
        <></>
    )
}

const withModal = (WrappedComponent) => {
    return React.forwardRef((props, ref) => {


        return (
            <>
                <WrappedComponent ref={ref} {...props} />
                <AppHook />
            </>
        );


    });
};

export default withModal(Player);
