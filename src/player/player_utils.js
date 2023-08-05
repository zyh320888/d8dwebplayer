export function getPathAppId() {
    var str = window.location.href;
    var regexp = /\/play\/(\d+)/;
    var match = str.match(regexp);
    //console.log("getPathAppId", match);
    if (match) return match[1];
    else return null;
}

export function flattenTree(tree, pid = null) {
    if (typeof tree === 'string') return tree;
    return tree.reduce((arr, node) => {

        const id = node.id;
        const item = {
            id: node.id,
            pid: pid,
            type: node.type,
            props: node.props
        };
        arr.push(item);

        if (node.children && Array.isArray(node.children)) {
            arr.push(...flattenTree(node.children, id));
        }
        else if (node.type && node.type.toLowerCase() === 'route' && node.props.element && Array.isArray(node.props.element)) {
            arr.push(...flattenTree(node.props.element, id));
        }
        return arr;
    }, []);
}

export const loadLocalData = (key) => {
    let jsonStr = window.localStorage.getItem(key);
    let data = JSON.parse(jsonStr);
    return data;
}

export const setLocalData = (key, data) => {
    let jsonStr = JSON.stringify(data);
    window.localStorage.setItem(key, jsonStr);
};

export const delLocalData = (key) => {
    window.localStorage.removeItem(key);
}

export const findNodeById = (id, tree) => {
    for (var i = 0; i < tree.length; i++) {
        // try {

        // } catch (error) {
        //     console.log(`${tree[i].id} props.element不存在`,tree[i])
        //     return null;
        // }
        
        if (tree[i].id === id) {
            return tree[i];
        }
        if (tree[i].children) {
            var result = findNodeById(id, tree[i].children);
            if (result) {
                return result;
            }
        }
        else if (tree[i].props && tree[i].props.element) {
            var result = findNodeById(id, tree[i].props.element);
            if (result) {
                return result;
            }
        }
    }
    return null;
}

export function filterObjectByProperty(obj, prop) {
    obj = { ...obj };
    const filteredObj = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && key !== prop) {
            filteredObj[key] = obj[key];
        }
    }
    return filteredObj;
}

export function getFrontCode(appCode = []) {
    let moduleObj = appCode.find(item => item.type === 'front') || {};
    //console.log('frontCodeHandler', appCode);
    // return moduleObj.children || [];
    return [moduleObj];
}

export function  hasHttpOrHttps (url = '') {
    return url.includes('http://') || url.includes('https://');
}