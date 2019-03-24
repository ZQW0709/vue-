<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="学生姓名">
        <el-input v-model="formInline.studentname" placeholder="请输入学生姓名"/>
      </el-form-item>
      <el-form-item label="题目内容">
        <el-input v-model="formInline.examtypeinfo" placeholder="请输入题目内容"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="学生ID">
              <span>{{ props.row.studentid }}</span>
            </el-form-item>
            <el-form-item label="题目类型ID">
              <span>{{ props.row.examtypeid }}</span>
            </el-form-item>
            <el-form-item label="题目ID">
              <span>{{ props.row.examinfoid }}</span>
            </el-form-item>
            <el-form-item label="正确答案">
              <span>{{ props.row.correctanswer }}</span>
            </el-form-item>
            <el-form-item label="学生答案">
              <span>{{ props.row.studentanswer }}</span>
            </el-form-item>
            <el-form-item label="学生账号">
              <span>{{ props.row.studentlogin }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        width="180"
        align="center"/>
      <el-table-column
        prop="studentname"
        label="学生姓名"
        width="180"
        align="center"/>
      <el-table-column
        prop="examtypename"
        label="题目类型"
        align="center"/>
      <el-table-column
        prop="examtypeinfo"
        label="题目内容"
        align="center"/>
      <el-table-column
        prop="istrue"
        label="是否正确"
        align="center"/>
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

  </div>
</template>

<script>

import {
  selectRealtimeanswer
} from '@/api/statistics'
import qs from 'qs'
export default {
  data() {
    return {
      tableData: [],
      formInline: {
        studentname: '',
        examtypeinfo: ''
      },
      page: 1,
      limit: [10, 20, 30, 40],
      pageLimit: 10,
      total: 0
    }
  },

  created() {
    this.getStatistics()
  },
  methods: {
    onSubmit() {
      // console.log('submit!');
      let params = {
        page: this.page,
        limit: this.pageLimit,
        examtypeinfo: this.formInline.examtypeinfo,
        studentname: this.formInline.studentname
      }
      params = qs.stringify(params)
      selectRealtimeanswer(params)
        .then(res => {
          const obj = res.data.data
          this.total = res.data.count
          this.tableData = []
          for (const iterator of obj) {
            this.tableData.push(iterator)
          }
        })
    },
    getStatistics() {
      let params = {
        page: this.page,
        limit: this.pageLimit
      }
      params = qs.stringify(params)
      selectRealtimeanswer(params)
        .then(res => {
          const obj = res.data.data
          this.total = res.data.count
          this.tableData = []
          for (const iterator of obj) {
            this.tableData.push(iterator)
          }
        })
    },
    handleSizeChange(val) {
      this.pageLimit = val
      this.getStatistics()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getStatistics()
    }
  }
}
</script>

<style>
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33.333%;
  }
</style>

