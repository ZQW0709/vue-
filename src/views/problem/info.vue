<template>
  <div class="app-container">
    <div>
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline">
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            style="margin:0 0 20px 20px;"
            type="primary"
            icon="document"
            @click="handleDownload">导出Excel</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="examtypename"
        label="题目类型"
        align="center" />
      <el-table-column
        prop="name"
        label="题目名称"
        align="center" />
      <el-table-column
        prop="a"
        label="选项A"
        align="center" />
      <el-table-column
        prop="b"
        label="选项B"
        align="center" />
      <el-table-column
        prop="c"
        label="选项C"
        align="center" />
      <el-table-column
        prop="d"
        label="选项D"
        align="center" />
      <el-table-column
        prop="correctanswer"
        label="答案"
        align="center" />
      <el-table-column
        prop="explaininfo"
        label="解释说明"
        align="center" />
      <el-table-column
        label="状态"
        prop="status"
        align="center"
        width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{
            scope.row.status | statucZhFilter
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="openEdit(scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="confirmDele(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        :total="total"
        layout="sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      center
      width="500px">
      <el-form
        :model="form"
        label-width="120px">
        <el-form-item label="题目类型名称">
          <el-select
            v-model="form.examtypeid"
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目">
          <el-input
            :rows="2"
            v-model="form.name"
            type="textarea"
            placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="选项A">
          <el-input
            v-model="form.a"
            autocomplete="off" />
        </el-form-item>
        <el-form-item label="选项B">
          <el-input
            v-model="form.b"
            autocomplete="off" />
        </el-form-item>
        <el-form-item label="选项C">
          <el-input
            v-model="form.c"
            autocomplete="off" />
        </el-form-item>
        <el-form-item label="选项D">
          <el-input
            v-model="form.d"
            autocomplete="off" />
        </el-form-item>
        <el-form-item label="答案">
          <div>
            <el-checkbox-group v-model="form.correctanswer">
              <el-checkbox-button
                v-for="answer in answers"
                :label="answer"
                :key="answer">{{ answer }}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="解释">
          <el-input
            :rows="2"
            v-model="form.explaininfo"
            type="textarea"
            placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editClass()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExaminfoList,
  getAllexamtype,
  updateExaminfo,
  addExaminfo
} from '@/api/problem'

import qs from 'qs'
export default {
  filters: {
    statusFilter(status) {
      const typeMap = {
        0: 'warning',
        1: ''
      }
      return typeMap[status] || '未知类型'
    },
    statucZhFilter(status) {
      const typeMap = {
        0: '隐藏',
        1: '发布'
      }
      return typeMap[status] || '未知类型'
    }
  },
  data() {
    return {
      tableData: [],
      options: [],
      classOptions: [],
      value: '',
      isAdd: false,
      page: 1,
      limit: [10, 20, 30, 40],
      pageLimit: 10,
      total: 0,
      form: {
        id: 0,
        name: '',
        a: '',
        b: '',
        c: '',
        d: '',
        correctanswer: [],
        explaininfo: '',
        examtypeid: ''
      },
      answers: ['A', 'B', 'C', 'D'],
      formInline: {
        user: '',
        region: ''
      },
      formLabelWidth: '80px',
      dialogFormVisible: false,
      dialogTitle: '题目类型编辑',
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: '题目列表',
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  created() {
    this.getProblemList()
    getAllexamtype().then(res => {
      const obj = res.data

      this.options = []
      for (let i = 0; i < obj.length; i++) {
        const tempList = {}
        tempList.value = obj[i].id
        tempList.label = obj[i].name
        this.options.push(tempList)
      }
    })
  },
  methods: {
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['题目类型ID', '题目类型名称', '题目内容', '选项A', '选项B', '选项C', '选项D', '答案', '解释说明']

        const filterVal = [
          'examtypeid',
          'examtypename',
          'name',
          'a',
          'b',
          'c',
          'd',
          'correctanswer',
          'explaininfo'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        const file = this.filename
        const autoWidth = this.autoWidth
        const bookType = this.bookType
        const sel = this
        // excel.export_json_to_excel({
        //   header: tHeader,
        //   data,
        //   filename: this.filename,
        //   autoWidth: this.autoWidth,
        //   bookType: this.bookType
        // })
        const p1 = new Promise(function(resolve, reject) {
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: file,
            autoWidth: autoWidth,
            bookType: bookType
          })
          resolve()
        })
        p1.then(function() {
          // console.log('data1')
          sel.$message({
            message: '恭喜你，导出',
            type: 'success'
          })
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    },
    handleSizeChange(val) {
      this.pageLimit = val
      this.getProblemList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getProblemList()
    },
    onSubmit() {
      this.dialogTitle = '新增题目类型'
      this.isAdd = true
      this.dialogFormVisible = true
      this.form.id = ''
      this.form.name = ''
      this.form.a = ''
      this.form.b = ''
      this.form.c = ''
      this.form.d = ''
      this.form.correctanswer = []
      this.form.examtypeid = ''
      this.form.explaininfo = ''
    },
    getProblemList() {
      let params = {
        page: this.page,
        limit: this.pageLimit
      }
      params = qs.stringify(params)
      getExaminfoList(params).then(res => {
        this.total = res.data.count
        const obj = res.data.data
        this.list = res.data.data
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
          tempList.status = obj[i].examtypestatus

          tempList.correctanswer = obj[i].correctanswer
          tempList.explaininfo = obj[i].explaininfo
          tempList.examtypeid = obj[i].examtypeid
          this.tableData.push(tempList)
        }
      })
    },
    openEdit(row) {
      this.dialogTitle = '题目类型编辑'
      this.isAdd = false
      this.dialogFormVisible = true
      this.form.id = row.id
      this.form.name = row.name
      this.form.a = row.a
      this.form.b = row.b
      this.form.c = row.c
      this.form.d = row.d
      this.form.correctanswer = []
      this.form.examtypeid = row.examtypeid
      this.form.explaininfo = row.explaininfo
      for (let i = 0; i < row.correctanswer.length; i++) {
        this.form.correctanswer.unshift(row.correctanswer[i])
      }
    },
    editClass() {
      if (this.isAdd) {
        let tempAnswer = this.form.correctanswer[0]
        for (let i = 1; i < this.form.correctanswer.length; i++) {
          tempAnswer += this.form.correctanswer[i]
        }
        let params = {
          name: this.form.name,
          examtypeid: this.form.examtypeid,
          a: this.form.a,
          b: this.form.b,
          c: this.form.c,
          d: this.form.d,
          explaininfo: this.form.explaininfo,
          correctanswer: tempAnswer
        }
        params = qs.stringify(params)
        addExaminfo(params)
          .then(res => {
            this.dialogFormVisible = false
            this.getProblemList()
            if (res.data === 'success') {
              this.$message({
                message: '恭喜你，修改成功',
                type: 'success'
              })
            } else {
              this.$message.error('错了哦，修改错误')
            }
          })
          .catch(err => {
            this.$message.error('未知错误')
          })
      } else {
        let tempAnswer = this.form.correctanswer[0]
        for (let i = 1; i < this.form.correctanswer.length; i++) {
          tempAnswer += this.form.correctanswer[i]
        }

        let params = {
          id: this.form.id,
          name: this.form.name,
          examtypeid: this.form.examtypeid,
          a: this.form.a,
          b: this.form.b,
          c: this.form.c,
          d: this.form.d,
          explaininfo: this.form.explaininfo,
          correctanswer: tempAnswer
        }
        params = qs.stringify(params)
        updateExaminfo(params)
          .then(res => {
            if (res.data === 'success') {
              this.dialogFormVisible = false
              this.$message({
                message: '恭喜你，修改成功',
                type: 'success'
              })
              this.getProblemList()
            } else {
              this.$message.error('错了哦，修改错误')
            }
          })
          .catch(err => {
            this.$message.error('未知错误')
          })
      }
    },
    confirmDele(row) {
      let params = {
        id: row.id
      }
      params = qs.stringify(params)
      deleteexamtype(params).then(res => {
        console.log(res.data)
        this.getProblemList()
      })
    }
  }
}

</script>

<style>
</style>
