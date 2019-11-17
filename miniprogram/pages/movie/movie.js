// pages/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: []
  },

  //通过云函数获取电影列表
  getMovieList: function() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({//调用云函数movielist，每次回去十部电影的数据
      name: 'movielist',
      data: {
        start: this.data.movieList.length,
        count: 10
      }
    }).then(res => {
      // console.log(res);
      // JSON.parse将字符串解析为对象
      // arr.concat(arr2)将arr和arr1拼接起来，arr在前面
      this.setData({
        movieList: this.data.movieList.concat(JSON.parse(res.result).subjects)
      });
      wx.hideLoading();
    }).catch(err => {
      console.error(err);
      wx.hideLoading();
    });
  },

  //通过wx.request获取电影列表
  getMovieList2:function(){
    let that = this;
    let movieList = that.data.movieList;
    let start = movieList.length;
    wx.request({
      url: 'http://api.douban.com/v2/movie/in_theaters', //仅为示例，并非真实的接口地址
      data: {
        apikey:"0df993c66c0c636e29ecbb5344252a4a",
        start: start,
        count:10,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          movieList: this.data.movieList.concat(JSON.parse(res.data).subjects)
        });
      }
    })
  },

  //跳转到评论页面
  gotoComment: function(event) {
    wx.navigateTo({
      url: `../comment/comment?movieid=${event.target.dataset.movieid}`,
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMovieList();
  },

  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getMovieList();
  },

  
})