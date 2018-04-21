const express = require('express')
const axios = require('axios')
const app = express()

// 轮播图
app.get('/api/recommend',(req,res)=> {
    const url='https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    axios.get(url,{
        headers:{
            referer:'https://m.y.qq.com/'
        },
        params: req.query
    }).then((response)=>{
        res.json(response.data)
    }).catch((e)=>{
        console.log(e)
    })
})
// 歌单
app.get('/api/disclist',(req,res)=> {
    const url='https://u.y.qq.com/cgi-bin/musicu.fcg'
    axios.get(url,{
        headers:{
            referer:'https://y.qq.com/'
        },
        params: req.query
    }).then((response)=>{
        res.json(response.data)
    }).catch((e)=>{
        console.log(e)
    })
})
// 歌手
app.get('/api/singer',(req,res)=> {
    const url='https://c.y.qq.com/v8/fcg-bin/v8.fcg'
    axios.get(url,{
        headers:{
            cookie:'yqq_stat=0',
            referer:'https://y.qq.com/portal/singer_list.html'
        },
        params: req.query
    }).then((response)=>{
        res.json(response.data)
    }).catch((e)=>{
        console.log(e)
    })
})
// 获取歌词
app.get('/api/lyric',(req,res)=> {
    const url='https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
    axios.get(url,{
        headers:{
            referer:'https://y.qq.com/portal/player.html'
        },
        params: req.query
    }).then((response)=>{
        let ret=response.data
        if(typeof ret === 'string'){
            let reg = /^\w+\(({[^()]+})\)$/
            let matches = ret.match(reg)
            if(matches){
                ret = JSON.parse(matches[1])
            }
        }
        res.json(ret)
    }).catch((e)=>{
        console.log(e)
    })
})
// 获取歌单歌曲
app.get('/api/discsonglist',(req,res)=> {
    const url='https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
    let disstid = req.query.disstid
    axios.get(url,{
        headers:{
            cookie:'yqq_stat=0',
            referer:`https://y.qq.com/n/yqq/playsquare/${disstid}.html`
        },
        params: req.query

    }).then((response)=>{
        res.json(response.data)
    }).catch((e)=>{
        console.log(e)
    })
})
// 获取排行榜数据
app.get('/api/toplist',(req,res)=> {
    const url='https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
    axios.get(url,{
        headers:{
            origin:'https://m.y.qq.com',
            referer:'https://m.y.qq.com/'
        },
        params: req.query

    }).then((response)=>{
        res.json(response.data)
    }).catch((e)=>{
        console.log(e)
    })
})
// 获取排行榜歌曲
app.get('/api/topmusiclist',(req,res)=> {
    const url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
    let id = req.query.topid
    axios.get(url,{
        headers:{
            origin:'https://y.qq.com',
            referer:`https://y.qq.com/w/toplist.html?ADTAG=myqq&from=myqq&channel=10007100&id=${id}&type=top`
        },
        params: req.query
    }).then((response)=>{
        res.json(response.data)
    }).catch((e)=>{
        console.log(e)
    })
})
// 获取搜索字段
app.get('/api/hotkey',(req,res)=> {
    const url='https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
    axios.get(url,{
        headers:{
            origin:'https://m.y.qq.com',
            referer:'https://m.y.qq.com/'
        },
        params: req.query
    }).then((response)=>{
        res.json(response.data)
    }).catch((e)=>{
        console.log(e)
    })
})
// 获取搜索歌曲、歌手
app.get('/api/search',(req,res)=> {
    const url='https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
    axios.get(url,{
        headers:{
            origin:'https://m.y.qq.com',
            referer:'https://m.y.qq.com/'
        },
        params: req.query
    }).then((response)=>{
        res.json(response.data)
    }).catch((e)=>{
        console.log(e)
    })
})

app.use(express.static('./dist'))
app.listen(9000,function(){
    console.log("start")
});