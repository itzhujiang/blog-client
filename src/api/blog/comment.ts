import instance from '@/utils/axios';

type CommontStatus = 'pending' | 'approved' | 'spam' | 'trash';

export type CommentListRequestType = {
  /** id */
  id?: number;
  /** 父id */
  parentId?: number;
  /** 状态 */
  status?: CommontStatus;
  /** 评论者名称 */
  authorName?: string;
  /** 文章id */
  articleId?: number;
  /**  点赞数排序 */
  likeCountSort?: 'asc' | 'desc';
  /** 创建时间  */
  createDateTimeStart?: number;
  /** 创建时间结束 */
  createDateTimeEnd?: number;
};

export type CommentList = {
  /** id */
  id: number;
  /** 文章id */
  articleId: number;
  /** 父id */
  parentId?: number;
  /** 评论者 */
  authorName: number;
  /** 评论者联系方式 */
  authorEmail: string;
  /** 头像url */
  authorUrl: string;
  /** 评论内容 */
  content: string;
  /** 评论状态 */
  status: CommontStatus;
  /** 点赞量 */
  likeCount: number;
  /** 创建时间 */
  createdAt: number;
};

/**
 * 获取评论列表
 * @param params
 * @returns
 */
export const getCommentsList = async (params: CommentListRequestType) =>
  await instance.get<CommentListRequestType, CommentList, 'arr'>(
    '/api/blog/comment/getCommentsList',
    {
      params,
    }
  );

type ReviewCommentRequestType = {
  id: number;
  status: 'approved' | 'spam';
};

/**
 * 审核
 * @param data
 * @returns
 */
export const reviewComment = async (data: ReviewCommentRequestType) =>
  await instance.put<ReviewCommentRequestType, null, 'obj'>(
    '/api/blog/comment/reviewComment',
    data
  );

export type DelCommentRequestType = {
  /** id */
  id: number;
};

/**
 * 删除评论
 * @param params
 * @returns
 */
export const delComment = async (params: DelCommentRequestType) =>
  await instance.delete<DelCommentRequestType, null, 'obj'>('/api/blog/comment/delComment', {
    params,
  });
