<template>
  <div class="home-menu-container">
    <h2 class="menu-title">后台系统</h2>
    <MenuComp ref="menuCompRef" height="60px"></MenuComp>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import MenuComp from '@/components/Menu/index.vue';
import type { HistoryType } from '@/utils/type';
const menuCompRef = ref<InstanceType<typeof MenuComp>>();

defineOptions({
  name: 'CompMenu',
});

defineExpose<{
  getHistory: () => HistoryType[];
  delHistory: (_id: string) => void;
}>({
  getHistory: () => menuCompRef.value!.getHistory(),
  delHistory: (id: string) => menuCompRef.value!.delHistory(id),
});
</script>

<style lang="less" scoped>
@import '@/styles/var.less';
.home-menu-container {
  width: 265px;
  height: 100%;
  overflow: auto;
  .menu-title {
    padding: 0;
    margin: 0;
    min-height: 60px;
    line-height: 60px;
    width: 100%;
    background-color: #fff;
    color: @second;
    text-align: center;
  }
}
</style>
