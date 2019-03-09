import axios from 'axios'

export function selectexamtype(params) { // 获取题目类型列表
  const url = 'http://localhost:9527/selectexamtype'
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function updateexamtype(params) { // 修改题目名称
  const url = 'http://localhost:9527/updateexamtype'
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function addexamtype(params) { // 添加题目类型
  const url = 'http://localhost:9527/addexamtype'
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function deleteexamtype(params) { // 删除题目类型
  const url = 'http://localhost:9527/deleteexamtype'
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getExaminfoList(params) { // 获取题目
  const url = 'http://localhost:9527/getExaminfoList'
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getAllexamtype() { // 获取题目类型
  const url = 'http://localhost:9527/getAllexamtype'
  return axios.post(url, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function updateExaminfo(params) { // 修改题目
  const url = 'http://localhost:9527/updateExaminfo'
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function addExaminfo(params) { // 添加题目
  const url = 'http://localhost:9527/addExaminfo'
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

