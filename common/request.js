const Constants = require('./constants')

let isLogining = false
let session = wx.getStorageSync(Constants.STORAGE_KEY.SESSION) || {
    expire: 0,
    sidTicket: '',
    dataTicket: '',
    fakeId: '',
}

// export function badjs(type, msg) {
//     if (typeof msg === 'object') {
//         msg = JSON.stringify(msg)
//     }

//     wx.request({
//         url: 'https://badjs.weixinbridge.com/badjs',
//         method: 'GET',
//         data: {
//             id: 141,
//             level: 4,
//             uin: session.fakeId,
//             from: 'weapp',
//             msg: `[${type}]${msg}`,
//         }
//     })
// }

// // 监控
// export function monitor(key) {
//     wx.request({
//         url: 'https://mp.weixin.qq.com/mp/jsmonitor?idkey=27826_' + key + '_100',
//         method: 'GET'
//     })
// }

const dealUrl = (url) => {
    if (/^\/[^\/].*/.test(url)) { // 单个斜杠开头的链接表示是mp内部链接
        url = `${Constants.CGI_DOMAIN}${url}`;
    }

    return url
}

function addQueryString(url, key, val) {
    return `${url}${url.indexOf('?') > -1 ? '&' : '?'}${key}=${val}`
}

function updateSession(data = {}) {
    session = {
        expire: data._sid_expire, // Date.now() + data.maxAge * 60 * 60 * 1000,
        sidTicket: data._sid_ticket,
        dataTicket: data._data_ticket,
        fakeId: data._fake_id,
    };

    wx.setStorageSync(Constants.STORAGE_KEY.SESSION, session);
}

export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            success(res = {}) {
                if (res.code) {
                    console.log('wx.login', res.code);
                    resolve(res.code)
                } else {
                    // LYS 上报 重试
                    console.error('获取用户登录态失败！' + res.errMsg)
                    reject(res)
                }
            },
            fail(res = {}) {
                reject(res)
            }
        })
    })
}

export const checkSession = () => {
    return new Promise((resolve, reject) => {
        wx.checkSession({
            success() {
                resolve()
            },
            fail() {
                reject()
            }
        })
    })
}

/**
 * 封装wx.request，参数基本一样
 * 只是将网络非200和retcode非0的情况也触发fail
 * @param options
 * @param code
 */
const doRequest = (options = {}, code) => {
    if (options.showLoading) {
        wx.showLoading({
            mask: options.loadingMask || true,
            title: options.loadingTitle || '加载中',
        })
    }

    return new Promise((resolve, reject) => {
        let url = dealUrl(options.url)
        if (code) {
            url = addQueryString(url, '_code', code)
        } else {
            url = addQueryString(url, '_fake_id', session.fakeId || '')
            url = addQueryString(url, '_data_ticket', session.dataTicket || '')
            url = addQueryString(url, '_sid_ticket', session.sidTicket || '')
        }

        const method = options.method || 'GET'
        // const rejectWrap = (data, reportData) => {
        //     badjs('cgi_fail', {
        //         url,
        //         method,
        //         data: options.data,
        //         ...reportData,
        //     });
        //     return reject(data)
        // }

        wx.request({
            url: url,
            data: options.data,
            method,
            dataType: options.dataType || 'json',
            header: options.header,
            success(res = {}) {
                const {
                    statusCode,
                    data = {}
                } = res
                const { base = {} } = data
                const { ret, session } = base

                if (statusCode >= 200 || statusCode < 400) {
                    if (ret === 0) {
                        updateSession(session);
                        console.log(`[ok]${url}:`, data);
                        resolve(data)
                    } else if (ret === Constants.RET_CODE.SESSION_EXPIRE) {
                        // LYS 重试啊这里要
                        updateSession({ _sid_expire: 0 });
                    } else {
                        updateSession(session);
                        console.log(`[fail]${url}:`, data);
                        // rejectWrap(data, {
                        //     status_code: statusCode,
                        //     retcode: ret
                        // })
                    }
                } else {
                    console.log(`[err]${url}:`, data);
                    wx.showLoading({
                        title: '系统繁忙',
                    })
                    // rejectWrap(data, {
                    //     status_code: statusCode,
                    //     retcode: ret
                    // })
                }
            },
            fail(err = {}) {
                console.log(`[err]${url}:`, err);
                wx.showLoading({
                    title: '系统繁忙',
                })
                // rejectWrap(err, {
                //     status_code: -1,
                //     retcode: -1
                // })
            },
            complete() {
                options.showLoading && wx.hideLoading()
            },
        })
    })
}

const doUploadFile = (options = {}, code) => {
    if (options.showLoading) {
        wx.showLoading({
            mask: options.loadingMask || true,
            title: options.loadingTitle || '加载中',
        })
    }

    return new Promise((resolve, reject) => {
        let url = dealUrl(options.url)
        if (code) {
            url = addQueryString(url, '_code', code)
        } else {
            url = addQueryString(url, '_fake_id', session.fakeId || '')
            url = addQueryString(url, '_data_ticket', session.dataTicket || '')
            url = addQueryString(url, '_sid_ticket', session.sidTicket || '')
        }

        // const rejectWrap = (data, reportData) => {
        //     badjs('upload_fail', {
        //         url,
        //         ...reportData,
        //     });
        //     return reject(data)
        // }

        wx.uploadFile({
            url: url,
            filePath: options.filePath,
            name: options.name || 'upfile',
            header: options.header,
            formData: options.formData,
            success(res = {}) {
                console.log('wx.uploadFile success:', res);
                const {
                    statusCode,
                } = res
                let data = res.data || {} // 这里要手动parse
                try {
                    data = JSON.parse(res.data || '')
                } catch (e) {
                    console.error(e);
                }
                const { base = {} } = data
                const { ret, session } = base

                console.log('wx.uploadFile:', data);

                if (statusCode >= 200 || statusCode < 400) {
                    if (ret === 0) {
                        updateSession(session);
                        resolve(data)
                    } else if (ret === Constants.RET_CODE.SESSION_EXPIRE) {
                        updateSession({ _sid_expire: 0 });
                    } else {
                        updateSession(session);
                        // rejectWrap(data, {
                        //     status_code: statusCode,
                        //     retcode: ret
                        // })
                    }
                } else {
                    // rejectWrap(data, {
                    //     status_code: statusCode,
                    //     retcode: ret
                    // })
                }
            },
            fail(err = {}) {
                console.error(`wx.request fail`, err)
                // rejectWrap(err, {
                //     status_code: -1,
                //     retcode: -1
                // })
            },
            complete() {
                options.showLoading && wx.hideLoading()
            },
        })
    })
}

export const request = (options = {}) => {
    if (session.fakeId && session.sidTicket && session.dataTicket && session.expire && session.expire * 1000 > Date.now()) {
        return doRequest(options)
    }

    return login().then(code => {
        return doRequest(options, code)
    });
}

export const uploadFile = (options = {}) => {
    if (session.fakeId && session.sidTicket && session.dataTicket && session.expire && session.expire * 1000 > Date.now()) {
        return doUploadFile(options)
    }

    return login().then(code => {
        return doUploadFile(options, code)
    });
}