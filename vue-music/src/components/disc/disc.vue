<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>
<script>
import MusicList from '@/components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getDiscSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
export default {
  computed: {
    title() {
      return this.disc.title
    },
    bgImage() {
      return this.disc.cover
    },
    ...mapGetters([
      'disc'
    ])
  },
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getDiscSongList()
  },
  methods: {
    _getDiscSongList() {
      if (!this.disc.content_id) {
        this.$router.push({
          path: '/recommend'
        })
        return
      }
      getDiscSongList(this.disc.content_id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
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
    @import "~common/stylus/variable"
    .slide-enter-active,.slide-leave-active
        transition:all 0.3s
     .slide-enter,.slide-leave-to
        transform:translate3d("100%",0,0)
</style>