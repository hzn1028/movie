// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:"",
    country:"",
    avatarUrl:"",
  },

  //获取用户信息
  onGotUserInfo: function(event){
    console.log(event);
    let userInfo = event.detail.userInfo;
    console.log(userInfo);
    this.setData({
      nickName: userInfo.nickName,
      country: userInfo.country,
      avatarUrl: userInfo.avatarUrl,
    })
  },

  
})