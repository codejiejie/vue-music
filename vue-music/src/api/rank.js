import axios from 'axios'
import {commonParams} from './config'
// 排行榜
export function getTopList() {
  const url = '/api/toplist'
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 排行榜歌曲
export function getTopMusicList(topid) {
  const url = '/api/topmusiclist'
  const data = Object.assign({}, commonParams, {
    topid,
    g_tk: 5381,
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}