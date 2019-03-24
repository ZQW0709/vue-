import axios from 'axios'

export function selectStudentsanswer(params) { // 统计结果
  const url = 'http://localhost:9527/selectStudentsanswer'
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
