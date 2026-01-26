<template>
  <div style="width: 100%;">
    <AConfigProvider :locale="locale">
      <RouterView />
    </AConfigProvider>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
const locale = zhCN;
</script>

<style scoped>

</style>
