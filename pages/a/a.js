const scui = require('../../utils/dist/sc-ui');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isTipShow:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.data.snackBar = scui.SnackBar("#snackbar");
        this.openSnackBar()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // setTimeout(() => {
        //     setTimeout(() => {
        //         this.setData({
        //             isTipShow: false
        //         })
        //     }, 3000)
        // }, 1000)
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        this.setData({
            isTipShow: true
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

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

    openSnackBar() {
        this.data.snackBar.open({
            message: '使用有困难? 仔细阅读设置中的使用说明哦!',   //内容
            buttonText: '打开',           //右侧button的内容，不提供不显示button
            // buttonTextColor:'red',    // button内容的颜色
            // color:'white',        // snackbar的背景颜色
            // messageColor:'black',     // 内容的颜色
            closeOnButtonClick: true,     // 是否点击button关闭snackbar

            onButtonClick: () => {
                this.tiao()
            },
            onOpen: () => {
                console.log('snackBar打开中');
            },
            onOpened() {
                console.log('snackBar已打开');
            },
            onClose() {
                console.log('snackBar关闭中');
            },
            onClosed() {
                console.log('snackBar已关闭');
            }
        });
    },

    a: function() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },

    b: function() {
        wx.switchTab({
            url: '/pages/photo/photo',
        })
    },

    c: function() {
        wx.switchTab({
            url: '/pages/logs/logs',
        })
    },

    d: function() {
        wx.switchTab({
            url: '/pages/about/about',
        })
    },

    tiao:function () {
        wx.navigateTo({
            url: '/pages/introduce/introduce',
        })
    }
})