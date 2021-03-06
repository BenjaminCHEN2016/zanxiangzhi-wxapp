// pages/device/trigger.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    success: true,
    thumbs_up_count: 0,
    deviceId: null,
    activationPeriod: 5,
    errorMsg: '获取厕纸失败，请重试~'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      deviceId: options.id,
      activationPeriod: options.period,
    });
    this.activateDevice();
  },

  activateDevice: function() {
    wx.showLoading({
      title: '拼命加载中',
      mask: true
    });
    wx.request({
      url: app.config.apiServer + 'api/user/use_toilet_paper',
      method: 'GET',
      data: {
        uid: app.globalData.uid,
        api_token: app.globalData.apiToken,
        device_id: this.data.deviceId,
        period: this.data.activationPeriod,
      },
      success: res => {
        wx.hideLoading();
        var ret = res.data;
        if (ret && ret.code) {
          if (ret.code === 200) {
            this.setData({
              success: true,
              loading: false,
              thumbs_up_count: ret.data.thumbs_up_count
            })
          } else {
            var errMsg = '获取厕纸失败，请重试~';
            switch (ret.code) {
              case 401:
                errMsg = '抱歉，纸盒机暂时不可用~~~';
                break;
              case 402:
                errMsg = '您今日的免费获取次数已经用完了';
              default:
                break;
            }
            this.setData({
              errorMsg: errMsg,
              success: false,
              loading: false
            })
          }
        } else {
          this.setData({
            errorMsg: "服务器抽风啦啊啊啊~~~",
            success: false,
            loading: false
          })
        }
      },
      fail: res => {
        wx.hideLoading();
        this.setData({
          errorMsg: "连接不到网络啦~~~",
          success: false,
          loading: false
        })
      }
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

  onReturnBtnOnclick: function() {
    wx.navigateBack();
  }


})