import { arrToMap } from '@/utils/utils';

export const TOKEN = 'blog-token';

export const FILE_DOMAIN = 'http://localhost:8089';

export const COMMENT_STATUS_OPTION = [
  {
    label: '待审核',
    value: 'pending',
  },
  {
    label: '已通过',
    value: 'approved',
  },
  {
    label: '垃圾评论',
    value: 'spam',
  },
  {
    label: '已删除',
    value: 'trash',
  },
];

export const COMMENT_STATUS_MAP = arrToMap(COMMENT_STATUS_OPTION);
