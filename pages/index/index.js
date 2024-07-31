//获取应用实例
var app = getApp();

//require引入config.js文件
var CONFIG = require("../../utils/config.js");
var dialog = require("../../utils/dialog.js");
var util = require("../../utils/util.js");

// 页面注册
Page({
    //初始化数据
    data: {
        stories:"",
        top_stories:"",
        datetime:"",
        indicatorDots:true,
        autoplay:true,
        interval:5000,
        duration:1000
    },

    handleTap: function() {
      if (!this.data.hasSubscribed) {
          this.requestSubscribeMessage();
          this.setData({
              hasSubscribed: true // 更新标志位，确保只触发一次
          });
      }
  },

  requestSubscribeMessage: function() {

      wx.requestSubscribeMessage({
          tmplIds: ['-X5Un8oFQmB0e_yDW-E-8JI97TyolqSwZPak8I-4-_s'],
          success(res) {
              console.log(res);
              wx.cloud.callFunction({
                name:'addUser',
                complete: res=>{
                  console.log('callFunction test result: ', res)
                }
              })
          },
          fail(err) {
              console.error('Failed to request subscription message', err);
          }
      });
  },

  
    //知乎日报详情页跳转
    dailyDetail:function(e){
        
         wx.navigateTo({
           url: '../detail/detail?id='+e.currentTarget.id,
           success: function(res){
             // success
           },
           fail: function() {
             // fail
           },
           complete: function() {
             // complete
           }
         })

    },
    //获取最新日报数据
    getNewsList:function(){
            var _this = this
            wx.request({
                url: CONFIG.API_URL.NEWS_LATEST_QUERY, 
                method: 'GET',
                header: {
                    'Content-Type': 'application/json'
                },
                success: function(res) {
                  console.log("获取最新日报数据:" + JSON.stringify(res));//errMsg: "request:ok", data: Object, statusCode: 200
                    if(res.statusCode == 200){
                        //日期格式化 '19930701' -> 1993-07-01  
                        var dateString = res.data.date;
                        var pattern = /(\d{4})(\d{2})(\d{2})/;
                        var formatedDate = dateString.replace(pattern, '$1-$2-$3');

                        _this.setData({
                            stories:res.data.stories,
                            top_stories:res.data.top_stories,
                            datetime:formatedDate
                        })
                    }
                },
                fail:function(){
                    setTimeout(function(){
                        dialog.toast("请求失败，请检查您的网络！");
                    },1000);
                },
                complete:function(){
                    wx.stopPullDownRefresh();//停止下拉刷新
                }
            })
    },

    //生命周期函数  页面加载 一个页面只会调用一次 
    onLoad:function(){
        console.log("onload");
        this.getNewsList();

    },
    onReady: function() {
    // Do something when page ready.
    },
    onShow: function() {
        // Do something when page show.
        
    },
    onHide: function() {
        // Do something when page hide.
    },
    onUnload: function() {
        // Do something when page close.
    },

    //监听页面下拉刷新
    onPullDownRefresh: function() {
       this.getNewsList();
    },
    onReachBottom: function() {
        // Do something when page reach bottom.
    }
})
