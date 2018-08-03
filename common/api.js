function promisify(fn) {
  return function (options = {}) {
    return new Promise((resolve, reject) => {
      options.success = function (res = {}) {
        resolve(res)
      }

      options.fail = function (err = {}) {
        reject(err)
      }

      fn(options)
    })
  }
}

export const getUserInfo = promisify(wx.getUserInfo)
export const navigateTo = promisify(wx.navigateTo)
export const redirectTo = promisify(wx.redirectTo)
export const navigateBack = promisify(wx.navigateBack)
export const reLaunch = promisify(wx.reLaunch)
export const chooseImage = promisify(wx.chooseImage)
export const showToast = promisify(wx.showToast)
export const showModal = promisify(wx.showModal)
export const setStorage = promisify(wx.setStorage)
export const getStorage = promisify(wx.getStorage)
export const removeStorage = promisify(wx.removeStorage)
export const getStorageInfo = promisify(wx.getStorageInfo)
export const setNavigationBarTitle = promisify(wx.setNavigationBarTitle)
export const showActionSheet = promisify(wx.showActionSheet)