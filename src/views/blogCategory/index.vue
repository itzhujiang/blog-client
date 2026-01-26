<template>
  <div>
    <TableComp :config="config"></TableComp>
  </div>
</template>

<script setup lang="ts">
import { TableComp, createTableConfig, createFormConfig, createPopUpFormConfig,switchType } from '@/components/Comp/index';
import { getCategoryList, editCategory, addCategory, type CategoryList, type CategoryRequestType, type AddCategoryRequestType, type EditCategoryRequestType } from '@/api/blog/category';

const popUpFormConfig = <T extends 'add' | 'edit'>(type: T, data: T extends 'add' ? AddCategoryRequestType : EditCategoryRequestType, refresh: () => void) => {
  return createPopUpFormConfig({
    title: type === 'add' ? '添加分类' : '修改分类',
    labelCol: {
      span: 4,
    },
    ...createFormConfig({
      data: {
        id: type === 'add' ? '' : (data as EditCategoryRequestType).id,
        name: data.name,
        slug: data.slug
      },
      columns: [
        {
          label: '分类名称',
          dataIndex: 'name',
          type: 'input',
          placeholder: '请输入分类名称',
          rules: [{ required: true, message: '请输入分类名称' }]
        },
        {
          label: 'url标识',
          dataIndex: "slug",
          type: 'input',
          placeholder: '请输入url标识',
            rules: [{ required: true, message: '请输入url标识' }]
          }
        ],
      }),
    api: type === 'add' ? addCategory : editCategory,
    afterResponse: (res) => {
      if (res.code === 200) {
        refresh();
      }
      return {
        isMsg: true,
        msg: res.msg,
        type: switchType(res.code)
      }
    }
  })
 
}

const config = createTableConfig<CategoryRequestType, CategoryList>({
  search: [
    {
      dataIndex: 'name',
      type: 'input',
      placeholder: '请输入分类名称'
    }
  ],
  button: [
    {
      type: 'primary',
      label: '添加',
      onClick: (comp, tableMethod) => {
        comp.open(popUpFormConfig('add', {
          name: '',
          slug: ''
        }, tableMethod.refresh))
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
      title: '分类名称',
      dataIndex: 'name',
      xtype: 'text',
    },
    {
      title: 'url标识',
      dataIndex: 'slug',
      xtype: 'text'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      xtype: 'dateTime',
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      xtype: 'dateTime'
    }
  ],
  operate: [
    {
      label: '修改',
      onClick: (row, _data, comp, tableMethod) => {
        comp.open(popUpFormConfig<'edit'>('edit', {
          id: row.id,
          name: row.name,
          slug: row.slug
        }, tableMethod.refresh))
      }
    }
  ],
  api: getCategoryList
})
</script>

<style lang="less" scoped>

</style>