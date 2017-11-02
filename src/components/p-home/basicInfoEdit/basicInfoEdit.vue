<template>
<div class="basic-info-edit">
  <h2 class="edit-h2">编辑基础信息</h2>
  <router-link to="/admin/home" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="90">公司名称</td>
          <td><input type="text" v-model="basicInfo.name"></td>
        </tr>
        <!-- logo -->
        <tr>
          <td class="vertical-top">LOGO<span class="separate"></span></td>
          <td>
            <div class="edit-img f-clearfix">
              <div class="edit-img-box">
                <img class="" :src="basicInfo.logo" alt="">
              </div>
              <p class="edit-img-note">（400px × 120px，100kb以内）</p>
            </div>
            <div class="basic-info-edit-upload">
              <label for="inputLogo" class="button button-second">选择图片</label>
              <input type="file" id="inputLogo" accept="image/png, image/jpeg, image/gif, image/jpg"
              @change="chooseLogo">
              <button type="button" class="button button-second basic-info-edit-delete" @click="deleteLogo">删除图片</button>
            </div>
          </td>
        </tr>
        <tr>
          <td class="vertical-middle">地址</td>
          <td><textarea type="text" rows="2" v-model="basicInfo.address"></textarea></td>
        </tr>
        <tr>
          <td>邮箱</td>
          <td><input type="text" v-model="basicInfo.email"></td>
        </tr>
        <tr>
          <td>电话</td>
          <td><input type="text" v-model="basicInfo.telephone"></td>
        </tr>
        <!-- ad -->
        <tr>
          <td>广告图</td>
          <td>
            <!-- add ad -->
            <label for="addAd" class="button button-second">添加图片</label>
            <input type="file" id="addAd" accept="image/png, image/jpeg, image/gif, image/jpg"
            @change="addAd">
            <ul class="basic-info-edit-banner-ul f-clearfix">
              <li class="basic-info-edit-banner-li" v-for="(banner, index) in basicInfo.banner">
                <div class="basic-info-edit-banner-img">
                  <img :src="banner.img">
                  <!-- changeAd -->
                  <label :for="'ad' + index">选择图片</label>
                  <input type="file" :id="'ad' + index" accept="image/png, image/jpeg, image/gif, image/jpg"
                  @change="changeAd(index, $event)">
                </div>
                <div class="basic-info-edit-banner-input">
                  链接<input type="text" v-model="banner.link" placeholder="">
                </div>
                <div class="basic-info-edit-banner-input">
                  顺序<input type="text" v-model="banner.sort" placeholder="">
                </div>
                <!-- delete ad -->
                <span class="icon-round_close_fill" @click="deleteAd(index)"></span>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>简介</td>
          <td>
            <quill-editor
              v-model="basicInfo.brief"
              :options="editorOption"
              >
            </quill-editor>
          </td>
        </tr>
        <tr>
          <td></td>
          <td><button type="button" class="button" @click="submit">提交</button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <toast
    v-show="toastLogoErrorShow"
    text="图片太大啦！"
  >
  </toast>
  <toast
    v-show="toase.submitShow"
    :text="toase.submitText"
    :icon="toase.submitIcon"
  >
  </toast>
