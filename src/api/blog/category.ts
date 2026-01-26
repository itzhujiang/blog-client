import instance from '@/utils/axios';

export interface CategoryRequestType {
  /** 分类名称 */
  name?: string;
}

export interface CategoryList {
  /** id */
  id: number;
  /** 分类名称 */
  name: string;
  /** url标识 */
  slug: string;
  /** 创建时间 */
  createdAt: number;
  /** 修改时间 */
  updatedAt: number;
}

export const getCategoryList = async (params: CategoryRequestType) =>
  await instance.get<CategoryRequestType, CategoryList>('/api/blog/category/getCategoryList', {
    params,
  });

export interface AddCategoryRequestType {
  /** 分类名称 */
  name: string;
  /** 分类url标识 */
  slug: string;
}

export const addCategory = async (data: AddCategoryRequestType) =>
  await instance.post<AddCategoryRequestType, null, 'obj'>('/api/blog/category/addCategory', data);

export type EditCategoryRequestType = AddCategoryRequestType & {
  /** id */
  id: number;
};

export const editCategory = async (data: EditCategoryRequestType) =>
  await instance.put<EditCategoryRequestType, null, 'obj'>(
    '/api/blog/category/updateCategory',
    data
  );
