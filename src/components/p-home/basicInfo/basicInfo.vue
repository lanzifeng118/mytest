<template>
<div class="basic-info">
  <h2 class="basic-info-welcome">你好，{{user.name}}！<span>您上次登录时间为：{{user.lastlogintime}}</span></h2>
  <router-link to="/admin/home/edit" class="basic-info-btn button" >
    <span class="icon icon-edit"></span>编辑
  </router-link>
  <div class="display-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="100">公司名称<span class="separate"></span></td>
          <td>{{basicInfo.name}}</td>
        </tr>
        <tr>
          <td class="vertical-middle">LOGO<span class="separate"></span></td>
          <td><img class="basic-info-img" :src="basicInfo.logo" alt=""></td>
        </tr>
        <tr>
          <td>地址<span class="separate"></span></td>
          <td>{{basicInfo.address}}</td>
        </tr>
        <tr>
          <td>邮箱<span class="separate"></span></td>
          <td>{{basicInfo.email}}</td>
        </tr>
        <tr>
          <td>电话<span class="separate"></span></td>
          <td>{{basicInfo.telephone}}</td>
        </tr>
        <tr>
          <td>工作时间<span class="separate"></span></td>
          <td>{{basicInfo.worktime}}</td>
        </tr>
        <tr>
          <td>广告图<span class="separate"></span></td>
          <td>
            <ul class="basic-info-banner-ul f-clearfix">
              <li class="basic-info-banner-li" v-for="banner in basicInfo.banner">
                <img :src="banner.img" alt="">
                <a :href="banner.link" v-if="banner.link">{{banner.link}}</a>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>简介<span class="separate"></span></td>
          <td v-html="basicInfo.brief" class="basic-info-breif"></td>
        </tr>
      </tbody>
    </table>
    <toast
      v-show="toast.show"
      :text="toast.text"
    >
    </toast>
  </div>

</div>
</template>

<script>
import toast from 'components/toast/toast'
export default {
  data() {
    return {
      basicInfo: {},
      toast: {
        show: false,
        text: '获取信息失败，请稍后再试'
      }
    }
  },
  computed: {
    user() {
      return {
        name: this.$store.state.user.name,
        lastlogintime: this.$store.state.user.lastlogintime
      }
    }
  },
  created() {
    let _this = this
    _this.axios.post('/api/admin/basicinfo', {
      method: 'query'
    }).then((response) => {
      // console.log(response)
      let data = response.data
      if (data.code === '200') {
        _this.basicInfo = data.data
        // console.log(_this.basicInfo)
      } else {
        _this.toast.show = true
        setTimeout(() => {
          _this.toast.show =false
        }, 1000)
      }
    }).catch((error) => {
      if (error) {
        console.log(error)
        // _this.$router.push('/error')
      }
    })
  },
  components: {
    toast
  }
}
</script>

<style>
@import "../common/basicInfo.css";
</style>
