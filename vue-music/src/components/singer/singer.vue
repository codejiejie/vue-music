<template>
    <div class="singer" ref="singer">
        <listview @select="selectSinger" :data="singers" ref="list"></listview>
        <router-view></router-view>
    </div>
</template>

<script>
import {getSingerList} from 'api/singer.js'
import Singer from 'common/js/singer.js'
import Listview from 'base/listview/listview'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
const HOT_NAME = '热门'
const HOT_NAME_LENGTH = 10
export default {
  mixins: [playlistMixin],
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then((res) => {
        this.singers = this._normalizeSinger(res.data.list)
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      //  "002J4UUk29y8BY"  每一个都要push
      list.forEach((item, index) => {
        if (index < HOT_NAME_LENGTH) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      let hots = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hots.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hots.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    Listview
  }
}
</script>

<style lang="stylus" scoped>
    .singer
        position:fixed
        top:88px
        bottom:0
        width:100%
</style>