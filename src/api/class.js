import axios from 'axios'

export function getClassmanageList() {   //获取班级列表
    const url = 'http://localhost:9527/getClassmanageList'
    return axios.post(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
}

export function updateClassmanage(params) {  //修改
  const url = 'http://localhost:9527/updateClassmanage'
    return axios.post(url,params)
}

export function delClassmanage(params) {  //修改
  const url = 'http://localhost:9527/delClassmanage'
    return axios.post(url,params)
}

export function getAllCampusmanage(params) {  //获取校区所有数据 用于绑定下拉列表
  const url = 'http://localhost:9527/getAllCampusmanage'
    return axios.post(url,params)
}

