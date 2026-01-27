<template>
  <div class="head-overview-container">
    <div class="overview-left">
      <IconComp type="menu" class="icon"></IconComp>
      <div class="text">{{ curRoute }}</div>
    </div>
    <div class="overview-router">
      <div class="logout">
        <span @click="logout">退出</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import IconComp from '@/components/Icon/index.vue';
import { useUserStore } from '@/store/useUserStore';

const { logout } = useUserStore();

const route = useRoute();

const curRoute = computed(() => route.meta.title);
</script>

<style lang="less" scoped>
@import '@/styles/var.less';
.head-overview-container {
  width: 100%;
  height: 60px;
  background-color: @white;
  line-height: 60px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  .overview-left {
    display: flex;
    .icon {
      color: @gray;
    }
    .text {
      margin-left: 20px;
      color: @gray;
    }
  }
  .logout {
    cursor: pointer;
    color: @text;
  }
}
</style>
