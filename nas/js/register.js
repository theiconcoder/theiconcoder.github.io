var Anon = function () {};

Anon.prototype = {
    init: function () {
        // 用户映射
        LocalContractStorage.set('userMap', JSON.stringify({}))
        // {
        //     password: '',
        //     messageList: []
        // }
        // 消息映射
        LocalContractStorage.set('messageMap', JSON.stringify({}))
        // {
        //     content: '就这样吧，这是我曾经发过的一条匿名信息，现在会显示在历史记录里面',
        //     hug:0,
        //     like: 0,
        //     discuss: [{
        //       owner: '123',
        //       content: '那好吧1111111111111111112312313123nkjnfajio1n23jop12inf',
        //       like: 0,
        //       dis: 0
        //     }]
        // }
    },
    // 发送匿名消息
    setMessage: function (username, value) {
        let id = Date.now() + Math.floor(Math.random() * 200) + username
        // 存消息
        let messageMap = JSON.parse(LocalContractStorage.get('messageMap'))
        messageMap[id] = {
            id: id,
            content: value,
            hug:0,
            like: 0,
            discuss: []
        }
        LocalContractStorage.set('messageMap', JSON.stringify(messageMap))
        // 存消息用户关联
        let userMap = JSON.parse(LocalContractStorage.get('userMap'))
        let user = userMap[username]
        if (!user) {
            userMap[username] = {
                password: '',
                messageList: []
            }
        }
        user = userMap[username]
        user.messageList.push(id)
        LocalContractStorage.set('userMap', JSON.stringify(userMap))
        return 'success'
    },
    setDiscuss: function (username, msgId, discuss) {
        let messageMap = JSON.parse(LocalContractStorage.get('messageMap'))
        if (messageMap[msgId]) {
            messageMap[msgId].discuss.push({
                owner: username,
                content: discuss,
                like: 0,
                dis: 0
            })
        }
        LocalContractStorage.set('messageMap', JSON.stringify(messageMap))
        return 'success'
    },
    // 获得随机
    getMsg: function () {
        let messageMap = JSON.parse(LocalContractStorage.get('messageMap'))
        const keys = Object.keys(messageMap)
        const random = Math.floor(Math.random() * keys.length)
        const key = keys[random]
        return messageMap[key]
    },
    getAllMsg: function () {
        let messageMap = JSON.parse(LocalContractStorage.get('messageMap'))
        return messageMap
    },
    getAllUser: function () {
        let userMap = JSON.parse(LocalContractStorage.get('userMap'))
        return userMap
    },
    // 按用户获取
    getMsgByUser: function (username) {
        let userMap = JSON.parse(LocalContractStorage.get('userMap'))
        let user = userMap[username]
        let messageList
        let messageMap
        if (user) {
            messageMap = JSON.parse(LocalContractStorage.get('messageMap'))
            messageList = user.messageList.map(id => messageMap[id])
            return messageList
        }
        return []
    },
    setUser: function (username, password) {
        let userMap = JSON.parse(LocalContractStorage.get('userMap'))
        let user = userMap[username]
        if (!user) {
            // 创建
            userMap[username] = {
                messageList: []
            }
            userMap[username].password = password
            LocalContractStorage.set('userMap', JSON.stringify(userMap))
            return 'new'
        } else {
            // 返回结果
            if (user.password === password) {
                return 'success'
            } else {
                return 'error'
            }
        }
    }

};

module.exports = Anon;