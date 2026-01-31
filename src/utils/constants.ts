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

export const SETTING_TYPE_OPTION = [
  { label: '字符串', value: 'string' },
  { label: '数字', value: 'number' },
  { label: 'json', value: 'json' },
  { label: '布尔值', value: 'boolean' },
];

export const SETTING_TYPE_MAP = arrToMap(SETTING_TYPE_OPTION);
