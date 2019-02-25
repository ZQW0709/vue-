import axios from 'axios'

export function getStudentList(params) {   //获取学生列表
  const url = 'http://localhost:9527/getStudentList'
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function updateStudent(params) {  //修改
  const url = 'http://localhost:9527/updateStudent'
  return axios.post(url, params)
}

export function delStudent(params) {  //删除
  const url = 'http://localhost:9527/delStudent'
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getClassListById(params) {  //根据校区获取班级相关列表
  const url = 'http://localhost:9527/getClassListById'
  return axios.post(url, params)
}

export function addStudent(params) {  //新增
  const url = 'http://localhost:9527/addStudent'
  return axios.post(url, params)
}

