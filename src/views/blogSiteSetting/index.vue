<template>
  <div>
    <TableComp :config="config"></TableComp>
  </div>
</template>

<script setup lang="ts">
import { addSettings, editSettings, getSettingsList } from '@/api/blog/siteSetting';
import { TableComp, createTableConfig, switchType } from '@/components/Comp/index';
import { SETTING_TYPE_MAP, SETTING_TYPE_OPTION } from '@/utils/constants';
defineOptions({
  name: 'blogSiteSetting',
});

const config = createTableConfig({
  button: [
    {
      label: '添加',
      type: 'primary',
      onClick: (comp, tableMethod) => {
        comp.open({
          title: '添加',
          data: {
            settingKey: '',
            settingValue: '',
            settingType: 'string',
            description: '',
          },
          api: addSettings,
          columns: [
            {
              label: '站点key',
              type: 'input',
              dataIndex: 'settingKey',
              placeholder: '请输入站点key',
              rules: [{ required: true, message: '请输入站点key' }],
            },
            {
              label: '站点值',
              type: 'input',
              dataIndex: 'settingValue',
              placeholder: '请输入站点值',
              rules: [{ required: true, message: '请输入站点值' }],
            },
            {
              label: '值类型',
              type: 'select',
              dataIndex: 'settingType',
              options: SETTING_TYPE_OPTION,
              rules: [{ required: true, message: '请输入站点值类型' }],
            },
            {
              label: '描述',
              type: 'textarea',
              dataIndex: 'description',
              placeholder: '请输入描述',
              rules: [{ required: true, message: '请输入描述' }],
            },
          ],
          afterResponse: res => {
            if (res.code === 200) {
              tableMethod.refresh();
            }
            return {
              isMsg: true,
              msg: res.msg,
              type: switchType(res.code),
            };
          },
        });
      },
    },
  ],
  columns: [
    {
      title: 'id',
      dataIndex: 'id',
      width: 50,
      xtype: 'text',
    },
    {
      title: '站点key',
      dataIndex: 'settingKey',
      xtype: 'text',
      line: true,
    },
    {
      title: '站点值',
      dataIndex: 'settingValue',
      xtype: 'text',
      line: true,
    },
    {
      title: '站点值类型',
      dataIndex: 'settingType',
      xtype: 'render',
      render: value => {
        return SETTING_TYPE_MAP[value as string];
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      xtype: 'text',
      line: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      xtype: 'dateTime',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      xtype: 'dateTime',
    },
  ],
  api: getSettingsList,
  pagination: {
    isShow: true,
  },
  operate: [
    {
      label: '修改',
      onClick: (row, _data, comp, tableMethod) => {
        comp.open({
          title: '修改站点',
          data: {
            id: row.id,
            settingKey: row.settingKey,
            settingValue: row.settingValue,
            settingType: row.settingType,
            description: row.description,
          },
          columns: [
            {
              label: '站点key',
              type: 'input',
              dataIndex: 'settingKey',
              placeholder: '请输入站点key',
              rules: [{ required: true, message: '请输入站点key' }],
            },
            {
              label: '站点值',
              type: 'input',
              dataIndex: 'settingValue',
              placeholder: '请输入站点值',
              rules: [{ required: true, message: '请输入站点值' }],
            },
            {
              label: '值类型',
              type: 'select',
              dataIndex: 'settingType',
              options: SETTING_TYPE_OPTION,
              rules: [{ required: true, message: '请输入站点值类型' }],
            },
            {
              label: '描述',
              type: 'textarea',
              dataIndex: 'description',
              placeholder: '请输入描述',
              rules: [{ required: true, message: '请输入描述' }],
            },
          ],
          api: editSettings,
          afterResponse: res => {
            if (res.code === 200) {
              tableMethod.refresh();
            }
            return {
              isMsg: true,
              msg: res.msg,
              type: switchType(res.code),
            };
          },
        });
      },
    },
  ],
});
</script>

<style lang="less" scoped></style>
