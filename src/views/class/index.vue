<template>
  <div class="app-container">
    <div>
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="班级名称">
          <el-input
            v-model="formInline.user"
            placeholder="班级名称"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="活动区域">
    <el-select v-model="formInline.region" placeholder="活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
        </el-form-item>-->
        <el-select
          v-model="value"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >查询</el-button>
          <el-button
            type="primary"
            @click="onSubmit"
          >新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="班级名称"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="campusname"
        label="所属学校"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="lecturer"
        label="上课教师"
      ></el-table-column>
      <el-table-column
        prop="teacher"
        label="班导"
      ></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="openEdit(scope.row)"
          >编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="confirmDele(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        layout="sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      center
    >
      <el-form :model="form">
        <el-form-item
          label="班级名称"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="所属学校" :label-width="formLabelWidth">
          <el-input v-model="form.campusname" autocomplete="off"></el-input>
        </el-form-item>-->
        <el-form-item
          label="所属学校"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="form.campusid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="上课教师"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.lecturer"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="班导"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.teacher"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editClass()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getClassmanageList,
  updateClassmanage,
  delClassmanage,
  getAllCampusmanage,
  addClassmanage
} from "@/api/class";
import qs from "qs";
export default {
  data() {
    return {
      tableData: [],
      options: [],
      value: "",
      isAdd: false,
      page: 1,
      limit: [10, 20, 30, 40],
      pageLimit: 10,
      total: 0,
      form: {
        id: 0,
        name: "",
        campusname: "",
        campusid: "",
        lecturer: "",
        teacher: "",
        resource: "",
        desc: ""
      },
      formInline: {
        user: "",
        region: ""
      },
      formLabelWidth: "120px",
      dialogFormVisible: false,
      dialogTitle: "班级编辑"
    };
  },
  created() {
    this.getClass();
    getAllCampusmanage().then(res => {
      const obj = res.data;

      this.options = [];
      for (let i = 0; i < obj.length; i++) {
        let tempList = {};
        tempList.value = obj[i].id;
        tempList.label = obj[i].name;
        this.options.push(tempList);
      }
    });
  },
  methods: {
    handleSizeChange(val) {
      this.pageLimit = val;
      this.getClass();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getClass();
    },
    onSubmit() {
      this.dialogTitle = "新增班级";
      this.isAdd = true;
      this.dialogFormVisible = true;
      this.form.id = "";
      this.form.name = "";
      this.form.campusname = "";
      this.form.campusid = "";
      this.form.lecturer = "";
      this.form.teacher = "";
    },
    getClass() {
      let params = {
        page: this.page,
        limit: this.pageLimit
      };
      params = qs.stringify(params);
      getClassmanageList(params).then(res => {
        // console.log(res.data)
        this.total = res.data.count;
        const obj = res.data.data;
        let i = 0;
        this.tableData = [];
        for (let i = 0; i < obj.length; i++) {
          let tempList = {};
          tempList.id = obj[i].id;
          tempList.campusid = obj[i].campusid;
          tempList.campusname = obj[i].campusname;
          tempList.name = obj[i].name;
          tempList.teacher = obj[i].teacher;
          tempList.lecturer = obj[i].lecturer;
          this.tableData.push(tempList);
        }
      });
    },
    openEdit(row) {
      this.dialogTitle = "班级编辑";
      this.isAdd = false;
      this.dialogFormVisible = true;
      this.form.id = row.id;

      this.form.name = row.name;
      this.form.campusname = row.campusname;
      this.form.campusid = row.campusid;

      this.form.lecturer = row.lecturer;
      this.form.teacher = row.teacher;
    },
    editClass() {
      if (this.isAdd) {
        let params = {
          campusid: this.form.campusid,
          name: this.form.name,
          classtime: "2019-01-15",
          teacher: this.form.teacher,
          lecturer: this.form.lecturer
        };
        params = qs.stringify(params);
        addClassmanage(params).then(res => {
          this.getClass();
        });
      } else {
        let params = {
          id: this.form.id,
          campusid: this.form.campusid,
          name: this.form.name,
          classtime: "2019-01-15",
          teacher: this.form.teacher,
          lecturer: this.form.lecturer
        };
        params = qs.stringify(params);
        updateClassmanage(params)
          .then(res => {
            if (res.data === "success") {
              this.dialogFormVisible = false;
              this.$message({
                message: "恭喜你，修改成功",
                type: "success"
              });
              this.getClass();
            } else {
              this.$message.error("错了哦，修改错误");
            }
          })
          .catch(err => {
            this.$message.error("未知错误");
          });
      }
    },
    confirmDele(row) {
      let params = {
        id: row.id
      };
      params = qs.stringify(params);
      delClassmanage(params).then(res => {
        console.log(res.data);
        this.getClass();
      });
    }
  }
};
</script>


<style>
</style>

