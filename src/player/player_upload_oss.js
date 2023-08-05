import Api from './player_api';
import axios from 'axios';

let expire = 0
let accessKeyId
let policy
let signature
let host
let callback
let imgPath

// 获取policy
function getPolicy (file, filePath, changeSize, callback) {
    // 可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    let now = new Date().getTime() / 1000
    if (expire < now + 3) {

        Api.getOssPolicy({
            success:(res)=>{
                // let treeCode = data['代码对象数组'];
                // let version = data['版本号'];
                //console.log("Api.getOssPolicy",res);

                //console.log('result',expire);
                expire = res.expire
                accessKeyId = res.accessid
                policy = res.policy
                signature = res.signature
                host = res.host
                //callback = res.callback
                if (file.type.split('/')[0] === 'image') {
                    imgChange(file, filePath, changeSize, callback)
                } else {
                    callbackOss(file, filePath, callback)
                }
            },
            fail:(err)=>{
                fail(err)
            }
        })

      } else {
        if (file.type.split('/')[0] === 'image') {
            imgChange(file, filePath, changeSize, callback)
        } else {
            callbackOss(file, filePath, callback)
        }
    }
}

// 上传文件到oss
function callbackOss (fileObj, filePath, {success, fail,progress}) {
    let formData = new FormData()
    formData.append('key', filePath)
    formData.append('policy', policy)
    formData.append('OSSAccessKeyId', accessKeyId)
    formData.append('success_action_status', '200') // 让服务端返回200,不然，默认会返回204
    //formData.append('callback', callback)
    formData.append('signature', signature)
    formData.append('file', fileObj)
  
	//imgPath = host + '/' + filePath
	imgPath = '/' + filePath
  
    let config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        /* onUploadProgress: progressEvent => {
          let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
          //self.uploadMessage = '上传 ' + complete
          //console.log('上传 ' + complete);

            if (progress) {
                progress(complete)
            }
        } */
        onUploadProgress: progressEvent => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            //console.log(`Upload progress: ${percentCompleted}%`,progress);
            if (typeof progress === 'function') {
                progress(percentCompleted)
            }
        }
    }
    
    axios.post(host, formData, config)
        .then(function (result) {
            if (success) {
                success(imgPath)
            }
        }).catch(function (err){
            if (fail) {
                fail(err)
            }

        })
}

// 图片压缩函数
function imgChange (file, basePath, changeSize, callbackImg) {
    let changeSizeDefault = changeSize || '1'
    let reader = new FileReader()
    let img = new Image()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
        img.src = e.target.result
    }
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')
    img.onload = function () {
        // 图片原生尺寸
        let originWidth = this.width
        let originHeight = this.height

        canvas.width = originWidth
        canvas.height = originHeight

        context.clearRect(0, 0, originWidth, originHeight)
        context.drawImage(img, 0, 0, originWidth, originHeight)
        canvas.toBlob(function (blob) {
            callbackOss(blob, basePath, callbackImg)
        }, file.type || 'image/png', changeSizeDefault)
    }
}

/**
 * 获取文件路径
 * @method getFilePath
 * @param {object} file 文件对象
 * @param {string} basePath 基础路径
 * @return {string} filePath 文件路径
 */
function getFilePath (file, basePath) {
    let filePath = ''
    //console.log('file',file);
    //let fileExtension = getBaseExtension(file.type)
    let fileExtension = get_suffix(file.name)
    let filename = getUuid() + '.' + fileExtension
    let basePathRep = replace(basePath)
    if (basePathRep === '') {
        filePath = filename
    } else {
        filePath = basePathRep + '/' + filename
    }
    return filePath
}

// 获取文件扩展名
function getBaseExtension (fileType) {
    if (fileType === 'video/x-ms-wmv') {
        fileType = 'video/wmv' // 对wmv格式的视频文件进行处理
    }
    return fileType.split('/')[1]
}

function get_suffix(filename) {
    let pos = filename.lastIndexOf('.') + 1
    let suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

/**
 * 生成36位 uuid
 * @returns {string} uuid
 */
function getUuid () {
    let s = []
    var hexDigits = '0123456789abcdefhijkmnprstwxyz'
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    return s.join('')
}

/**
 * 格式化
 * @param str 要格式化的字符串
 * @returns {string}
 */
function replace (str) {
    let replacedStr = str
    let length = replacedStr.length
    if (str.indexOf('/') === 0) {
        if (length === 1) {
            replacedStr = ''
        } else {
            replacedStr = str.substring(1, length)
        }
        length -= 1
    }
    if (length - 1 === replacedStr.lastIndexOf('/')) {
        replacedStr = replacedStr.substring(0, length - 1)
    }
    return replacedStr
}

// 对外接口对象封装
let uploadOss = {
    imgPath: '',
    // file文件上传
    fileInit: function (file, basePath, changeSize, callback) {
        let filePath = getFilePath(file, basePath)
        //console.log('filePath',filePath);
        getPolicy(file, filePath, changeSize, callback)
    }
}

// uploadOss.fileInit(file,basePath,changeSize,()=>{
// 	//_funcCb (true, {code:200,errMsg:'ok',result:uploadOss.imgPath})
// })


export default uploadOss;