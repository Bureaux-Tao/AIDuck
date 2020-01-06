var utilMd5 = require('../../utils/md5utf-8.js');
// var CusBase64 = require('../../utils/base64.js');
var access_token = ""
const bgm = wx.createInnerAudioContext()
bgm.src = '/audios/switch.mp3';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        picUrl: "",
        isHand: false,
        bt: false,
        btn: "/images/button-un.png",
        swit: "/images/switch_left.png",
        image: "https://ws1.sinaimg.cn/large/8e278454gy1fvf850412pj20ir0rsh3i.jpg"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.setStorage({
            key: 'isHand',
            data: this.data.isHand,
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    a: function () {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            success: (res) => {
                //   console.log(res);
                var that = this;
                var exitedFilePaths = that.data.picUrl;
                var tempFilePaths = res.tempFilePaths;
                console.log("tempFilePaths:" + tempFilePaths);
                that.setData({
                    picUrl: tempFilePaths,
                    image: tempFilePaths
                })
                wx.setStorage({
                    key: 'pic',
                    data: that.data.image,
                })
                wx.navigateTo({
                    url: '/pages/cropper/cropper',
                })
            },
        })
    },

    btntap: function () {
        var that = this
        bgm.play()
        wx.vibrateShort({
            success: (res) => {
                console.log(res);
            },
            fail: (res) => {
                console.log(res);
            },
            complete: (res) => { }
        })
        that.setData({
            btn: "/images/button.png"
        })
        setTimeout(function () {
            //要延时执行的代码
            that.setData({
                btn: "/images/button-un.png"
            })
            that.a()
        }, 200)
    },

    swi: function () {
        var that = this
        bgm.play()
        wx.vibrateShort({
            success: (res) => {
                console.log(res);
            },
            fail: (res) => {
                console.log(res);
            },
            complete: (res) => { }
        })
        if (that.data.isHand == true) {
            that.setData({
                swit: '/images/switch_left.png',
                isHand: false
            })
        } else {
            that.setData({
                swit: '/images/switch_right.png',
                isHand: true
            })
        }
        wx.setStorage({
            key: 'isHand',
            data: that.data.isHand,
        })
    }
})