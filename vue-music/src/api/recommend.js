// import jsonp from 'common/js/jsonp.js'
import {commonParams} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = '/api/recommend'
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

export function getDiscList() {
  const url = '/api/disclist'
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json',
    data: {'comm': {'ct': 24}, 'recomPlaylist': {'method': 'get_hot_recommend', 'param': {'async': 1, 'cmd': 2}, 'module': 'playlist.HotRecommendServer'}}
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 获取歌单歌曲
export function getDiscSongList(disstid) {
  const url = '/api/discsonglist'
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: disstid,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
