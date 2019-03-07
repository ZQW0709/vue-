<template>
  <el-container>
    <el-aside width="200px">
      <div style="margin: 10px;">
        <span style="font-size: 14px;">当前在线用户</span>
      </div>
      <el-card
        v-for="user in userList"
        :key="user"
        style="width: 80%; margin: 10px auto auto;"
      >{{ user }}</el-card
      >
    </el-aside>
    <el-container>
      <el-header style="width: 100%; height: 50px;  ">
        简单聊
      </el-header>
      <el-main
        id="chatContainer"
        style="height: 400px; margin-top: 50px; padding-bottom: 10px"
      >
        <div v-for="message in messages" :key="message.key">
          <!-- 设置提醒 ： 您已加入聊天室，请文明发言... -->
          <el-alert
            v-if="message.type === 'system'"
            :title="message.msg"
            type="info"
          />

          <!-- 别人说的，从左边加载 -->
          <div
            v-if="message.type !== 'system' && message.nickName !== nickName"
            style="white-space:normal; display:inline;word-break:break-all; word-wrap:break-word;"
          >
            <div style="margin: 2px 0 0 12px;">
              <time 
class="time" 
style="font-size: 8px;"
              >{{ message.nickName }}&nbsp;&nbsp;&nbsp;{{ message.time }}
                <el-card
                  shadow="always"
                  style="max-width: 80%; margin: 0 10px 0 10px; width:auto; display: inline-block !important;"
                >
                  <span style="font-size: 14px;">{{ message.msg }}</span>
                </el-card>
              </time>
            </div>
          </div>

          <!-- 自己说的 从右边加载 -->
          <div
            v-if="message.type !== 'system' && message.nickName === nickName"
            style="text-align: right; white-space:normal; display:inline;word-break:break-all; word-wrap:break-word;"
          >
            <div style="margin: 2px 12px 0 0;">
              <time 
class="time" 
style="font-size: 8px;"
              >{{ message.time }}&nbsp;&nbsp;&nbsp;{{ message.nickName }}
              </time>
              <el-card
                shadow="always"
                style="  max-width: 80%; margin: 0 10px 0 10px; width:auto; display: inline-block !important;text-align: left"
              >
                <span style="font-size: 14px;">{{ message.name }}</span>
                <div style="clear:both;flot:left">A.{{ message.a }}</div>
                <div style="clear:both;flot:left">B.{{ message.b }}</div>
                <div style="clear:both;flot:left">C.{{ message.c }}</div>
                <div style="clear:both;flot:left">D.{{ message.d }}</div>
              </el-card>

              <div />
            </div>
          </div>
        </div>
      </el-main>
      <el-footer style="width: 100%; height: 450px;  bottom: 0;">
        <!-- <el-input
          type="textarea"
          :rows="3"
          style="margin: 10px;"
          placeholder="请输入内容"
          @keyup.ctrl.enter.native="sendMessage"
          v-model="textarea">
        </el-input> -->
        <el-table
          :data="tableData"
          stripe
          border
          style="width: 100%"
          height="400px"
        >
          <el-table-column
            prop="examtypename"
            label="题目类型"
            align="center"
          />
          <el-table-column prop="name" label="题目名称" align="center" />
          <el-table-column prop="a" label="选项A" align="center" />
          <el-table-column prop="b" label="选项B" align="center" />
          <el-table-column prop="c" label="选项C" align="center" />
          <el-table-column prop="d" label="选项D" align="center" />
          <el-table-column prop="correctanswer" label="答案" align="center" />
          <el-table-column prop="explaininfo" label="解释说明" align="center" />
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                style="margin-top: -6px;"
                size="mini"
                @click="sendMessage(scope.row)"
              >
                <el-icon name="el-icon-circle-check-outline" />
                发送(Ctrl+Enter)
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import {
  getExaminfoList,
  getAllexamtype
} from '@/api/problem'

import qs from 'qs'

