import type { CategoryList } from './category';

import instance from '@/utils/axios';

type ArticleStatus = 'draft' | 'published' | 'archived';

export type ArticleRequestType = {
  /** 文章标题 */
  title?: string;
  /** 状态 */
  status?: ArticleStatus;
  /** 分类id */
  categoryId?: number;
  /** 发布时间开始 */
  publishedAtStart?: number;
  /** 发布时间结束 */
  publishedAtEnd?: number;
  /** 浏览量排序 */
  viewCountSort?: 'asc' | 'desc';
};

export type ArticleList = {
  /** id */
  id: number | null;
  /** 文章标题 */
  title: string;
  /** url标识 */
  slug: string;
  /** 文章摘要 */
  excerpt: string;
  /** 文章缩略图 */
  thumbnailUrl: string;
  /** 作者名称 */
  authorName: string;
  /** 阅读时间 */
  readingTime: number;
  /** 文章浏览量 */
  viewCount: number;
  /** 状态 */
  status: ArticleStatus;
  /** 发布时间 */
  publishedAt: number;
  /** 文章url */
  fileUrl: string;
  /** 附件url数组 */
  attachmentUrlArr: string[];
  /** 分类信息 */
  categories: Pick<CategoryList, 'id' | 'name' | 'slug'>[];
};

export const getArticleList = async (params: ArticleRequestType) =>
  await instance.get<ArticleRequestType, ArticleList>('/api/blog/article/getArticleList', {
    params,
  });

export type AddArticleRequestType = {
  /** 文章标题 */
  title: string;
  /**  URL友好标识 */
  slug: string;
  /** 缩略图code */
  thumbnailCode?: string;
  /** 文章摘要 */
  excerpt: string;
  /** 文章内容code */
  articleCode: string;
  /** 附件code数组 */
  attachmentList?: {
    code: string;
    source: string;
  }[];
  /** 分类数组 */
  categories: number[];
};

/**
 * 添加文章
 * @param data
 * @returns
 */
export const addArticle = async (data: AddArticleRequestType) =>
  await instance.post<AddArticleRequestType, null, 'obj'>('/api/blog/article/addArticle', data);

export type EditArticleRequestType = AddArticleRequestType & {
  /** id */
  id: number;
  /** 是否更新文章内容 */
  isUpdateArticle?: boolean;
  /** 是否更新缩略图 */
  isUpdateThumbnail?: boolean;
};

/**
 * 修改文章
 */
export const editArticle = async (data: EditArticleRequestType) =>
  await instance.put<EditArticleRequestType, null, 'obj'>('/api/blog/article/updateArticle', data);

export const delArticle = async (id: number) =>
  await instance.delete<
    {
      id: number;
    },
    null,
    'obj'
  >('/api/blog/article/delArticle', {
    params: {
      id,
    },
  });
