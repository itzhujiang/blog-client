<template>
  <div>
    <TableComp :config="config"></TableComp>
  </div>
</template>

<script setup lang="ts">
import { getSettingsList } from '@/api/blog/siteSetting';
import { TableComp, createTableConfig } from '@/components/Comp/index';
defineOptions({
  name: 'blogSiteSetting',
});

const config = createTableConfig({
  columns: [
    {
      title: 'id',
      dataIndex: 'id',
      width: 50,
      xtype: 'text',
    },
    {
      title: '站点key',
      dataIndex: 'settingKey',
      xtype: 'text',
    },
    {
      title: '站点值',
      dataIndex: 'settingValue',
      xtype: 'text',
    },
    {
      title: '站点值类型',
      dataIndex: 'settingType',
      xtype: 'text',
    },
    {
      title: '描述',
      dataIndex: 'description',
      xtype: 'text',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      xtype: 'dateTime',
    },
  ],
  api: getSettingsList,
});
</script>

<style lang="less" scoped></style>
