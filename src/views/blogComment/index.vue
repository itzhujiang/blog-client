<template>
  <div class="blog-comment-container">
    <TableComp :config="config" />
    <PreviewDialogComp ref="previewDialogCompRef"></PreviewDialogComp>
    <AImage
      :width="200"
      :style="{ display: 'none' }"
      :preview="{
        visible: visibleImageRef,
        onVisibleChange: setvisibleImage,
      }"
      :src="imgUrlRef"
    />
  </div>
</template>

<script setup lang="ts">
import { message, Modal } from 'ant-design-vue';
import { ref } from 'vue';

import {
  delComment,
  getCommentsList,
  reviewComment,
  type CommentList,
  type CommentListRequestType,
} from '@/api/blog/comment';
import { TableComp, createTableConfig, PreviewDialogComp } from '@/components/Comp/index';
import { COMMENT_STATUS_MAP, COMMENT_STATUS_OPTION } from '@/utils/constants';

defineOptions({
  name: 'blogCommont',
});

const config = createTableConfig<CommentListRequestType, CommentList>({
  search: [
    {
      type: 'input',
      placeholder: '请输入id',
      dataIndex: 'id',
    },
    {
      type: 'input',
      placeholder: '请输入父id',
      dataIndex: 'parentId',
    },
    {
      type: 'select',
      placeholder: '请选择状态',
      allowClear: true,
      dataIndex: 'status',
      option: COMMENT_STATUS_OPTION,
    },
    {
      type: 'input',
      placeholder: '请输入评论者',
      dataIndex: 'authorName',
    },
    {
      type: 'input',
      placeholder: '请输入文章ID',
      dataIndex: 'articleId',
    },
    {
      type: 'dataTimeRangePicker',
      placeholder: '开始时间|结束时间',
      dataIndex: 'createDateTimeStart|createDateTimeEnd',
      showTime: true,
    },
  ],
  columns: [
    {
      title: 'id',
      dataIndex: 'id',
      xtype: 'text',
      width: 50,
    },
    {
      title: '父id',
      dataIndex: 'parentId',
      xtype: 'text',
    },
    {
      title: '评论者名称',
      dataIndex: 'authorName',
      xtype: 'text',
    },
    {
      title: '评论者联系方式',
      dataIndex: 'authorEmail',
      xtype: 'text',
    },
    {
      title: '头像',
      dataIndex: 'authorUrl',
      xtype: 'render',
      render: () => {
        return `<a>查看</a>`;
      },
      onClick: data => {
        imgUrlRef.value = data as string;
        visibleImageRef.value = true;
      },
    },
    {
      title: '文章id',
      dataIndex: 'articleId',
      xtype: 'text',
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      xtype: 'render',
      render: () => {
        return `<a>查看</a>`;
      },
      onClick: (data, row) => {
        previewDialogCompRef.value?.open({
          title: `${row.authorName}评论`,
          content: data as string,
        });
      },
    },
    {
      title: '评论状态',
      dataIndex: 'status',
      xtype: 'render',
      render: data => {
        return COMMENT_STATUS_MAP[data as string];
      },
    },
    {
      title: '点赞量',
      dataIndex: 'likeCount',
      xtype: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      xtype: 'dateTime',
    },
  ],
  operate: [
    {
      label: '审核',
      isShow: row => {
        return row.status === 'pending';
      },
      onClick: (row, _data, comp) => {
        comp.open({
          title: '审核',
          data: {
            id: row.id,
            status: '',
          },
          columns: [
            {
              label: '状态',
              type: 'select',
              options: COMMENT_STATUS_OPTION.filter(
                item => item.value !== 'pending' && item.value !== 'trash'
              ),
              dataIndex: 'status',
            },
          ],
          api: reviewComment,
        });
      },
    },
    {
      label: '删除',
      danger: true,
      onClick: row => {
        Modal.confirm({
          title: '删除',
          content: `确认删除 ${row.id} 吗？`,
          onOk: async () => {
            try {
              const res = await delComment({ id: row.id });
              if (res.code === 200) {
                message.success('删除成功');
              } else if (res.code === 500) {
                message.error(res.msg);
              }
            } catch (error) {
              console.error(error);
            }
          },
        });
      },
    },
  ],
  api: getCommentsList,
  pagination: {
    isShow: true,
  },
});
const previewDialogCompRef = ref<InstanceType<typeof PreviewDialogComp>>();
const visibleImageRef = ref<boolean>(false);
const imgUrlRef = ref<string>();

/**
 * 设置图片预览隐藏
 */
const setvisibleImage = () => {
  visibleImageRef.value = false;
};
</script>

<style lang="less" scoped></style>
