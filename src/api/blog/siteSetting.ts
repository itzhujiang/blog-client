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
  /** 创建时间 */
  createdAt: number;
}
/**
 * 获取站点设置
 * @returns
 */
export const getSettingsList = async () =>
  await instance.get<null, SettingsList>('/api/blog/site-setting/getSettings');

export type AddSettingsRequestType = Omit<SettingsList, 'id' | 'updatedAt' | 'createdAt'>;

/**
 * 添加站点设置
 * @param data
 * @returns
 */
export const addSettings = async (data: AddSettingsRequestType) =>
  await instance.post<AddSettingsRequestType, null, 'obj'>(
    '/api/blog/site-setting/addSettings',
    data
  );

export type EditSettingsRequestType = Omit<SettingsList, 'updatedAt' | 'createdAt'>;

/**
 * 编辑站点设置
 * @param data
 * @returns
 */
export const editSettings = async (data: EditSettingsRequestType) =>
  await instance.put<EditSettingsRequestType, null, 'obj'>(
    '/api/blog/site-setting/updateSettings',
    data
  );
