<template>
    <scroll
        class="listview"
        :data="data"
        ref="listview"
        :listenScroll="listenScroll"
        :probeType="probeType"
        @scroll="scroll"
    >
        <ul>
            <li :key="index" v-for="(group,index) in data" class="list-group" ref="listgroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li @click="selectItem(item)" v-for="(item,index) in group.items" :key="index" class="list-group-item">
                        <img v-lazy="item.avatar" class="avatar"/>
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li
                    :key="index"
                    v-for="(item,index) in shortcutList"
                    class="item"
                    :class="{current:cIndex===index}"
                    :data-index="index"
                >
                    {{item}}</li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixtitle" ref="fixed">
            <h2 class="fixtitle">{{fixtitle}}</h2>
        </div>
        <div v-show="!data.length" class="loading-container">
            <loading></loading>
        </div>
    </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getData} from 'common/js/dom'
const TITLE_HEIGHT = 30
export default {
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  data() {
    return {
      scrollY: -1,
      cIndex: 0,
      diff: -1
    }
  },
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  computed: {
    shortcutList() {
      return this.data.map(function (group) {
        return group.title.substr(0, 1)
      })
    },
    fixtitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.cIndex] ? this.data[this.cIndex].title : ''
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart(e) {
      // 获取li的实际高度
      let clientH = e.target.clientHeight
      this.touch.clientHeight = clientH
      // 获取li的index
      let currentIndex = getData(e.target, 'index')
      // 开始的y方向高度
      let firstStart = e.touches[0]
      this.touch.currentIndex = currentIndex
      this.touch.y1 = firstStart.pageY
      this._scrollTo(currentIndex)
    },
    onShortcutTouchMove(e) {
      let firstStart = e.touches[0]
      this.touch.y2 = firstStart.pageY
      let delta = (this.touch.y2 - this.touch.y1) / this.touch.clientHeight | 0
      let currentIndex = parseInt(this.touch.currentIndex) + delta
      this._scrollTo(currentIndex)
    },
    refresh() {
      this.$refs.listview.refresh()
    },
    scroll(pos) {
      this.scrollY = pos.y
      //  console.log(this.scrollY)
    },
    _scrollTo(index) {
      // 0 是动画的缓动时间
      // index不能为null  0是可以的
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      if (!index && index !== 0) {
        return
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY大于0
      if (newY > 0) {
        this.cIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.cIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 在滚动到底部的时候 直接赋值
      this.cIndex = listHeight.length - 2
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      // 减少dom操作次数  大部分时间为0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
    .listview
        position:relative
        width:100%
        height:100%
        overflow:hidden
        background: $color-background
        .list-group
            padding-bottom: 30px
            .list-group-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background
            .list-group-item
                display: flex
                align-items: center
                padding: 20px 0 0 30px
                .avatar
                    width: 50px
                    height: 50px
                    border-radius: 50%
                .name
                    margin-left: 20px
                    color: $color-text-l
                    font-size: $font-size-medium
        .list-shortcut
            position:absolute
            right:0
            top:50%
            z-index:30
            transform:translateY(-50%)
            width:20px
            text-align:center
            padding:20px 0
            background:$color-background-d
            font-family:Helvetica
            border-radius:10px
            .item
                padding:3px
                line-height:1
                color:$color-text-l
                font-size:$font-size-small
                &.current
                    color:$color-theme
        .list-fixed
            width:100%
            position:absolute
            top:0
            left:0
            .fixtitle
                height:30px
                line-height:30px
                font-size: $font-size-small
                color: $color-text-l
                background:$color-highlight-background
                padding-left:20px
        .loading-container
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>