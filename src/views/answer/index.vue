<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="学生姓名">
        <el-input v-model="formInline.studentname" placeholder="请输入学生姓名"/>
      </el-form-item>
       <el-form-item label="题目类型名称">
          <el-select
            v-model="formInline.examtypeid"
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="180"
        align="center"/>
      <el-table-column
        prop="stuname"
        label="学生姓名"
        width="180"
        align="center"/>
      <el-table-column
        prop="examinfoname"
        label="题目类型"
        align="center"/>
      <el-table-column
        prop="grade"
        label="合格率"
        align="center"/>
      <el-table-column
        prop="createtime"
        label="答题时间"
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
  selectStudentsanswer
} from '@/api/answer'
import {
  getAllexamtype
} from '@/api/problem'
import qs from 'qs'
export default {
  data() {
    return {
      tableData: [],
      formInline: {
        studentname: '',
        examtypeinfo: '',
        examtypeid:''
      },
      page: 1,
      limit: [10, 20, 30, 40],
      pageLimit: 10,
      total: 0,
      options: []
    }
  },

  created() {
    this.getStudentAnswer()
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
    onSubmit() {
      // console.log('submit!');
      let params = {
        page: this.page,
        limit: this.pageLimit,
        examtypeinfo: this.formInline.examtypeinfo,
        stuname: this.formInline.studentname
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
    getStudentAnswer() {
      let params = {
        page: this.page,
        limit: this.pageLimit
      }
      params = qs.stringify(params)
      selectStudentsanswer(params)
        .then(res => {
          const obj = res.data.data
          this.total = res.data.count
          this.tableData = []
          for (const iterator of obj) {
            iterator.grade = iterator.grade + '%'
            iterator.createtime = this.dateFormat(iterator.createtime)
            this.tableData.push(iterator)
            // console.log(res.data)
          }
        })
    },
    handleSizeChange(val) {
      this.pageLimit = val
      this.getStudentAnswer()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getStudentAnswer()
    },
    dateFormat(time) {   //* 格式化时间
    var date=new Date(time);
    var year=date.getFullYear();
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
    var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
    var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
    var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
    var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
    // 拼接
    return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
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

