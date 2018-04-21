<template>
    <transition name="slide">
        <music-list :rank='rank' :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>
</template>
<script>
import MusicList from '@/components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getTopMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
export default {
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  computed: {
    title() {
      return this.toplist.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'toplist'
    ])
  },
  created() {
    this._getTopMusicList()
  },
  methods: {
    _getTopMusicList() {
      if (!this.toplist.id) {
        this.$router.push('/rank')
        return
      }
      getTopMusicList(this.toplist.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeTopMusicList(res.songlist)
        }
      })
    },
    _normalizeTopMusicList(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>
<style lang="stylus" scoped>
    .slide-enter-active,.slide-leave-active
        transition: all 0.3s ease
    .slide-enter,.slide-leave-to
        transform: translate3d(100%,0,0)
</style>