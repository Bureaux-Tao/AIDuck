var utilMd5 = require('../../utils/md5utf-8.js');
// var CusBase64 = require('../../utils/base64.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      picUrl:""
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

  a:function() {
      wx.chooseImage({
          success: (res) => {
              console.log(res);
              var that = this;
              var exitedFilePaths = that.data.picUrl;
              var tempFilePaths = res.tempFilePaths;
              console.log("tempFilePaths:" + tempFilePaths);
              that.setData({
                  picUrl:tempFilePaths
              })
          },
      })
  },

  ocr:function() {
      var base64 
      var that = this
      console.log(that.data.picUrl);
      var a = wx.getFileSystemManager()
      a.readFile({
          filePath: that.data.picUrl[0],
          encoding: "base64",
          success: (res) => {
              console.log(res);
              base64 = res.data
          }, fail: (res) => {
              console.log(res);
          }, complete: (res) => { }
      })

      var q = base64
      var appKey = "2268fb84807c3cb9"
      var salt = (new Date).getTime().toString();
      var secretKey = "T8obk3yVw6rfJypPVV0mU75k8iNkRucf"
      var password = utilMd5.md5(appKey + q + salt + secretKey)
      password = password.toUpperCase();
      console.log("md5:"+password);
      console.log(password);

      wx.request({
          url: 'https://openapi.youdao.com/ocrapi',
          method:"POST",
          data: {
              img: encodeURI(q),
              langType:"en",
              detectType:"10012",
              imageType:"1",
              appKey:appKey,
              salt:salt,
              sign:password,
              docType:"json"
          },
          success: (res) => {
              console.log(res);
          }, fail: (res) => {
              console.log(res);
          }, complete: (res) => { }
      })

    // wx.request({
    //     url: 'http://wordimg.market.alicloudapi.com/word',
    //     header:{
    //         "Host":"wordimg.market.alicloudapi.com",
    //         "X-Ca-Timestamp":this.createTimeStamp(),
    //         "gateway_channel": "http",
    //         "X-Ca-Request-Mode": "debug",
    //         "X-Ca-Key": "25047184",
    //         "X-Ca-Stage": "RELEASE",
    //         "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    //         "X-Ca-Signature-Headers": "X-Ca-Timestamp,X-Ca-Request-Mode,X-Ca-Key,X-Ca-Stage",
    //         "Signature":"TiGckp+lTTw5JFC/VRl9RwmPhaMu+LahcMvbFsMPllM="
    //     },
    //     method:"POST",
    //     data:{
    //         "image":that.data.picUrl[0]
    //     },
    //     success:(res)=> {
    //         console.log(res);
    //     },fail:(res)=> {
    //         console.log(res);
    //     },complete:(res)=>{}
    // })
  },
    
    createTimeStamp: function () {
        return parseInt(new Date().getTime() / 1000) + ''
    },
})