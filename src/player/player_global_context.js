import React from 'react';

// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
// 创建1个Context对象并给定默认值，如果没有匹配到Provider，消费组件取Context默认值
export default React.createContext({
});

//export const { Provider, Consumer } = GlobalContext;
