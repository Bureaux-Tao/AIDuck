var fundebug = require('../../libs/fundebug.0.8.2.min.js')
var sha256 = require('../../utils/sha256');
var plugin = requirePlugin("WechatSI")
// var uuid = require('../../utils/uuid')
fundebug.init(
    {
        apikey: "5811e8c7dc9ee21a8380a27164f5d73c6eafbe574f6bdea8f89b7d1aba7c918f",
        silentInject: true
    })

var utilMd5 = require('../../utils/md5utf-8.js')
var lang = ""
Page({

    /**
     * 页面的初始数据
     */
    data: {
        Text: "",
        int: 0,
        autoHeight: true,
        src: "",
        array: ['中文', '英文', '日文', '韩文', '法文', '俄文', '葡萄牙文', '西班牙文', '越南文'],
        index: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        wx.getStorage({
            key: 'strWithN',
            success: function(res) {
                console.log(res);
                that.setData({
                    Text: res.data
                })
            },
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        wx.navigateBack({
            delta: 2
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    Copy: function() {
        var that = this
        wx.setClipboardData({
            data: that.data.Text,
        })
    },

    Erase: function() {
        var that = this
        wx.getStorage({
            key: 'strWithoutN',
            success: function(res) {
                console.log(res);
                that.setData({
                    Text: res.data
                })
            },
        })
    },

    bindTrans: function(e) {
        wx.showActionSheet({
            itemList: ['中文 → 英文', '英文 → 中文'],
            success: (e)=> {
                if (e.tapIndex == 0) {
                    this.Translate(this.data.Text,"zh_CN","en_US")
                }
                if (e.tapIndex == 1) {
                    this.Translate(this.data.Text,"en_US","zh_CN")
                }
            }
        })
    },

    Check: function() {
        var that = this
        if (that.data.autoHeight == true) {
            that.setData({
                autoHeight: false
            })
            wx.getStorage({
                key: 'pic',
                success: function(res) {
                    that.setData({
                        src: res.data,
                    })
                },
            })
        } else {
            that.setData({
                autoHeight: true
            })
        }
    },

    Undo: function() {
        var that = this
        wx.getStorage({
            key: 'strWithN',
            success: function(res) {
                console.log(res);
                that.setData({
                    Text: res.data
                })
            },
        })
    },

    OK: function(event) {
        console.log(event);
        var mod = event.detail.value
        console.log("OK");
        this.setData({
            Text: mod
        })
        console.log(this.data.Text);
    },

    Translate: function(trans,from_lang ,to_lang) {
        wx.showLoading({
            title: '翻译中...',
            mask:true
        })
        plugin.translate({
            lfrom:from_lang,
            lto:to_lang,
            content:trans,
            success: (res)=> {
                if(res.retcode == 0) {
                    console.log("result", res.result)
                    this.setData({
                        Text: res.result
                    })
                } else {
                    console.warn("翻译失败", res)
                }
                wx.hideLoading()
            },
            fail:(res) =>{
                console.log("网络失败",res)
                wx.showToast({
                    title: "无网络连接",
                    icon: 'success',
                    image: '/images/icons8-fail.png',
                    duration: 1000,
                    success: function(res) {

                    },
                    fail: function(res) {
                        console.log(res);
                    }
                });
                wx.hideLoading()
            }
        })
    },

})