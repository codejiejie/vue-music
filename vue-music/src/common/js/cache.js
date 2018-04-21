import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const PLAY_KEY = '__play__'
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200
const SEARCH_MAX_LENGTH = 15
const PLAY_MAX_LENGTH = 200
// 插入数值 并且处理数组
function insertArray(arr, val, compare, maxLen) {
  // 看原数组中有没有query
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
  // 删除最后一位
    arr.pop()
  }
}
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
// 本地存储函数
export function saveSearch(query) {
  // 设置当前的search存储情况 没有的话就是空数组
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 从本地缓存读取storage 为historylist
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
export function clearSearch() {
  // 清空本地缓存
  storage.remove(SEARCH_KEY)
  return []
}
// 保存播放记录  写入
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}
// 读取
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

// 收藏喜欢歌曲
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}
// 删除收藏
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}
// 读取
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}