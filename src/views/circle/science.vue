<template>
  <div>
    <!--<div class="_full_inner fonthui _effect" :class="{'_effect&#45;&#45;30':decline}">-->
    <div class="_full_inner fonthui">
      <circleSearch></circleSearch>
      <circle-header></circle-header>
      <div class="scrollable-content" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" >
        <mt-loadmore class="_full_inner" :auto-Fill="false" top-Pull-Text="下拉刷新" top-Loading-Text="刷新中..." bottom-Pull-Text="上拉加载" bottom-Loading-Text="加载中..." bottom-Distance="10" @top-status-change="handleTopChange" :top-method="loadTop"
                     :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="loadStatus.allLoaded" ref="loadmore">
          <div class="cont-zhbox" v-for="item in data.list">
            <div class="cont-zhbox-t">
              <router-link :to="{ path: 'content/10' }" append class="bz">
                <p class="cont-zhbox-a"><b>{{item.name}}</b></p>
                <p class="cont-zhbox-img"><img src="/static/images/j2.jpg"></p>
                <p class="cont-zhbox-nav"></p>
              </router-link>
              <div class="zhbox">
                <div class="zh-tx">
                  <img src="/static/images/imgsss.png">
                </div>
                <div class="zh-wz">
                  <div class="zh-wz-x">
                    <p class="zh-wz-name">{{item.userName}}<img src="/static/images/ddbm.png" class="zh-wz-name-ico">
                    </p>
                  </div>
                  <div class="njk">
                    <a href="javascript:;" class="weui_btn weui_btn_mini weui_btn_default">关注</a>
                  </div>
                  <div class="zh-wz-time">
                    <span style="float:left">{{item.time}}</span>
                    <!--<span style="float:right"></span>-->
                    <span style="float:right; margin-right:10px"></span>
                    <p style="clear:both"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <errorComponent v-if="errorStatus.noData" :message="errorStatus.message"></errorComponent>
          <div slot="top" class="mint-loadmore-top">
            <span v-show="loadStatus.topStatus !== 'loading'" :class="{ 'is-rotate': loadStatus.topStatus === 'drop' }">↓</span>
            <span v-show="loadStatus.topStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
          </div>
          <div slot="bottom" v-show="!loadStatus.allLoaded" class="mint-loadmore-bottom">
            <span v-show="loadStatus.bottomStatus !== 'loading'" :class="{ 'is-rotate': loadStatus.bottomStatus === 'drop' }">↑</span>
            <span v-show="loadStatus.bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
          </div>
        </mt-loadmore>
      </div>
    </div>
    <!--<transition name="custome-fade"-->
    <!--enter-active-class="animated slideInRight"-->
    <!--leave-active-class="animated slideOutLeft">-->
    <transition>
      <keep-alive>
        <router-view v-on:update-decline="update" class="cover-transition"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
  import circleHeader from '../../components/circle/header'
  import circleSearch from '../../components/circle/search'
  import {getScienceList} from '../../apis/science'
  import {Loadmore} from 'mint-ui';
  import errorComponent from '../../components/common/error'
  export default {
    data() {
      return {
        decline: false,
        loadStatus:{
          topStatus: '',
          bottomShow:true,
          bottomStatus: '',
          allLoaded: true,
        },
        errorStatus: {
          noData: false,
          message: ""
        },
        wrapperHeight: '',
        data: {
          list: [],
          lastId: 0
        }
      }
    },
    components: {
      circleHeader,
      circleSearch,
      Loadmore,
      errorComponent
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight - 50;
    },
    methods: {
      handleTopChange(status) {
        this.loadStatus.topStatus = status;
      },
      handleBottomChange(status) {
        this.loadStatus.bottomStatus = status;
      },
      update: function (_decline) {
        this.decline = _decline
      },
      loadTop: function (id) {
        this.data.lastId = 0
        let $this = this

        getScienceList($this.data.lastId)
          .then(function (data) {
            if (data == null) {
              $this.errorStatus.noData = true
              $this.errorStatus.message = "没有数据"
              $this.loadStatus.allLoaded = true
            } else {
              $this.loadStatus.allLoaded = false
              $this.noData = false
              $this.data.lastId = data.lastId
              $this.data.list = data.list
              $this.$refs.loadmore.onTopLoaded(id);
            }
          })
          .catch(function () {
            $this.loadStatus.topStatus=''
            $this.errorStatus.noData = true
            $this.errorStatus.message = "网络异常"
            $this.loadStatus.allLoaded = true
          })
      },
      loadBottom: function (id) {
        this.getScinenceListByPage(id)
      },
      getScinenceListByPage: function (id) {
        let $this = this
        getScienceList($this.data.lastId)
          .then(function (data) {
            if(data==null){
              $this.loadStatus.allLoaded = true
            }else{
              $this.data.lastId = data.lastId
              for (let i = 0; i < data.list.length; i++) {
                $this.data.list.push(data.list[i])
              }
              $this.$refs.loadmore.onBottomLoaded(id);
              $this.loadStatus.allLoaded = false
            }
          })
          .catch(function (error) {
            $this.loadStatus.topStatus=''
            $this.loadStatus.allLoaded = true
          })
      }
    },
    created(){
      this.loadTop()
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight - (42 + 50);
    }
  }
</script>
<style>
  @import "../../../static/css/animate.css";

  .mint-loadmore-content {
    height: 100% !important;
    width: 100% !important;
    position: absolute;
  }

  .mint-loadmore-top {
    text-align: center;
    height: 50px;
    line-height: 50px;
  }

  .mint-loadmore-top span {
    display: inline-block;
    -webkit-transition: .2s linear;
    transition: .2s linear;
    vertical-align: middle;
  }

  .mint-loadmore {
    overflow: auto !important;
  }

  .mint-spinner-snake {
    box-sizing: border-box !important;
  }
  .mint-loadmore-bottom span {
    display: inline-block;
    -webkit-transition: .2s linear;
    transition: .2s linear;
    vertical-align: middle;
  }
</style>
