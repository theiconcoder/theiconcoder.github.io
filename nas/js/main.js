var dappAddress = "n1qHxkMoB41wUx8ZPQ6gJUFCxb1Wrb2bg4N";
var hash = "dca3d14d349d03d84f0ff9d9f6626da68da827056df341a0957a44814293748a";

var NebPay = require("nebpay");
var nebPay = new NebPay();
var HttpRequest = require("nebulas").HttpRequest;
var Neb = require("nebulas").Neb;
var Account = require("nebulas").Account;
var Transaction = require("nebulas").Transaction;
var Unit = require("nebulas").Unit;
var neb = new Neb();
setTimeout(() => {
  if (typeof webExtensionWallet === "undefined") {
    alert('星云钱包环境未运行，请安装钱包插件')
    return
  }
  new Vue({
    el: '#Anon',
    data: {
      isLoading: true,
      username: '',
      // password: '',
      isLogined: false,
      model: 'post',
      postValue: '',
      noticeShow: '',
      noticeMessage: '',
      myMessageList: [],
      readMessage: {},
      discussValues: {}
    },
    watch: {
      noticeShow: function (val) {
        if (val === true) {
          let vm = this
          setTimeout(function () {
            vm.noticeShow = false
          }, 1500)
        }
      }
    },
    methods: {
      searchUser: function () {
        let trimUsername = this.username.trim()
        if (trimUsername.length > 10 || trimUsername.length < 2) {
          this.username = trimUsername
          this.notice('再检查下用户名吧')
          return
        }
        const username = trimUsername
        this.isLoading = true
        const vm = this
        nebPay.simulateCall(dappAddress, '0', 'getMsgByUser', JSON.stringify([username]), {
          listener: function (res) {
            // userMap, user, messageMap, messageList
            vm.isLoading = false
            if (res.execute_err === "") {
              vm.isLoading = false
              console.log(JSON.parse(res.result))
              vm.myMessageList = JSON.parse(res.result)
              vm.isLogined = true
            }
            vm.readOne()
          }
        })
      },
      postAnon: function () {
        let trimPostValue = this.postValue.trim()
        if (trimPostValue.length === 0) {
          return
        }
        if (trimPostValue.length > 200) {
          this.notice('你写的太多了，200长度的字符装不下')
          return
        } 
        const vm = this
        // username value
        nebPay.call(dappAddress, '0', 'setMessage', JSON.stringify([this.username, trimPostValue]), {
          listener: function (res) {
            if (res.txhash) {
              vm.postValue = ''
              vm.notice('你的消息已进入匿名的海洋，还要等一会才能被发现')
            }
          }
        })
      },
      readOne: function () {
        this.isLoading = true
        let vm = this
        nebPay.simulateCall(dappAddress, '0', 'getMsg', JSON.stringify([]), {
          listener: function (res) {
            vm.isLoading = false
            vm.readMessage = JSON.parse(res.result)
          }
        })
      },
      sendDiscuss: function (id) {
        const trimDiscussVal = this.discussValues[id].trim()
        if (trimDiscussVal.length === 0) {
          return
        }
        if (trimDiscussVal.length > 100) {
          this.notice('太长了')
        }
        let vm = this
        nebPay.call(dappAddress, '0', 'setDiscuss', JSON.stringify([this.username, id, trimDiscussVal]), {
          listener: function (res) {
            vm.notice('让你的评论飞一会')
          }
        })
        
      },
      changeModel: function (type) {
        this.model = type
      },
      notice: function (msg) {
        this.noticeMessage = msg
        this.noticeShow = true
      }
    },
    created: function () {
      this.isLoading = false
    }
  })
}, 500)