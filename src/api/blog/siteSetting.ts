import instance from '@/utils/axios';

export interface SettingsList {
  /** id */
  id: number;
  /** key */
  settingKey: string;
  /** value */
  settingValue: string | number;
  /** 值类型 */
  settingType: 'string' | 'json' | 'number';
  /** 描述 */
  description: string;
  /** 更新时间 */
  updatedAt: number;
}
/**
 * 获取站点设置
 * @returns
 */
export const getSettingsList = async () =>
  await instance.get<null, SettingsList>('/api/blog/site-setting/getSettings');
