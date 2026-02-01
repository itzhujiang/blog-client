<template>
  <div class="home-container">
    <Layout>
      <template #menu>
        <MenuComp ref="menuCompRef"></MenuComp>
      </template>
      <template #top>
        <HeadComp :history="history" :delHistory="menuCompRef?.delHistory" />
      </template>
      <template #content>
        <div class="content">
          <RouterView />
        </div>
      </template>
    </Layout>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import HeadComp from './components/Head/index.vue';
import MenuComp from './components/Menu/index.vue';

import Layout from '@/components/Layout/index.vue';
import type { HistoryType } from '@/utils/type';

defineOptions({
  name: 'HomeIndex',
});

const menuCompRef = ref<InstanceType<typeof MenuComp>>();

const history = computed<HistoryType[] | undefined>(() => menuCompRef.value?.getHistory());
</script>

<style lang="less" scoped>
@import '@/styles/var.less';
.home-container {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  .content {
    box-sizing: border-box;
    height: 100%;
  }
}
</style>
