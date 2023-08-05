import React, { Component, useState, useEffect, useContext } from "react";
import {
    Row, Col, Button, Grid, ConfigProvider, Cell, CellGroup, Image, Divider, Tabs, Picker, Checkbox, DatePicker, Form, Input, InputNumber, Menu, MenuItem, Radio, Switch, TextArea, Uploader, Badge, Dialog, Popup, Avatar, Table, Card, Price, Tag, VirtualList, Range, Swiper,SwiperItem , Notify, NavBar, Toast
} from '@nutui/nutui-react';
import '@nutui/nutui-react/dist/style.css'

const MobilePlayer = (props) => {
    // return (
    //     // <Row type="flex" justify="center" align="center" style={{ height: '100vh', background: '#1f1f1f' }}>
    //     //     <Col style={{ width: '390px', height: '844px', background: '#fff' }}>35353534</Col>
    //     // </Row>
    // )
    return (
        <Row>
            <Col span="24">
                <div className="flex-content">span:24</div>
            </Col>
        </Row>
    )
}

export default MobilePlayer;