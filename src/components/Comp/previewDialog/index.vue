<template>
  <AModal
    v-model:open="dialogVisibleRef"
    :title="dialogConfigRef.title"
    :footer="null"
    :bodyStyle="{
      padding: '20px',
      linkHeight: 1.8,
      fontSize: '16px',
      color: '#333',
      maxHeight: '70vh',
      overflowY: 'auto',
      backgroundColor: '#9b9b9b',
      borderRadius: '10px',
    }"
  >
    <div class="content">
      <strong v-html="dialogConfigRef.content"></strong>
    </div>
  </AModal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

defineOptions({
  name: 'PreviewDialog',
});

type PreviewDialogConfig = {
  title: string;
  content: string;
};

defineExpose({
  open: (config: PreviewDialogConfig) => {
    Object.assign(dialogConfigRef, config);
    dialogVisibleRef.value = true;
  },
});

const dialogVisibleRef = ref<boolean>(false);
const dialogConfigRef = reactive<PreviewDialogConfig>({
  title: '',
  content: '',
});
</script>

<style lang="less" scoped></style>
