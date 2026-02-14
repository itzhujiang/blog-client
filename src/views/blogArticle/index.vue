<template>
  <div class="blog-article-container">
    <TableComp :config="config"></TableComp>
    <PreviewDialogComp ref="previewDialogCompRef"></PreviewDialogComp>
    <!-- <AModal v-model:open="visRef" title="文章预览" width="80%" :footer="null">
      <div v-loading="isLoading" class="markdown-content" v-html="markdownContentRef"></div>
    </AModal> -->
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
import type { Rule } from 'ant-design-vue/es/form';
import { ref } from 'vue';

import type { ArticleRequestType, ArticleList } from '@/api/blog/article';
import { getArticleList, addArticle, editArticle, delArticle } from '@/api/blog/article';
import { getCategoryList, type CategoryList } from '@/api/blog/category';
import { upload } from '@/api/blog/upload';
import {
  TableComp,
  createTableConfig,
  UploadComp,
  RemoteSearchSelectComp,
  createFormConfig,
  type UploadResponseType,
  createPopUpFormConfig,
  PreviewDialogComp,
  type UploadModelValueType,
  switchType,
  type RemoteSearchSelectParamType,
} from '@/components/Comp/index';
import FileSelectComp from '@/components/FileSelect/index.vue';
import { FILE_DOMAIN } from '@/utils/constants';
import { analysisMd } from '@/utils/utils';

defineOptions({
  name: 'blogArticle',
});

let previousurl = '';

const PopUpFormConfig = <T extends 'add' | 'edit'>(
  type: T,
  data: Omit<ArticleList, 'authorName' | 'readingTime' | 'viewCount' | 'status' | 'publishedAt'>,
  fn: () => void
) => {
  return createPopUpFormConfig({
    title: type === 'add' ? '添加文章' : '修改文章',
    width: '40%',
    labelCol: {
      span: 4,
    },
    ...createFormConfig({
      data: {
        id: type === 'add' ? '' : data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        thumbnailList: data.thumbnailUrl
          ? [
              {
                code: '',
                url: data.thumbnailUrl,
              },
            ]
          : '',
        articleList: data.fileUrl
          ? [
              {
                code: '',
                url: data.fileUrl,
              },
            ]
          : '',
        attachmentListComp: data.attachmentUrlArr
          ? data.attachmentUrlArr.map(item => {
              return {
                file: {
                  url: item,
                  code: '',
                },
              };
            })
          : [
              {
                file: {
                  url: '',
                  code: '',
                },
              },
            ],
        categories: data.categories.map(item => item.id),
      },
      columns: [
        {
          label: '文章标题',
          type: 'input',
          dataIndex: 'title',
          placeholder: '请输入文章标题',
          rules: [{ required: true, message: '请输入文章标题' }],
        },
        {
          label: 'url标识',
          type: 'input',
          dataIndex: 'slug',
          placeholder: '请输入url标识',
          rules: [{ required: true, message: '请输入url标识' }],
        },
        {
          label: '缩略图',
          type: 'component',
          component: UploadComp,
          config: {
            type: ['image/jpeg', 'image/png'],
            fileSize: 2,
            apiUrl: handleUpload,
            multiple: false,
          },
          dataIndex: 'thumbnailList',
        },
        {
          label: '摘要',
          type: 'textarea',
          dataIndex: 'excerpt',
          placeholder: '请输入摘要',
          rules: [{ required: true, message: '请输入摘要' }],
        },
        {
          label: '文章',
          type: 'component',
          component: UploadComp,
          dataIndex: 'articleList',
          placeholder: '请选择文章',
          config: {
            type: ['md'],
            fileSize: 10,
            apiUrl: handleUpload,
            multiple: false,
            onPreview: async (value: { code: string; url: string }) => {
              const analysisContent = await analysisMd(FILE_DOMAIN + value.url);
              previewDialogCompRef.value?.open({
                title: '文章预览',
                content: analysisContent.mdhtml,
              });
            },
          },
          rules: [
            {
              required: true,
              validator: async (_rule: Rule, value: { code: string; url: string }[]) => {
                if (!value.length) {
                  return Promise.reject('请选择文章');
                } else {
                  return Promise.resolve();
                }
              },
              trigger: 'blur',
            },
          ],
        },
        {
          label: '附件',
          type: 'component',
          dataIndex: 'attachmentListComp',
          component: FileSelectComp,
          props: {},
        },
        {
          label: '分类',
          type: 'component',
          component: RemoteSearchSelectComp,
          dataIndex: 'categories',
          config: {
            api: getCategoryList,
            placeholder: '请选择分类',
            labelkey: 'name',
            valueKey: 'id',
            multiple: true,
            defaultSelectOption: data.categories,
            beforeRequest: (param: RemoteSearchSelectParamType) => {
              return {
                ...param,
                name: param.query,
              };
            },
            afterResponse: (data: CategoryList[], totalData: CategoryList[], total: number) => {
              const isNextRequest = totalData.length + data.length < total;
              return {
                data,
                isNextRequest,
              };
            },
          },
          rules: [{ required: true, message: '请选择分类' }],
        },
      ],
      watchEffectFn: async data => {
        const url =
          data.articleList && Array.isArray(data.articleList) ? data.articleList[0]?.url : '';
        if (url !== previousurl) {
          const analysisContent = await analysisMd(FILE_DOMAIN + url);
          data.attachmentListComp = analysisContent.urls.map(item => {
            return {
              source: item,
              file: '',
            };
          });
          previousurl = url;
        }
      },
    }),
    api: type === 'add' ? addArticle : editArticle,
    beforeRequest: data => {
      if (data.thumbnailList && Array.isArray(data.thumbnailList) && data.thumbnailList[0].code) {
        data.thumbnailCode = data.thumbnailList[0].code;
        if (type === 'edit') {
          data.isUpdateThumbnail = true;
        }
      }
      if (data.articleList && Array.isArray(data.articleList) && data.articleList[0].code) {
        data.articleCode = data.articleList[0].code;
        if (type === 'edit') {
          data.isUpdateArticle = true;
        }
        if (data.attachmentListComp && Array.isArray(data.attachmentListComp)) {
          data.attachmentList = (
            data.attachmentListComp as {
              file: UploadModelValueType;
              source: string;
            }[]
          ).map(item => {
            return {
              source: item.source,
              code: item.file.code,
            };
          });
        }
      }
      return data;
    },
    afterResponse: res => {
      if (res.code === 200) {
        fn();
      }
      return {
        isMsg: true,
        msg: res.msg,
        type: switchType(res.code),
      };
    },
  });
};

