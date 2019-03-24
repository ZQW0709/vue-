import axios from 'axios'

export function selectRealtimeanswer(params) { // 统计结果
  const url = 'http://localhost:9527/selectRealtimeanswer'
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
