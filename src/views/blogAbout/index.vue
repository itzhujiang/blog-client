<template>
  <div class="about-container">
    <TableComp :config="config"></TableComp>
    <PreviewDialogComp ref="previewDialogCompRef"></PreviewDialogComp>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { getAboutInfo, type AboutInfo } from '@/api/blog/about';
import { TableComp, createTableConfig, PreviewDialogComp } from '@/components/Comp/index';
import { mdToHtml } from '@/utils/utils';

defineOptions({
  name: 'blogAbout',
});

const config = createTableConfig<Record<string, unknown>, AboutInfo>({
  columns: [
    {
      title: 'id',
      dataIndex: 'id',
      width: 50,
      xtype: 'text',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      xtype: 'text',
    },
    {
      title: '职业标签',
      dataIndex: 'jobTitle',
      xtype: 'text',
    },
    {
      title: '内容',
      dataIndex: 'content',
      xtype: 'render',
      render: () => {
        return '<a>查看</a>';
      },
      onClick: async value => {
        const html = await mdToHtml(value as string);
        previewDialogCompRef.value?.open({
          title: '内容',
          content: html,
        });
      },
    },
  ],
  api: getAboutInfo,
});

const previewDialogCompRef = ref<InstanceType<typeof PreviewDialogComp>>();
</script>

<style lang="less" scoped></style>
