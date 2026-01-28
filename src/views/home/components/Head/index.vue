<template>
  <div class="head-container">
    <HeadOverviewComp></HeadOverviewComp>
    <HeadHistoryComp :history="history" :delHistory="delHistory"></HeadHistoryComp>
  </div>
</template>

<script setup lang="ts">
import HeadHistoryComp from './HeadHistory.vue';
import HeadOverviewComp from './HeadOverview.vue';

import type { HistoryType } from '@/utils/type';

defineOptions({
  name: 'CompHead',
});

defineProps<{
  history?: HistoryType[];
  delHistory?: (_id: string) => void;
}>();
</script>

<style lang="less" scoped>
.head-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
