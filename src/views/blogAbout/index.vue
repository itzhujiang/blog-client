<template>
  <div class="about-container">
    <TableComp :config="config"></TableComp>
    <PreviewDialogComp ref="previewDialogCompRef"></PreviewDialogComp>
    <!-- <DynamicsFormComp v-model="value" :config="dynamicsFormConfig"></DynamicsFormComp> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { getAboutInfo, updateAboutInfo, type AboutInfo } from '@/api/blog/about';
import { DynamicsFormComp, createDynamicsFormConfig } from '@/components/Comp/index';
import { TableComp, createTableConfig, PreviewDialogComp } from '@/components/Comp/index';
import { mapToArr } from '@/utils/utils';
// // import { mdToHtml } from '@/utils/utils';

defineOptions({
  name: 'blogAbout',
});

// const value = ref([
//   {
//     title: '张三',
//   },
// ]);

// const dynamicsFormConfig = createDynamicsFormConfig({
//   showAddButton: true,
//   height: 300,
//   columns: [
//     {
//       title: '标题',
//       dataIndex: 'title',
//       xtype: 'input',
//     },
//   ],
// });

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
      dataIndex: 'contentUrl',
      xtype: 'render',
      render: () => {
        return '<a>查看</a>';
      },
      onClick: async value => {
        previewDialogCompRef.value?.open({
          title: '内容',
          content: value as string,
        });
      },
    },
    {
      title: '个人标签',
      dataIndex: 'personalTags',
      xtype: 'render',
      render: value => {
        return (value as string[]).join('、');
      },
    },
    {
      title: '联系方式',
      dataIndex: 'contactInfo',
      xtype: 'render',
      render: () => {
        return '<a>查看</a>';
      },
      onClick: value => {
        previewDialogCompRef.value?.open({
          title: '联系方式',
          content: `<pre>${JSON.stringify(value, null, 2)}</pre>`,
        });
      },
    },
    {
      title: '社交媒体',
      dataIndex: 'socialLinks',
      xtype: 'render',
      render: () => {
        return '<a>查看</a>';
      },
      onClick: value => {
        previewDialogCompRef.value?.open({
          title: '社交媒体',
          content: `<pre>${JSON.stringify(value, null, 2)}</pre>`,
        });
      },
    },
    {
      title: '技能专长',
      dataIndex: 'skills',
      xtype: 'render',
      render: () => {
        return '<a>查看</a>';
      },
      onClick: value => {
        previewDialogCompRef.value?.open({
          title: '技能专长',
          content: `<pre>${JSON.stringify(value, null, 2)}</pre>`,
        });
      },
    },
    {
      title: '成长足迹',
      dataIndex: 'timeline',
      xtype: 'render',
      render: () => {
        return '<a>查看</a>';
      },
      onClick: value => {
        previewDialogCompRef.value?.open({
          title: '成长足迹',
          content: `<pre>${JSON.stringify(value, null, 2)}</pre>`,
        });
      },
    },
  ],
  operate: [
    {
      label: '修改',
      onClick: (row, _data, comp) => {
        console.log(row);
        comp.open({
          title: '修改',
          data: {
            id: row.id,
            contactInfo: mapToArr(row.contactInfo),
            jobTitle: row.jobTitle,
            avatarCode: row.avatarUrl
              ? [
                  {
                    code: '',
                    url: row.avatarUrl,
                  },
                ]
              : '',
            contentCode: row.contentUrl
              ? [
                  {
                    code: '',
                    url: row.contentUrl,
                  },
                ]
              : '',
            personalTags: row.personalTags.join('、'),
            socialLinks: mapToArr(row.socialLinks),
            skills: row.skills,
            timeline: row.timeline,
            isUpdateAvatar: false,
            isUpdateContent: false,
          },
          columns: [
            {
              label: '职业标签',
              type: 'input',
              dataIndex: 'jobTitle',
            },
            {
              label: '个人标签',
              type: 'input',
              dataIndex: 'personalTags',
            },
            {
              label: '联系方式',
              type: 'component',
              component: DynamicsFormComp,
              dataIndex: 'contactInfo',
              config: createDynamicsFormConfig({
                showAddButton: true,
                height: 300,
                columns: [
                  {
                    title: '键',
                    dataIndex: 'label',
                    xtype: 'input',
                  },
                  {
                    title: '值',
                    dataIndex: 'value',
                    xtype: 'input',
                  },
                ],
              }),
            },
          ],
          api: updateAboutInfo,
        });
      },
    },
  ],
  api: getAboutInfo,
});

const previewDialogCompRef = ref<InstanceType<typeof PreviewDialogComp>>();
</script>

<style lang="less" scoped></style>