const config = createTableConfig<ArticleRequestType, ArticleList>({
  search: [
    {
      placeholder: '请输入文章标题',
      type: 'input',
      dataIndex: 'title',
    },
    {
      placeholder: '分类',
      type: 'customComponent',
      component: RemoteSearchSelectComp,
      dataIndex: 'categoryId',
      config: {
        api: getCategoryList,
        placeholder: '请选择分类',
        labelkey: 'name',
        valueKey: 'id',
        defaultSelectOption: [],
        beforeRequest: (param: RemoteSearchSelectParamType) => {
          return {
            ...param,
            name: param.query,
          };
        },
        afterResponse: (data: CategoryList[], totalData: CategoryList[], total: number) => {
          const isNextRequest = totalData.length + data.length < total;
          return {
            data,
            isNextRequest,
          };
        },
      },
    },
    {
      placeholder: '开始时间|结束时间',
      type: 'dataTimeRangePicker',
      dataIndex: 'publishedAtStart|publishedAtEnd',
      showTime: false,
    },
  ],
  button: [
    {
      label: '添加',
      type: 'primary',
      onClick: (com, tableMethod) => {
        com.open(
          PopUpFormConfig<'add'>(
            'add',
            {
              title: '',
              slug: '',
              thumbnailUrl: '',
              fileUrl: '',
              attachmentUrlArr: [],
              categories: [],
              excerpt: '',
              id: null,
            },
            tableMethod.refresh
          )
        );
      },
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
      title: '文章标题',
      dataIndex: 'title',
      xtype: 'text',
    },
    {
      title: 'url标识',
      dataIndex: 'slug',
      xtype: 'text',
    },
    {
      title: '文章摘要',
      dataIndex: 'excerpt',
      xtype: 'text',
      line: true,
    },
    {
      title: '文章内容',
      dataIndex: 'fileUrl',
      xtype: 'render',
      render: () => {
        return `<a>查看</a>`;
      },
      onClick: async value => {
        const analysisContent = await analysisMd(FILE_DOMAIN + value);
        previewDialogCompRef.value?.open({
          title: '文章预览',
          content: analysisContent.mdhtml,
        });
      },
    },
    {
      title: '附件',
      dataIndex: 'attachmentUrlArr',
      xtype: 'render',
      render: () => {
        return `<a>查看</a>`;
      },
      onClick: (value: unknown) => {
        imgUrlRef.value = (value as string[]).map(item => item);
        visibleImageRef.value = true;
      },
    },
    {
      title: '作者名称',
      dataIndex: 'authorName',
      xtype: 'text',
    },
    {
      title: '阅读时间',
      dataIndex: 'readingTime',
      xtype: 'text',
    },
    {
      title: '阅读量',
      dataIndex: 'viewCount',
      xtype: 'text',
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      xtype: 'dateTime',
    },
  ],
  operate: [
    {
      label: '修改',
      onClick: (row, _data, comp, tableMethod) => {
        console.log('row.categories', row.categories);

        comp.open(
          PopUpFormConfig<'edit'>(
            'edit',
            {
              title: row.title,
              slug: row.slug,
              thumbnailUrl: row.thumbnailUrl,
              attachmentUrlArr: row.attachmentUrlArr,
              fileUrl: row.fileUrl,
              categories: row.categories,
              excerpt: row.excerpt,
              id: row.id,
            },
            tableMethod.refresh
          )
        );
      },
    },
    {
      label: '删除',
      ghost: true,
      onClick: (row, _data, _comp, tableMethod) => {
        Modal.confirm({
          title: '删除',
          content: `确认删除 ${row.title} 吗？`,
          async onOk() {
            try {
              const res = await delArticle(row.id!);
              if (res.code === 200) {
                message.success('删除成功');
                tableMethod.refresh();
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
  api: getArticleList,
});

const previewDialogCompRef = ref<InstanceType<typeof PreviewDialogComp>>();
const visibleImageRef = ref<boolean>(false);
const imgUrlRef = ref<string[]>([]);

const handleUpload = async (file: File): Promise<UploadResponseType> => {
  console.log('file', file);
  const res = await upload(file);

  return {
    code: res.code,
    data: {
      code: res.data!.data.code,
      size: res.data!.data.size,
      url: res.data!.data.url,
    },
    msg: res.msg,
  };
};

const setvisibleImage = () => {
  visibleImageRef.value = false;
};
</script>

<style lang="less" scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  box-sizing: border-box;
}

.markdown-content {
  padding: 20px;
  line-height: 1.8;
  font-size: 16px;
  color: #333;
  max-height: 70vh;
  overflow-y: auto;

  :deep(h1) {
    font-size: 2em;
    font-weight: bold;
    margin: 20px 0 10px;
    padding-bottom: 10px;
    border-bottom: 2px solid #eee;
  }

  :deep(h2) {
    font-size: 1.5em;
    font-weight: bold;
    margin: 18px 0 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }

  :deep(h3) {
    font-size: 1.3em;
    font-weight: bold;
    margin: 16px 0 8px;
  }

  :deep(h4),
  :deep(h5),
  :deep(h6) {
    font-size: 1.1em;
    font-weight: bold;
    margin: 14px 0 6px;
  }

  :deep(p) {
    margin: 10px 0;
  }

  :deep(ul),
  :deep(ol) {
    margin: 10px 0;
    padding-left: 30px;
  }

  :deep(li) {
    margin: 5px 0;
  }

  :deep(code) {
    background-color: #f5f5f5;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
    color: #e83e8c;
  }

  :deep(pre) {
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
    margin: 15px 0;

    code {
      background-color: transparent;
      padding: 0;
      color: #333;
    }
  }

  :deep(blockquote) {
    border-left: 4px solid #ddd;
    padding-left: 15px;
    margin: 15px 0;
    color: #666;
    font-style: italic;
  }

  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 15px 0;

    th,
    td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }

    tr:hover {
      background-color: #f9f9f9;
    }
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    margin: 15px 0;
    border-radius: 5px;
  }

  :deep(a) {
    color: #1890ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(hr) {
    border: none;
    border-top: 1px solid #eee;
    margin: 20px 0;
  }
}
</style>
