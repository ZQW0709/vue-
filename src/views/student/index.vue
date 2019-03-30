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
        prop="stuname"
        label="姓名"
        align="center" />
      <el-table-column
        prop="classinfoname"
        label="班级名称" />
      <el-table-column
        prop="campusname"
        label="所属学校" />
      <el-table-column
        prop="isSex"
        label="性别" />
      <el-table-column
        prop="login"
        label="账号" />
      <el-table-column
        prop="profession"
        label="专业" />
      <el-table-column
        prop="phone"
        label="联系方式" />

      <el-table-column
        prop="lecturer"
        label="上课教师" />
      <el-table-column
        prop="teacher"
        label="班导" />
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
      center>
      <el-form :model="form">
        <el-form-item
          :label-width="formLabelWidth"
          label="姓名">
          <el-input
            v-model="form.stuname"
            autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="所属学校">
          <el-select
            v-model="form.campusid"
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="班级名称">
          <el-select
            v-model="form.classinfoid"
            placeholder="请选择">
            <el-option
              v-for="item in classOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="班级名称" :label-width="formLabelWidth">
          <el-input v-model="form.classinfoname" autocomplete="off"></el-input>
        </el-form-item>-->
        <el-form-item
          :label-width="formLabelWidth"
          label="性别">
          <el-input
            v-model="form.sex"
            autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="账号">
          <el-input
            v-model="form.login"
            autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="专业">
          <el-input
            v-model="form.profession"
            autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="联系方式">
          <el-input
            v-model="form.phone"
            autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="上课教师">
          <el-input
            v-model="form.lecturer"
            autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="班导">
          <el-input
            v-model="form.teacher"
            autocomplete="off" />
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
  getStudentList,
  updateStudent,
  getClassListById,
  addStudent,
  delStudent
} from '@/api/student'
import { getAllCampusmanage } from '@/api/class'

import qs from 'qs'
export default {
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
        campusname: '',
        campusid: '',
        lecturer: '',
        teacher: '',
        resource: '',
        stuname: '',
        classinfoid: '',
        classinfoname: '',
        login: '',
        phone: '',
        profession: '',
        sex: ''
      },
      formInline: {
        user: '',
        region: ''
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogTitle: '学生编辑'
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
    this.getStudent()
    getAllCampusmanage().then(res => {
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
    handleSizeChange(val) {
      this.pageLimit = val
      this.getStudent()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getStudent()
    },
    onSubmit() {
      this.dialogTitle = '新增学生'
      this.isAdd = true
      this.dialogFormVisible = true
      this.form.id = ''
      this.form.stuname = ''
      this.form.campusname = ''
      this.form.campusid = ''
      this.form.classinfoid = ''
      this.form.classinfoname = ''
      this.form.login = ''
      this.form.phone = ''
      this.form.profession = ''
      this.form.sex = ''
      this.form.lecturer = ''
      this.form.teacher = ''
    },
    getStudent() {
      let params = {
        page: this.page,
        limit: this.pageLimit
      }
      params = qs.stringify(params)
      getStudentList(params).then(res => {
        // console.log(res.data)
        this.total = res.data.count
        const obj = res.data.data
        // const i = 0
        this.tableData = []
        for (let i = 0; i < obj.length; i++) {
          const tempList = {}
          tempList.id = obj[i].id
          tempList.campusid = obj[i].campusid
          tempList.campusname = obj[i].campusname
          tempList.classinfoid = obj[i].classinfoid
          tempList.classinfoname = obj[i].classinfoname
          tempList.classinfoname = obj[i].classinfoname
          tempList.phone = obj[i].phone
          tempList.login = obj[i].login

          tempList.stuname = obj[i].stuname
          tempList.sex = obj[i].sex
          if (tempList.sex === '1') {
            tempList.isSex = '男'
          } else {
            tempList.isSex = '女'
          }

          tempList.teacher = obj[i].teacher
          tempList.profession = obj[i].profession

          tempList.lecturer = obj[i].lecturer
          this.tableData.push(tempList)
        }
      })
    },
    openEdit(row) {
      this.dialogTitle = '学生编辑'
      this.isAdd = false
      this.dialogFormVisible = true
      this.form.id = row.id
      this.form.stuname = row.stuname
      this.form.campusname = row.campusname
      this.form.campusid = row.campusid
      this.form.classinfoid = row.classinfoid
      this.form.classinfoname = row.classinfoname
      this.form.login = row.login
      this.form.phone = row.phone
      this.form.profession = row.profession
      this.form.sex = row.sex
      this.form.lecturer = row.lecturer
      this.form.teacher = row.teacher
    },
    editClass() {
      if (this.isAdd) {
        let params = {
          campusid: this.form.campusid,
          classinfoid: this.form.classinfoid,
          stuname: this.form.stuname,
          sex: 1,
          phone: this.form.phone,
          profession: this.form.profession,
          login: this.form.login,
          pwd: '123',
          lecturer: this.form.lecturer,
          teacher: this.form.teacher
        }
        params = qs.stringify(params)
        addStudent(params).then(res => {
          this.getStudent()
        })
      } else {
        let params = {
          id: this.form.id,
          stuname: this.form.stuname,
          campusname: this.form.campusname,
          campusid: this.form.campusid,
          classinfoid: this.form.classinfoid,
          classinfoname: this.form.classinfoname,
          login: this.form.login,
          phone: this.form.phone,
          profession: this.form.profession,
          sex: this.form.sex,
          lecturer: this.form.lecturer,
          teacher: this.form.teacher
        }
        params = qs.stringify(params)
        updateStudent(params)
          .then(res => {
            if (res.data === 'success') {
              this.dialogFormVisible = false
              this.$message({
                message: '恭喜你，修改成功',
                type: 'success'
              })
              this.getStudent()
            } else {
              this.$message.error('错了哦，修改错误')
            }
          })
          .catch(e => {
            this.$message.error('未知错误')
          })
      }
    },
    confirmDele(row) {
      let params = {
        id: row.id
      }
      params = qs.stringify(params)
      delStudent(params).then(res => {
        console.log(res.data)
        this.getStudent()
      })
    }
  }
}
</script>

<style>
</style>

