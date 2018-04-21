<template>
    <div class="m-header">
        <div class="icon"></div>
        <h1 class="text">Code Music</h1>
        <router-link to="/user" class="mine" tag="div">
            <i class="icon-mine"></i>
        </router-link>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" scoped>
    @import "~common/stylus/variable.styl";
    @import "~common/stylus/mixin.styl";

    .m-header
        position:relative
        height:44px
        text-align:center
        font-size:0
        /*background:red*/
        color:$color-theme
        .icon
            display:inline-block
            vertical-align:top
            margin-top:6px
            bg-image('logo')
            width:30px
            height:32px
            background-size: 30px 32px
            margin-right:12px
        .text
            display:inline-block
            vertical-align:top
            line-height:44px
            font-size: $font-size-large
        .mine
            position: absolute
            top: 0
            right: 0
            .icon-mine
                display: block
                padding: 12px
                font-size: 20px
                color: $color-theme
</style>