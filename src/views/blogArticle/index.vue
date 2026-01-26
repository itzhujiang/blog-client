<template>
  <div class="blog-article-container">
    <TableComp :config="config"></TableComp>
    <AModal
      v-model:open="visRef"
      title="文章预览"
      width="80%"
      :footer="null"
    >
      <div
        v-loading="isLoading"
        class="markdown-content"
        v-html="markdownContentRef"
      ></div>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { TableComp, createTableConfig, UploadComp, createFormConfig, type UploadResponseType } from '@/components/Comp/index';
import type { ArticleRequestType, ArticleList, AddArticleRequestType, EditArticleRequestType } from '@/api/blog/article'
import { getArticleList, addArticle, editArticle } from '@/api/blog/article';
import { upload } from '@/api/blog/upload';
import type { Rule } from 'ant-design-vue/es/form';
import { FILE_DOMAIN } from '@/utils/constants';
import { ref } from 'vue';
import {analysisMd} from '@/utils/utils'
import FileSelectComp from '@/components/FileSelect/index.vue'


const visRef = ref<boolean>(false)
const markdownContentRef = ref<string>('')
const isLoading = ref<boolean>(false)

let previousurl = '';

const PopUpFormConfig = <T extends 'add' | 'edit'>(type: T, data: T extends 'add' ? AddArticleRequestType : EditArticleRequestType) => {
  return {
    title: type === 'add' ? '添加文章' : '修改文章',
    width: '40%',
    labelCol: {
      span: 4,
    },
    ...createFormConfig({
      data: {
        id: type === 'add' ? '' : (data as EditArticleRequestType).id,
        title: data.title,
        slug: data.slug,
        thumbnailList: data.thumbnailCode,
        articleList: data.articleCode,
        attachmentList: data.attachmentCode ? data.attachmentCode.map(item => {
        return {
          url: item,
          code: '',
        }
        }) : [{
          url: '',
          code: ''
        }],
        categories: data.categories
      },
      columns: [
      {
        label: '文章标题',
        type: 'input',
        dataIndex: 'title',
        placeholder: '请输入文章标题',
        rules: [{ required: true, message: '请输入文章标题' }]
      },
      {
        label: 'url标识',
        type: 'input',
        dataIndex: 'slug',
        placeholder: '请输入url标识',
        rules: [{ required: true, message: '请输入url标识' }]
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
        rules: [{ required: true, message: '请输入摘要' }]
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
          onPreview: async () => {
            visRef.value = true
          }
        },
        rules: [{ required: true, validator: async (_rule: Rule, value: {code: string, url: string}[]) => {
          if (!value.length) {
            return Promise.reject('请选择文章');
          } else {
            return Promise.resolve();
          }
        }, trigger: 'blur'}]
      },
      {
        label: '附件',
        type: 'component',
        dataIndex: 'attachmentList',
        component: FileSelectComp,
        props: {},
      },
      {
        label: '分类',
        type: 'input',
        dataIndex: 'categories',
      }
     ],
     watchEffectFn: async (data) => {
      const url = data.articleList && Array.isArray(data.articleList) ?  data.articleList[0]?.url : ''
      if (url !== previousurl) {
        const analysisContent = await analysisMd(FILE_DOMAIN + url);
        markdownContentRef.value = analysisContent.mdhtml
        data.attachmentList = analysisContent.urls.map(item => {
          return {
            source: item,
            file: ''
          }
        })
        previousurl = url;
      }
     }
    }),
    api: type === 'add' ? addArticle : editArticle,
  }
}


const config = createTableConfig<ArticleRequestType, ArticleList>({
  button: [
    {
      label: '添加',
      type: 'primary',
      onClick: (com) => {
       com.open(PopUpFormConfig<'add'>('add', {
        title:'',
        slug: '',
        thumbnailCode:  '',
        articleCode: '',
        attachmentCode: [],
        categories: [],
        excerpt: ''
       }))
      }
    }
  ],
  columns: [
    {
      title: 'id',
      dataIndex: 'id',
      xtype: 'text',
      width: 50
    },
    {
      title: '文章标题',
      dataIndex: 'title',
      xtype: 'text',
    },
    {
      title: 'url标识',
      dataIndex: 'slug',
      xtype: 'text'
    },
    {
      title: '文章摘要',
      dataIndex: 'excerpt',
      xtype: 'text',
      line: true
    },
    {
      title: '文章内容',
      dataIndex: 'fileUrl',
      xtype: 'text'
    },
    {
      title: '附件',
      dataIndex: 'attachmentUrlArr',
      xtype: 'text'
    },
    {
      title: '作者名称',
      dataIndex: 'authorName',
      xtype: 'text'
    },
    {
      title: '阅读时间',
      dataIndex: 'readingTime',
      xtype: 'text'
    },
    {
      title: '阅读量',
      dataIndex: 'viewCount',
      xtype: 'text'
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      xtype: 'dateTime'
    }
  ],
  api: getArticleList,
})

const handleUpload = async (file: File):Promise<UploadResponseType >  => {
  const res = await upload(file);
  
   return {
    code: res.code,
    data: {
      code: res.data!.data.code,
      size: res.data!.data.size,
      url: res.data!.data.url
    },
    msg: res.msg

   }

}

</script>

<style lang="less" scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
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