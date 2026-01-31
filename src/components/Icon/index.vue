<template>
  <i class="iconfont icon-container" :class="icon"></i>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'comp-icon',
});

const iconMap = {
  article: 'icon-16',
  blog: 'icon-bokeyuan',
  file: 'icon-wenjian',
  category: 'icon-fenlei',
  menu: 'icon-caidan',
  del: 'icon-shanchu',
  jiantou_xiangyou: 'icon-jiantou_xiangyou',
  comment: 'icon-pinglun',
  about: 'icon-guanyuwomen',
  setting: 'icon-shezhi',
  system: 'icon-xitong',
  user: 'icon-yonghu',
};

const props = defineProps<{
  type?: keyof typeof iconMap;
}>();

const icon = computed(() => (props.type ? iconMap[props.type] : ''));
</script>

<style lang="less" scoped>
@import '//at.alicdn.com/t/c/font_5116467_oh5bkw1bhwp.css';
.iconfont {
  color: inherit;
  font-size: inherit;
}
</style>