export default {
  data() {
    return {
      nickName: '',
      showSetNick: false,
      webSocket: null,
      textarea: '',
      messages: [],
      userList: [],
      useBy: '', // 手机或电脑
      page: 1,
      limit: [10, 20, 30, 40],
      pageLimit: 10,
      tableData: []
    }
  },
  watch: {
    messages() { // ? 这是什么
      this.$nextTick(() => {
        var container = this.$el.querySelector('#chatContainer')
        container.scrollTop = container.scrollHeight
      })
    }
  },
  created() {
    if (process.browser) {
      if ('WebSocket' in window) {
        this.webSocket = new WebSocket('ws://localhost:9527/websocket')
        this.initWebSocket()
        console.log('Support webSocket')
      } else {
        console.log('Not support webSocket')
      }
      console.log(',', navigator.userAgent)
      if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        this.useBy = 'phone'
      } else {
        this.useBy = 'pc'
      }
    }
    const params = {
      page: this.page,
      limit: this.pageLimit
    }
    this.getProblemList(params)
  },
  destroyed() {
    this.webSocket.close()
  },
  methods: {
    getProblemList(params) { // 获取题目
      params = qs.stringify(params)
      getExaminfoList(params).then(res => {
        this.total = res.data.count
        const obj = res.data.data
        this.list = res.data.data
        // const i = 0
        this.tableData = []
        for (let i = 0; i < obj.length; i++) {
          const tempList = {}
          tempList.id = obj[i].id
          tempList.examtypename = obj[i].examtypename
          tempList.name = obj[i].name
          tempList.a = obj[i].a
          tempList.b = obj[i].b
          tempList.c = obj[i].c
          tempList.d = obj[i].d
          tempList.correctanswer = obj[i].correctanswer
          tempList.explaininfo = obj[i].explaininfo
          tempList.examtypeid = obj[i].examtypeid
          this.tableData.push(tempList)
        }
      })
    },
    initWebSocket() { //* 初始化websocket连接
      this.webSocket.onopen = this.webSocketOpen
      this.webSocket.onmessage = this.webSocketMessage
      this.webSocket.onclose = this.webSocketClose
      this.webSocket.onerror = this.webSocketError
    },
    webSocketOpen() { // 打开
      console.log('WebSocket连接成功')
    },
    webSocketMessage(e) { // 数据接收
      const vm = this
      const message = JSON.parse(e.data) // 返回的数据
      console.log(message)
      if (message.type === 'setResult') {
        if (message.msg === -1) {
          this.nickName = ''
          vm.$message('昵称设置失败')
        } else {
          this.nickName = message.nickName
          vm.nickName = message.nickName
          vm.$message('昵称设置成功')
        }
      } else if (message.type === 'newUser') {
        vm.userList = message.nickName
        vm.$message({
          message: message.msg,
          type: 'success'
        })
      } else if (message.type === 'loseUser') {
        vm.userList = message.nickName
        vm.$message({
          message: message.msg,
          type: 'error'
        })
      } else if (message.type === 'showUser') {
        vm.userList = message.nickName
      } else {
        vm.messages.push(message)
      }
    },
    webSocketClose() { // 关闭
      console.log('WebSocket关闭')
    },
    webSocketError() { // 失败
      console.log('WebSocket连接失败')
    },
    sendMessage(row) { //* 设置发送信息
      const vm = this
      if (vm.nickName.length <= 0) {
        const body = {}
        body.msg = ''
        body.sendType = 'setNick'
        body.nickName = '管理员'
        this.finalSend(JSON.stringify(body))
      }
      // if (vm.textarea && vm.textarea.length > 0) {
      console.log(row)
      const message = row
      console.log(message)
      //   message.msg = vm.textarea;
      message.sendType = 'sendMsg'
      message.nickName = '管理员'
      this.finalSend(JSON.stringify(message))
      //   vm.textarea = null
      // }
    },
    finalSend(message) { //* 使用websocket发送
      this.webSocket.send(message)
    },
    open3() {
      this.$prompt('输入你本次的昵称才能开始聊天', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      }).then(({ value }) => {
        const body = {}
        body.msg = ''
        body.sendType = 'setNick'
        body.nickName = value
        this.finalSend(JSON.stringify(body))
        this.$message({
          type: 'success',
          message: '你的昵称是: ' + value
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入将不能参与聊天'
        })
      })
    }
  }
}
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  padding: 0 0;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
}

.el-main {
  padding: 0 0;
}

.el-card__body {
  padding: 5px 10px 5px;
  line-height: 16px;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
