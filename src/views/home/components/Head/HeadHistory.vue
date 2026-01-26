<template>
  <div class="head-history-container">
    <div class="main">
      <div v-for="(item,index) in history" :key="item.id" class="item" :class="{active: item.id === selectedKey}" @click="onHistoryItmeClick(item)">
      <div class="text">
        <div :class="{ circle: item.id === selectedKey }"></div>
        <div>{{ item.title }}</div>
      </div>
      <IconComp type="del" class="icon" v-if="index !== 0" @click.stop="onDelClick(item.id)"></IconComp>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import IconComp from '@/components/Icon/index.vue'
import type { HistoryType } from '@/utils/type';


const props = defineProps<{
    history?: HistoryType[],
    delHistory?: (_id: string) => void
}>();

const route = useRoute();
const router = useRouter();

const selectedKey = computed(() => route.meta.id + '-' + (route.name as string))

const onHistoryItmeClick = (item: HistoryType) => {
  router.push({
    name: item.pathName
  })
}

/**
 * 点击删除
 * @param id 
 */
const onDelClick = (id: string) => {
  if (props.delHistory) {
    const key = route.meta.id + '-' + (route.name as string)
    if (key === id) {
      const index = props.history?.findIndex(item => item.id === id)
      const pathName = props.history && index && props.history[index - 1]?.pathName || '';
      router.replace({
        name: pathName
      })
    }
    props.delHistory(id)

  }

}

</script>

<style lang="less" scoped>
@import '@/styles/var.less';
.head-history-container{
  padding: 0 20px;
  width: 100%;
  height: 30px;
  background-color: @white;
  box-sizing: border-box;
  .main{
    display: flex;
    height: 100%;
    align-items: center;
  }
  .item{
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 25px;
    line-height: 25px;
    border: 1px solid @dark;
    margin-right: 10px;
    color: @text;
    font-size: 14px;
    &:last-child{
      margin-right: 0;
    }
    &.active{
      background: @primary;
      color: @white;
      border: 0;
    }
    .text{
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .circle{
        margin-right: 10px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: @white;
      }
    }
    .icon{
      margin-left: 10px;
      font-size: 16px;
    }
   
  }
}
</style>