<template>
  <AModal
    v-model:open="dialogVisibleRef"
    :title="dialogConfigRef.title"
    :footer="null"
    :width="800"
    class="preview-dialog"
  >
    <div class="preview-content" v-html="dialogConfigRef.content"></div>
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

<style lang="less" scoped>
.preview-dialog {
  :deep(.ant-modal-body) {
    padding: 24px;
    max-height: 70vh;
    overflow-y: auto;
    background-color: #f5f5f5;

    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;

      &:hover {
        background: #a8a8a8;
      }
    }
  }

  .preview-content {
    line-height: 1.8;
    font-size: 16px;
    color: #333;
    word-wrap: break-word;
    word-break: break-word;
    max-height: 500px;
    overflow: auto;
    // 优化内容排版
    :deep(p) {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      margin-top: 16px;
      margin-bottom: 12px;
      font-weight: 600;
      line-height: 1.4;

      &:first-child {
        margin-top: 0;
      }
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 24px;
      margin-bottom: 12px;
    }

    :deep(li) {
      margin-bottom: 6px;
    }

    :deep(code) {
      padding: 2px 6px;
      background-color: #e8e8e8;
      border-radius: 3px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 14px;
    }

    :deep(pre) {
      padding: 16px;
      background-color: #ffffff;
      border-radius: 4px;
      overflow-x: auto;
      margin-bottom: 12px;
      border: 1px solid #e0e0e0;
      white-space: pre;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
      color: #333;

      code {
        padding: 0;
        background-color: transparent;
      }
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      margin: 12px 0;
    }

    :deep(blockquote) {
      padding: 12px 16px;
      margin: 12px 0;
      border-left: 4px solid #d0d0d0;
      background-color: #ffffff;
      color: #666;
    }

    :deep(a) {
      color: #1890ff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
