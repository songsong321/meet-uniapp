<template>
  <u-action-sheet :list="list" v-model="show"></u-action-sheet>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator'
@Component({
  name: 'ActionSheet'
}) // 装饰器
export default class MessagePage extends Vue {
  private list = [{
    text: '添加好友',
    color: '#087af0',
    fontSize: 28
  }, {
    text: '扫一扫',
    color: '#087af0',
    fontSize: 28
  }, {
    text: '帮助与反馈',
    color: '#087af0',
    fontSize: 28
  }]
  private show: boolean = false
  open () {
    this.show = true
  }
}
</script>

<style lang="scss" scoped>
  
</style>
