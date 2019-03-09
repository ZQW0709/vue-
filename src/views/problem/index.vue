<template>
  <div class="app-container">
    <div>
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline">
        <!-- <el-form-item label="班级名称">
    <el-input v-model="formInline.user" placeholder="班级名称"></el-input>
  </el-form-item>
  <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
        </el-select>-->
        <el-form-item>
          <!-- <el-button type="primary" @click="onSubmit">查询</el-button> -->
          <el-button
            type="primary"
            @click="onSubmit">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="姓名"
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
      <!-- <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="100px" /> -->
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
      width="300px">
      <el-form :model="form">
        <el-form-item
          label="题目类型名称"
          label-width="150px">
          <el-input
            v-model="form.name"
            autocomplete="off" />
        </el-form-item>
        <el-form-item label="题目类型状态" label-width="150px">
          <el-select
            v-model="form.status"
            placeholder="请选择">
            <el-option
              v-for="item in StatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
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
  selectexamtype,
  updateexamtype,
  addexamtype,
  deleteexamtype
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
      StatusOptions: [{
        value: 0,
        label: '隐藏'
      }, {
        value: 1,
        label: '发布'
      }],
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
        status: 0
      },
      formInline: {
        user: '',
        region: ''
      },
      formLabelWidth: '80px',
      dialogFormVisible: false,
      dialogTitle: '题目类型编辑'
    }
  },
  watch: {
    'form.campusid': function() {
      if (this.form.campusid.length !== 0) {
        let params = {
          campusid: this.form.campusid
        }
        params = qs.stringify(params)
        getClassListById(params).then(res => {
          // console.log(res.data)
          const obj = res.data
          this.classOptions = []
          for (let i = 0; i < obj.length; i++) {
            const tempList = {}
            tempList.value = obj[i].id
            tempList.label = obj[i].name
            this.classOptions.push(tempList)
          }
          if (obj.length === 0) {
            this.form.classinfoid = ''
          } else {
            this.form.classinfoid = obj[0].id
          }
        })
      }
    }
  },
  created() {
    this.getProblemType()
    // selectexamtype()
    // .then(res => {
    //     const obj = res.data
    //     console.log(obj)
    //     this.options = []
    // for(let i = 0; i<obj.length;i++) {
    //     let tempList = {}
    //     tempList.value = obj[i].id
    //     tempList.label = obj[i].name
    //     this.options.push(tempList)
    // }
    // })
  },
  methods: {
    handleSizeChange(val) {
      this.pageLimit = val
      this.getProblemType()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getProblemType()
    },
    onSubmit() {
      this.dialogTitle = '新增题目类型'
      this.isAdd = true
      this.dialogFormVisible = true
      this.form.id = ''
      this.form.name = ''
    },
    getProblemType() {
      let params = {
        page: this.page,
        limit: this.pageLimit
      }
      params = qs.stringify(params)
      selectexamtype(params).then(res => {
        console.log(res.data)
        this.total = res.data.count
        const obj = res.data.data
        // const i = 0
        this.tableData = []
        for (let i = 0; i < obj.length; i++) {
          const tempList = {}
          tempList.id = obj[i].id
          tempList.status = obj[i].status
          tempList.name = obj[i].name
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
      this.form.status = row.status
    },
    editClass() {
      if (this.isAdd) {
        let params = {
          name: this.form.name,
          status: this.form.status
        }
        params = qs.stringify(params)
        addexamtype(params).then(res => {
          this.dialogFormVisible = false
          this.getProblemType()
        })
      } else {
        let params = {
          id: this.form.id,
          name: this.form.name,
          status: this.form.status
        }
        params = qs.stringify(params)
        updateexamtype(params)
          .then(res => {
            if (res.data === 'success') {
              this.dialogFormVisible = false
              this.$message({
                message: '恭喜你，修改成功',
                type: 'success'
              })
              this.getProblemType()
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
        this.getProblemType()
      })
    }
  }
}
</script>

<style>
</style>