</div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import toast from 'components/toast/toast'
export default {
  data() {
    return {
      basicInfo: {
        name: '',
        address: '',
        email: '',
        telephone: '',
        logo: '',
        brief: ''
      },
      // quill
      editorOption: {
        placeholder: '输入内容...',
        modules: {
          toolbar: this.$store.state.quillEditor.easy
        }
      },
      // file
      file: null,
      // ad
      ad: [],
      adSendIndex: 0,

      toastLogoErrorShow: false,
      // submit
      toase: {
        submitShow: false,
        submitText: '正在提交...',
        submitIcon: 'upload'
      }
    }
  },
  created() {
    let _this = this
    _this.axios({
      method: 'post',
      url: '/api/admin/basicinfo',
      data: {
        method: 'query',
        lang: 'cn'
      }
    }).then((response) => {
      let data = response.data.data
      _this.basicInfo = data
    })
  },
  methods: {
    chooseLogo(e) {
      let _this = this
      if (e.target.files[0].size > 10240000) {
        _this.toastLogoErrorShow = true
        _this.file = null
        setTimeout(() => {
          _this.toastLogoErrorShow = false
        }, 500)
        return
      }
      _this.file = e.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(_this.file)
      reader.onload = function(e) {
        _this.basicInfo.logo = e.target.result
      }
    },
    deleteLogo() {
      if (this.basicInfo.logo !== '') {
        this.basicInfo.logo = ''
      }
    },
    // ad
    addAd(e) {
      let _this = this
      let reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = function(e) {
        _this.basicInfo.banner.push({img: e.target.result, order: '', link: ''})
        _this.ad.push({img: e.target.result, id: _this.basicInfo.banner.length - 1})
      }
    },
    changeAd(index, e) {
      let newUpload = false
      let _this = this
      let reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = function(e) {
        // 修改新上传
        _this.ad.forEach((v, i) => {
          if (index === v.id) {
            v.img = e.target.result
            _this.basicInfo.banner[v.id].img = e.target.result
            newUpload = true
          }
        })
        // 修改不是新上传
        if (!newUpload) {
          let item = _this.basicInfo.banner[index]
          item.img = e.target.result
          _this.ad.push({img: e.target.result, id: index, link: item.link})
        }
      }
    },
    deleteAd(index) {
      this.ad.forEach((v, i) => {
        if (index === v.id) {
          // 删除新上传
          this.ad.splice(i, 1)
        } else if (index < v.id) {
          v.id--
        }
      })
      // console.log(this.ad)
      this.basicInfo.banner.splice(index, 1)
    },
    submit() {
      // 如果上传了图片
      this.toase.submitShow = true
      this.sendLogo()
    },
    sendLogo() {
      let _this = this
      console.log(_this.file)
      if (_this.file) {
        _this.uploadFile(_this.file, (data) => {
          console.log(data)
          _this.basicInfo.logo = data.url
          _this.sendAd()
        })
      } else {
        _this.sendAd()
      }
    },
    sendAd() {
      let _this = this
      // console.log(obj)
      console.log(this.adSendIndex)
      if (_this.adSendIndex < this.ad.length) {
        let obj = this.ad[_this.adSendIndex]
        _this.uploadFile(obj, (data) => {
          _this.adSendIndex++
          _this.basicInfo.banner[obj.id] = data.url
          _this.sendAd()
        })
      } else {
        // console.log('sendBasicInfo')
        _this.adSendIndex = 0
        _this.sendBasicInfo()
      }
    },
    sendBasicInfo() {
      let _this = this
      // basicinfo
      _this.axios({
        method: 'post',
        url: '/api/admin/basicinfo',
        headers: {'Content-Type': 'application/json'},
        data: {
          method: 'update',
          lang: 'cn',
          data: _this.basicInfo
        }
      }).then((response) => {
        let data = response.data
        if (data.code === '200') {
          _this.showSuccess()
        } else {
          _this.showError()
        }
      })
    },
    uploadFile(file, callback) {
      let _this = this
      let formData = new FormData()
      formData.append('upload', file)
      _this.axios({
        method: 'post',
        url: '/api/admin/upload',
        headers: {'content-type': 'multipart/form-data'},
        data: formData
      }).then((res) => {
        let data = res.data
        if (data.code === '200') {
          callback(data)
        } else {
          _this.showError()
        }
      }).catch((err) => {
        console.log(err)
        _this.showError()
      })
    },
    showError() {
      let _this = this
      _this.toase.submitText = '出错了！'
      _this.toase.submitIcon = 'sad'
      setTimeout(() => {
        _this.toase.submitShow = false
      }, 500)
    },
    showSuccess() {
      let _this = this
      _this.toase.submitText = '提交成功！'
      _this.toase.submitIcon = 'appreciate'
      setTimeout(() => {
        _this.toase.submitShow = false
        _this.$router.push('/admin/home')
      }, 500)
    }
  },
  components: {
    quillEditor,
    toast
  }
}
</script>

<style>
@import "../common/basicInfoEdit.css";
</style>
