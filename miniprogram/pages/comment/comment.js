// pages/comment/comment.js
const db = wx.cloud.database(); // 初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    content: '', // 评价的内容
    score: 5, // 评价的分数
    images: [], // 上传的图片
    fileIds: [],
    movieId: -1
  },

  //提交评价
  submit: function() {
    wx.showLoading({
      title: '评论中',
    })
    console.log(this.data.content, this.data.score);

    // 上传图片到云存储
    let promiseArr = [];
    for (let i = 0; i < this.data.images.length; i++) {
      promiseArr.push(new Promise((resolve, reject) => {
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            this.setData({
              fileIds: this.data.fileIds.concat(res.fileID)
            });
            resolve();
          },
          fail: console.error
        })
      }));
    }

    //将数据插入到云数据库中
    Promise.all(promiseArr).then(res => {
      // 插入数据
      db.collection('comment').add({
        data: {
          content: this.data.content,//评价内容
          score: this.data.score,//评价分数
          movieid: this.data.movieId,//电影id
          fileIds: this.data.fileIds//评价图片
        }
      }).then(res=>{
        wx.hideLoading();
        wx.showToast({
          title: '评价成功',
        })
      }).catch(err=>{
        wx.hideLoading();
        wx.showToast({
          title: '评价失败',
        })
      })

    });

  },
  
  //评价文字改变
  onContentChange: function(event) {
    this.setData({
      content: event.detail
    });
  },

  //评价星星数发生改变
  onScoreChange: function(event) {
    this.setData({
      score: event.detail
    });
  },

  //上传图片
  uploadImg: function() {
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      movieId: options.movieid
    });
    wx.showLoading({
      title: '加载中',
    })
    //console.log(options);//传过来的参数
    wx.cloud.callFunction({
      name: 'getDetail',
      data: {
        movieid: options.movieid
      }
    }).then(res => {
      // console.log(res);
      this.setData({
        detail: JSON.parse(res.result)//将字符串解析为对象
      });
      let title = this.data.detail.title;
      wx.setNavigationBarTitle({
        title: title
      })
      wx.hideLoading();
    }).catch(err => {
      console.error(err);
      wx.hideLoading();
    });
  },

  
})