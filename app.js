//app.js

var fundebug = require('./libs/fundebug.0.8.2.min.js')
const scui = require('./utils/scui/sc-ui');
fundebug.init(
    {
        apikey: "5811e8c7dc9ee21a8380a27164f5d73c6eafbe574f6bdea8f89b7d1aba7c918f",
        silentInject: true
    })

App({
    onLaunch: function() {
        // fundebug.notify("Test", "Hello, Fundebug!")

        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
        wx.setStorage({
            key: 'engine',
            data: 'CHN_ENG',
        })
        wx.setStorage({
            key: 'isAccu',
            data: false,
        })
        wx.setStorage({
            key: 'isPTH',
            data: true,
        })
    },
    globalData: {
        userInfo: null,
        auth_record: false,
    },

    onError: function (err) {
        fundebug.notifyError(err);
    }
})