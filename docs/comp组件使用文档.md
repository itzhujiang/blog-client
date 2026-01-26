# zjwComp 组件库使用文档

---

## 简介

vue-component 是一个基于 Vue 3 + TypeScript + Ant Design Vue 的配置驱动型组件库，提供以下核心组件：

- **TableComp**: 可配置的数据表格，集成搜索、分页、行选择、操作按钮
- **FormComp**: 动态表单生成组件
- **PopUpFormBoxComp**: 弹窗表单包装组件
- **UploadComp**: 文件上传组件，支持图片/视频预览
- **v-loading**: 加载中指令

---

## 目录

- [安装与引入](#安装与引入)
  - [组件引入](#组件引入)
  - [国际化配置](#国际化配置)
- [TableComp 表格组件](#tablecomp-表格组件)
  - [基本用法](#基本用法)
  - [config 配置](#config)
  - [columns 列配置](#columns)
  - [search 搜索配置](#search)
  - [button 按钮配置](#button)
  - [operate 操作列配置](#operate)
  - [pagination 分页配置](#pagination)
  - [rowSelection 行选择配置](#rowselection)
  - [TableMethodType 表格方法](#tablemethodtype)
- [FormComp 表单组件](#formcomp-表单组件)
  - [基础用法](#基础用法)
  - [config 配置](#config-1)
  - [columns 表单列配置](#columns-1)
  - [暴露的方法](#暴露的方法)
- [PopUpFormBoxComp 弹窗表单包装组件](#popupformboxcomp-弹窗表单包装组件)
  - [基本用法](#基本用法-1)
  - [config 配置](#config-2)
  - [暴露的方法](#暴露的方法-1)
  - [类型定义](#类型定义)
  - [工作流程](#工作流程)
  - [注意事项](#注意事项)
- [UploadComp 文件上传组件](#uploadcomp-文件上传组件)
  - [基本用法](#基本用法-2)
  - [config 配置](#config-3)
  - [v-model 数据格式](#v-model-数据格式)
  - [文件类型支持](#文件类型支持)
  - [文件预览功能](#文件预览功能)
  - [上传响应格式](#上传响应格式)
  - [注意事项](#注意事项-1)
- [v-loading 加载中指令](#v-loading-加载中指令)
  - [简介](#简介)
  - [注册指令](#注册指令)
  - [基本用法](#基本用法-3)
  - [配置项](#配置项)
  - [类型定义](#类型定义-1)
  - [工作原理](#工作原理)
  - [使用场景](#使用场景)
  - [注意事项](#注意事项-2)

---

## 安装与引入

### 组件引入

```typescript
import {
  TableComp,
  FormComp,
  PopUpFormBoxComp,
  UploadComp,
  createTableConfig,
  createFormConfig
} from '@/components/zjwComp';

// 类型引入
import type {
  TableConfig,
  TableSearch,
  RequestType,
  ResponseType
} from '@/components/zjwComp';
```

### 国际化配置

在 App.vue 中配置 Ant Design Vue 的中文语言包：

```vue
<template>
  <AConfigProvider :locale="locale">
    <router-view />
  </AConfigProvider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';

dayjs.locale('zh-cn');
const locale = zhCN;
</script>
```


## TableComp 表格组件

### 基本用法

```vue
<template>
  <TableComp :config="tableConfig" />
</template>

<script setup lang="ts">
import { TableComp, createTableConfig } from '@/components/zjwComp';
import type { ResponseType } from '@/components/zjwComp';

// 定义数据类型
interface UserData {
  id: number;
  name: string;
  age: number;
  email: string;
  status: number;
  createTime: number;
}

// 定义搜索参数类型
interface SearchParams {
  name: string;
  status: number;
}

// 使用 createTableConfig 获得完整类型推导
const tableConfig = createTableConfig<UserData, SearchParams>({
  // 搜索配置
  search: [
    {
      type: 'input',
      label: '姓名',
      dataIndex: 'name',
      placeholder: '请输入姓名',
      allowClear: true
    },
    {
      type: 'select',
      label: '状态',
      dataIndex: 'status',
      placeholder: '请选择状态',
      option: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  ],

  // 表格列配置
  columns: [
    { title: 'ID', dataIndex: 'id', xtype: 'text', width: 80 },
    { title: '姓名', dataIndex: 'name', xtype: 'text' },
    { title: '年龄', dataIndex: 'age', xtype: 'text' },
    { title: '邮箱', dataIndex: 'email', xtype: 'text', line: true, width: 200 },
    { title: '创建时间', dataIndex: 'createTime', xtype: 'dateTime' }
  ],

  // 数据请求函数
  api: async (params) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    return response.json();
  },

  // 分页配置
  pagination: {
    isShow: true,
    pageSizeOptions: ['10', '20', '50', '100']
  }
});
</script>
```

### config

| 参数 | 说明 | 类型 | 	默认值 | 值域 | 是否必填 |
|------|-----|------|--------|------| --------|
| search | 表格上方的搜索区域配置，详情见[serach](#search-1) | Array | | | 否 |
| button | 表格上方按钮区域配置，详情见[button](#button-1) | Array |  | | 否 |
| columns | 表格列配置 | Array |  |  | 是 |
| api | 数据请求函数 | Function |  |  | 是 |
| scroll | 表格滚动 | {x: number, y: number}  | {y: 600} | | 否 |
| operate | 操作列配置，详情见[operate](#operate-1) | Array |  |  | 否 |
| operateWidth | 操作列宽度 | number | 200 |  | 否 |
| operateFixed | 操作列是否固定 | boolean | false | | 否 |
| pagination | 分页配置，详情见[pagination](#pagination-1) | object |  |  | 否 |
| rowSelection | 行选择配置,详情见[rowSelection](#rowSelection-1) | object |  |  | 否 |
| rowKey | 表格行的唯一标识字段 | string | id | | 否 |
| beforeRequest | 请求之前 | Function |  |  | 否 |
| afterResponse | 请求之后 | Function |  |  | 否 |

### columns

表格列配置数组，每一项代表一列。根据 `xtype` 的不同，支持不同的配置项。

#### 基础配置（所有类型通用）

| 参数 | 说明 | 类型 | 默认值 | 是否必填 |
|------|-----|------|--------|---------|
| title | 列标题 | string | | 是 |
| dataIndex | 列数据字段名 | string | | 是 |
| xtype | 列类型 | 'text' \| 'date' \| 'dateTime' \| 'render' \| 'operate' | | 是 |
| width | 列宽度 | number | | 否 |
| align | 对齐方式 | 'left' \| 'center' \| 'right' | 'left' | 否 |
| fixed | 固定列 | 'left' \| 'right' | | 否 |

#### xtype: 'text' - 文本类型

显示普通文本内容。

**特有配置**:
| 参数 | 说明 | 类型 | 默认值 | 是否必填 |
|------|-----|------|--------|---------|
| line | 是否单行显示，超出部分显示省略号 | boolean | false | 否 |

**示例**:
```ts
{
  title: '姓名',
  dataIndex: 'name',
  xtype: 'text',
  width: 120
}

{
  title: '邮箱',
  dataIndex: 'email',
  xtype: 'text',
  line: true,  // 超出宽度显示省略号
  width: 200
}
```

#### xtype: 'date' - 日期类型

自动将时间戳格式化为日期字符串（YYYY-MM-DD）。

**示例**:
```ts
{
  title: '创建日期',
  dataIndex: 'createDate',
  xtype: 'date',
  width: 120
}
// 1734567890000 -> 2024-12-19
```

#### xtype: 'dateTime' - 日期时间类型

自动将时间戳格式化为日期时间字符串（YYYY-MM-DD HH:mm:ss）。

**示例**:
```ts
{
  title: '创建时间',
  dataIndex: 'createTime',
  xtype: 'dateTime',
  width: 180
}
// 1734567890000 -> 2024-12-19 10:24:50
```

#### xtype: 'render' - 自定义渲染

使用自定义函数渲染单元格内容。

**特有配置**:
| 参数 | 说明 | 类型 | 是否必填 |
|------|-----|------|---------|
| render | 自定义渲染函数 | (_value: unknown, _row: T, _data: T[]) => string \| unknown | 是 |

**render 函数参数**:
- `_value`: 当前单元格的值
- `_row`: 当前行的完整数据
- `_data`: 表格的所有数据

**示例**:
```ts
{
  title: '状态',
  dataIndex: 'status',
  xtype: 'render',
  render: (value, row, data) => {
    return value === 1 ? '启用' : '禁用';
  }
}

{
  title: '金额',
  dataIndex: 'amount',
  xtype: 'render',
  render: (value) => {
    return `¥${(value as number).toFixed(2)}`;
  }
}
```

#### xtype: 'operate' - 操作列

操作列通常用于放置操作按钮，具体按钮配置见 [operate 配置](#operate-1)。

**特有配置**:
| 参数 | 说明 | 类型 | 默认值 | 是否必填 |
|------|-----|------|--------|---------|
| fixed | 固定在右侧 | 'right' | | 否 |

**示例**:
```ts
{
  title: '操作',
  dataIndex: 'operate',
  xtype: 'operate',
  fixed: 'right',
  width: 200
}
```

> **注意**: 操作列的具体按钮通过 `config.operate` 配置，而不是在 `columns` 中配置

### search

| 参数 | 说明 | 类型 | 	默认值 | 值域 | 是否必填 |
|------|-----|------|--------|------|--------|
| type | 输入框类型 | string |  | select、input、cascader、datePicker、timePicker、dateTimePicker、dataTimeRangePicker、timeRangePicker、customComponent | 是 |
| dataIndex | 搜索字段 | string |  |  | 是 |
| label | 搜索标题 | string |  |  | 否 |
| placeholder | 占位符 | string | | | 否 |
| disabled | 是否禁用 | boolean | | | 否 |
| value | 默认显示值 | string、number | | | 否 |
| span | 栅栏占位数 | number | 4 |  | 否 |
| props | 其他属性(对象) | object |  |  | 否 |
| propsFn | 其他属性(函数)  | (value, row) => {}  | |  | 否 |
| allowClear | 是否支持清除 | boolean |  |  | 否 |
| option | 下拉选项，当 type 为 select、cascader 使用，详情看[options配置项](#option) | Array |  |  |  是 |
| mode |  模式，当type为 select 类型的时候，可以使用 | string | undefined | undefined、multiple | 否 |
| multiple | 是否多选，当 type 为 cascader 类型的时候，可以使用 | boolean | false | | 否 | 
| picker | 日期模式，当 type 为 datePicker、dataTimeRangePicker 可以使用 | string |  | week、month、quarter、year | | 否 |
| showToday | 是否显示“今天”按钮，当 type 为 datePicker、dateTimePicker 可以使用 | boolean |  |  |  | 否 |
| disabledDate | 不可选择的日期，当 type 为 dateTimePicker、datePicker、dataTimeRangePicker 可以使用 | (_currentDate: Dayjs) => boolean |  |  | 否 |
| format | 时间格式，当 type 为 timePicker、timeRangePicker 可以使用 | string | HH:mm:ss | | 否 |
| disabledTime | 不可选择的时间，当 type 为 timePicker、dateTimePicker、dataTimeRangePicker、timeRangePicker 可以使用 | DisabledTime、RangeDisabledTime(type === timeRangePicker) |  |  | 否 |
| showNow | 面板是否显示“此刻”按钮，当 type 为 timePicker 可以使用 | boolean |  |  | 否 |
| secondStep | 秒选项间隔，当 type 为 timePicker、timeRangePicker 可以使用 | number |  |  | 否 |
| hourStep | 小时选项间隔，当 type 为 timePicker、timeRangePicker 可以使用 | nunber | | | 否 |
| minuteStep | 分钟选项间隔，当 type 为 timePicker、timeRangePicker 可以使用 | number | | | 否 |
| showTime | 是否显示时间，当 type 为 dataTimeRangePicker 可以使用 | boolean | | | 否 |
| component | 自定义组件，当 type 为 customComponent 可以使用 | Component |  |  | 否 |
| showCount | 是否显示字数统计, 当 type 为 input 可以使用 | boolean | | | 否 |
| maxlength | 最大输入长度，当 type 为 input 可以使用 | boolean | | | 否 |

```ts
// disabledTime 类型
type DisabledTime = (_now: Dayjs) => {
    disabledHours?: () => number[];
    disabledMinutes?: (_selectedHour: number) => number[];
    disabledSeconds?: (_selectedHour: number, _selectedMinute: number) => number[];
};

type RangeDisabledTime = (
    _now: Dayjs,
    _type: 'start' | 'end',
  ) => {
    disabledHours?: () => number[];
    disabledMinutes?: (_selectedHour: number) => number[];
    disabledSeconds?: (_selectedHour: number, _selectedMinute: number) => number[];
  }
```

> propsFn 的优先级高于 props，propsFn中两个参数分别为当前输入框的值和整个搜索区域的值对象

> 当 type 为 dataTimeRangePicker和timeRangePicker这两个其中的任意一个的时候 dataIndex、value、placeholder的类型为 `string|string`

#### option
| 参数 | 说明 | 类型 | 	默认值 | 值域 | 是否必填 |
|------|-----|------|--------|------|--------|
| label | 页面展示的文字 | string |   |  |  是 |
| value | 值 | string、number | |  | 是 |
| disabled | 当前选项是否禁用 | boolean | false | | 否 |
| children | 子选项，当前 type 为 cascader 类型的时候，可以使用 | [option](#option) | | | 否 |

### button

| 参数 | 说明 | 类型 | 	默认值 | 值域 | 是否必填 |
|------|-----|------|--------|------| --------|
| label | 按钮文字 | string |  |  | 是 |
| pos | 按钮位置 | string | right  | left、right | 否 |
| type | 按钮类型 | string | primary | primary、ghost、dashed、link、text | 否 |
| danger | 是否设置为危险按钮 | boolean |  false | | 否 |
| ghost | 幽灵属性，使按钮背景透明 | boolean | false |  | 否 |
| onClick | 按钮点击处理函数 | (_com: InstanceType<typeof PupUpFormBoxComp>, _tableMethod: TableMethodType) => void;  |  |  | 否 |


### operate

| 参数 | 说明 | 类型 | 	默认值 | 值域 | 是否必填 |
|------|-----|------|--------|------| --------|
| label | 按钮文字 | string | | | 否 |
| labelFn | 按钮文字函数，返回按钮文字，优先级高于 label | (_row: T, _data: T[]) => string | | | 否 |
| onClick | 按钮点击事件函数 | (_row: T, _data: T[], _com:InstanceType<typeof PopUpFormBoxComp>, _tableMethod: TableMethodType) => void; |  |  | 否 |
| type | 按钮类型 | string | link | primary、ghost、dashed、link、text | 否 |
| isShow | 是否显示函数 | (_row: T, _data: T[]) => boolean; | |  | 否 |
| danger | 是否设置为危险按钮 | boolean | false |  | 否 |
| ghost | 幽灵属性，使按钮背景透明 |  boolean | false | | 否|
| href | 跳转地址 | string |  |  | 否 |

### pagination

| 参数 | 说明 | 类型 | 	默认值 | 值域 | 是否必填 |
|------|-----|------|--------|------| --------|
| isShow |  是否显示分页 | boolean | false |  | 否 |
| pageSizeOptions | 每页条数配置 | string[] | ['10','20','50','100'] |  | 否 |

### rowSelection

| 参数 | 说明 | 类型 | 	默认值 | 值域 | 是否必填 |
|------|-----|------|--------|------| --------|
| type | 选择框类型 | string | checkbox | checkbox、radio | 否 |
| onChange | 选中项发生变化时的回调 | (_selectedRowKeys: (string | number)[], _selectedRows: T[]) => void; |  |  | 否 |
| getCheckboxProps | 选择框的默认属性配置 | (_record: T) => {disabled?: boolean; name?: string;}; | |  | 否 |
| selections | 自定义选择项配置，设置为 true 显示默认选择项，false 不显示 | boolean | false |  | 否 |
| fixed | 固定选择列 | boolean | false |  | 否 |
| columnWidth | 选择框列的宽度 | number、string |  |  | 否 |
| columnTitle | 列标题 | string |  |  | 否 |
| hideSelectAll | 隐藏全选复选框 | boolean |  |  | 否 |
| preserveSelectedRowKeys |  保留选项的 key 值（翻页时保持选中状态） | boolean | | | 否 |

### TableMethodType

```ts
/** 表格方法 */
interface TableMethodType<T = Record<string, unknown>> {
    /** 前往指定页面 */
    goPage: (_page: number) => void;
    /** 设置页面展示数量 */
    setSize: (_size: number) => void;
    /** 获取选中的行数据 */
    getSelectedRows: () => void;
    /** 
     * 设置选中的值
     * @param _keys 当前选中的值
     * @param _data 表格数据
     */
    setSelected:  (_fn: (_keys:(string | number)[], _data: T[]) => (string | number)[]) => void;
    /** 获取表格数据 */
    getTableData: () => T[];
    /** 清空选中的行 */
    clearSelection: () => void;
    /** 表格刷新 */
    refresh: () => void;
};
```


## FormComp 表单组件

### 基础用法

```vue
<template>
  <div>
    <AConfigProvider :locale="locale">
      <FormComp ref="formCompRef" :config="config" ></FormComp>
      <AButton type="primary" @click="onGetDataClick">获取数据</AButton>
      <AButton type="primary" @click="onCheckClcik">校验</AButton>
      <AButton type="primary" @click="onResetClcik">重置2</AButton>
    </AConfigProvider>
  </div>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import { ref } from 'vue';

import testComp from './components/testComponent/index.vue';
import { FormComp, createFormConfig } from './components/zjwComp/index';

dayjs.locale('zh-cn');
const locale = zhCN;

const formCompRef = ref<InstanceType<typeof FormComp>>();

const config = createFormConfig({
  data: {
    name: '',
    age: 18,
    address: '北京市朝阳区',
    gender: 1,
    hobbies: ['jiangsu', 'nanjing', 'zhonghuamen'],
    date: '1765723404295',
    time: '12:30:00',
    dateTime: '1765723404295',
    startDateTime: '1765723404295',
    endDateTime: '1768325404295',
    startTime: '07:00:00',
    endTime: '12:00:00',
    checkbox: '',
    component: '',
  },
  columns: [
    {
      label: '姓名',
      type: 'input',
      dataIndex: 'name',
      rules: [{ required: true, message: '请输入姓名' }],
    },
    {
      label: '年龄',
      type: 'select',
      mode:'multiple',
      options: [
        { label: '18', value: 18, disabled: true },
        { label: '19', value: 19 },
        { label: '20', value: 20 },
      ],
      dataIndex: 'age',
      allowClear: true,
      rules: [{ required: true, message: '请选择年龄' }],
    },
    {
      label: '地址',
      type: 'cascader',
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake',
                },
              ],
            },
          ],
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                },
              ],
            },
          ],
        }
      ],
      dataIndex: 'hobbies',
      placeholder: '请选择地址',
      rules: [{ required: true, message: '请选择地址' }],
      multiple: true
    },
    {
      label: '日期',
      type: 'datePicker',
      dataIndex: 'date',
      placeholder: '请选择日期',
      rules: [{ required: true, message: '请选择日期' }],
      disabledDate: (currentDate) => {
        return currentDate && currentDate > dayjs().endOf('day');
      },
    },
    {
      label: '时间',
      type: 'timePicker',
      dataIndex: 'time',
      placeholder: '请选择时间',
      rules: [{ required: true, message: '请选择时间' }],
    },
    {
      label: '日期时间',
      type: 'dateTimePicker',
      dataIndex: 'dateTime',
      placeholder: '请选择日期时间',
      rules: [{ required: true, message: '请选择日期时间' }],
    },
    {
      label: '日期时间范围',
      type: 'dataTimeRangePicker',
      dataIndex: 'startDateTime|endDateTime',
      placeholder: '开始日期时间|结束日期时间',
      rules: [{ required: true, message: '请选择日期时间范围' }],
    },
    {
      label: '时间范围',
      type: 'timeRangePicker',
      dataIndex: 'startTime|endTime',
      placeholder: '开始时间|结束时间',
      rules: [{ required: true, message: '请选择时间范围' }],
    },
    {
      label: '多选',
      type: 'checkbox',
      dataIndex: 'checkbox',
      options: [
        { label: 'Apple', value: 'Apple', disabled: true },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange' },
      ],
      rules: [{ required: true, message: '请选择' }],
    },
    {
      label: '单选',
      type: 'radio',
      dataIndex: 'radio',
      options: [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange', disabled: true },
      ]
    },
    {
      label: '数字',
      type: 'number',
      dataIndex: 'number',
      min: 1,
      step: 2,
      placeholder: '请输入数字',
      precision: 2
    },
    {
      label: '自定义',
      type: 'component',
      component: testComp,
      dataIndex: 'component',
    },
    {
      label: '文本域',
      type: 'textarea',
      dataIndex: 'textarea',
      placeholder: '请输入文本域',
      showCount: true
    }
  ],
  watchEffectFn: (data) => {
    console.log(data);
    data.name  = '张三';
    data.component = '张三';
  },
  labelCol: {
    span: 1,
  }
});

const onGetDataClick = () => {
  console.log('获取数据', formCompRef.value?.getFormState());
  
};

const onCheckClcik = () => {
  formCompRef.value?.getRef()?.validate();
  
};

const onResetClcik = () => {
  formCompRef.value?.reset();
};

</script>

<style scoped>

</style>

```

### config

| 参数 | 说明 | 类型 | 	默认值 | 值域 | 是否必填 |
|------|-----|------|--------|------| --------|
| data | 字段对象| Record<string, unknown> |  |  | 是 |
| columns | form表单列表配置，详情见[columns](#columns-1) | Object |  |  | 是 |
| watchEffectFn | 当data发生变化时触发的函数 | (_data: Record<string, unknown>, _columns: FormItemType[]) => void; |  |  | 否 |
| labelCol | 标签和输入框的宽度设置 | {span?: numberoffset?: number } |  |  | 否 |


### columns

| 参数 | 说明 | 类型 | 	默认值 | 值域 | 是否必填 |
|------|-----|------|--------|------| --------|
| type | 输入框类型 | string |  | select、input、cascader、datePicker、timePicker、dateTimePicker、dataTimeRangePicker、timeRangePicker、component、checkbox、radio、number、textarea | 是 |
| dataIndex | 表单字段 | string |  |  | 是 |
| label | 表单列表项标题 | string | |  | 否 |
| placeholder | 占位符 | string | | | 否 |
| disabled | 是否禁用 | boolean | | | 否 |
| props | 其他属性，参考[Ant Design Vue](https://antdv.com/components/overview) |  Record<string, unknown> |  |  | 否 |
| rules | 校验规则 | Record<string, unknown>[] |  |  | 否 |
| propsFn | 其他属性函数，参考[Ant Design Vue](https://antdv.com/components/overview) | (_value: unknown, _formData: Record<string, unknown>) => Record<string, unknown>; |  |  | 否 |
| allowClear | 是否支持清除 | boolean |  |  | 否 |
| options | 选项列表，当 type 为 select、cascader、checkbox、radio 使用，详情看[options配置项](#options-1) | Array |  |  | 是 |
| mode | 模式，当 type 为 select 类型的时候，可以使用 | string | undefined | undefined、multiple | 否 |
| multiple | 是否多选，当 type 为 cascader 类型的时候，可以使用 | boolean | false | | 否 |
| picker | 日期模式，当 type 为 datePicker、dataTimeRangePicker 可以使用 | string |  | week、month、quarter、year | 否 |
| showToday | 是否显示"今天"按钮，当 type 为 datePicker、dateTimePicker 可以使用 | boolean |  |  | 否 |
| disabledDate | 不可选择的日期，当 type 为 dateTimePicker、datePicker、dataTimeRangePicker 可以使用 | (_currentDate: Dayjs) => boolean |  |  | 否 |
| format | 时间格式，当 type 为 timePicker、timeRangePicker 可以使用 | string | HH:mm:ss | | 否 |
| showNow | 面板是否显示"此刻"按钮，当 type 为 timePicker 可以使用 | boolean |  |  | 否 |
| secondStep | 秒选项间隔，当 type 为 timePicker、timeRangePicker 可以使用 | number |  |  | 否 |
| hourStep | 小时选项间隔，当 type 为 timePicker、timeRangePicker 可以使用 | number | | | 否 |
| minuteStep | 分钟选项间隔，当 type 为 timePicker、timeRangePicker 可以使用 | number | | | 否 |
| disabledTime | 不可选择的时间，当 type 为 timePicker、dateTimePicker、dataTimeRangePicker、timeRangePicker 可以使用 | DisabledTime、RangeDisabledTime(type === timeRangePicker) |  |  | 否 |
| showTime | 是否显示时间，当 type 为 dataTimeRangePicker 可以使用 | boolean | | | 否 |
| component | 自定义组件，当 type 为 component 可以使用 | Component |  |  | 否 |
| showCount | 是否显示字数统计，当 type 为 input、textarea 可以使用 | boolean | | | 否 |
| maxlength | 最大输入长度，当 type 为 input 可以使用 | number | | | 否 |
| min | 最小值，当 type 为 number 可以使用 | number | | | 否 |
| max | 最大值，当 type 为 number 可以使用 | number | | | 否 |
| step | 步长，当 type 为 number 可以使用 | number | | | 否 |
| precision | 数值精度，当 type 为 number 可以使用 | number | | | 否 |
| autosize | 自适应内容高度，当 type 为 textarea 可以使用 | boolean \| { minRows?: number, maxRows?: number } | | | 否 |
| rows | 行数，当 type 为 textarea 可以使用 | number | | | 否 |

```ts
// disabledTime 类型
type DisabledTime = (_now: Dayjs) => {
    disabledHours?: () => number[];
    disabledMinutes?: (_selectedHour: number) => number[];
    disabledSeconds?: (_selectedHour: number, _selectedMinute: number) => number[];
};

type RangeDisabledTime = (
    _now: Dayjs,
    _type: 'start' | 'end',
  ) => {
    disabledHours?: () => number[];
    disabledMinutes?: (_selectedHour: number) => number[];
    disabledSeconds?: (_selectedHour: number, _selectedMinute: number) => number[];
  }
```

> propsFn 的优先级高于 props，propsFn中两个参数分别为当前输入框的值和整个表单区域的值对象

> 当 type 为 dataTimeRangePicker和timeRangePicker这两个其中的任意一个的时候 dataIndex、placeholder的类型为 `string|string`

#### options

| 参数 | 说明 | 类型 | 	默认值 | 值域 | 是否必填 |
|------|-----|------|--------|------|--------|
| label | 页面展示的文字 | string |   |  |  是 |
| value | 值 | string、number | |  | 是 |
| disabled | 当前选项是否禁用 | boolean | false | | 否 |
| children | 子选项，当 type 为 cascader 类型的时候，可以使用 | [options](#options-1) | | | 否 |

### 暴露的方法

FormComp 通过 `defineExpose` 暴露了以下方法，可以通过组件 ref 调用：

#### getRef

获取表单实例（Ant Design Vue 的 Form 组件实例），用于调用表单的原生方法。

```ts
getRef: () => FormInstance | undefined
```

**使用示例**:
```ts
// 表单验证
formCompRef.value?.getRef()?.validate();

// 验证指定字段
formCompRef.value?.getRef()?.validateFields(['name', 'age']);

// 清空验证状态
formCompRef.value?.getRef()?.clearValidate();

// 重置字段
formCompRef.value?.getRef()?.resetFields();
```

#### getFormState

获取当前表单的数据状态。

```ts
getFormState: () => Record<string, unknown>
```

**使用示例**:
```ts
const onSubmit = () => {
  const formData = formCompRef.value?.getFormState();
  console.log('表单数据:', formData);
  // { name: '张三', age: 18, ... }
};
```

#### reset

重置表单数据到初始状态（config.data 中定义的初始值）。

```ts
reset: () => void
```

**使用示例**:
```ts
const onResetClick = () => {
  formCompRef.value?.reset();
  console.log('表单已重置');
};
```

### 完整使用示例

```vue
<template>
  <div>
    <FormComp ref="formCompRef" :config="config" />
    <AButton @click="handleValidate">验证</AButton>
    <AButton @click="handleGetData">获取数据</AButton>
    <AButton @click="handleReset">重置</AButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FormComp } from '@/components/zjwComp';

const formCompRef = ref<InstanceType<typeof FormComp>>();

const handleValidate = async () => {
  try {
    await formCompRef.value?.getRef()?.validate();
    console.log('验证通过');
  } catch (error) {
    console.log('验证失败:', error);
  }
};

const handleGetData = () => {
  const data = formCompRef.value?.getFormState();
  console.log('表单数据:', data);
};

const handleReset = () => {
  formCompRef.value?.reset();
};
</script>
```


## PopUpFormBoxComp 弹窗表单包装组件

### 基本用法

```vue
<template>
  <div>
    <AConfigProvider :locale="locale">
      <PopUpFormBoxComp ref="popUpFormBoxCompRef"></PopUpFormBoxComp>
      <AButton type="primary" @click="onOpenClick">打开弹窗</AButton>
    </AConfigProvider>
  </div>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import { ref } from 'vue';

import { PopUpFormBoxComp } from './components/zjwComp/index';
import { addStudent } from '@/api/student';
import type { ResponseType } from './components/zjwComp/index';

dayjs.locale('zh-cn');
const locale = zhCN;

const popUpFormBoxCompRef = ref<InstanceType<typeof PopUpFormBoxComp>>();

const onOpenClick = () => {
  popUpFormBoxCompRef.value?.open({
    title: '添加学生',
    width: '600',
    data: {
      name: '',
      studentNo: '',
      age: 18,
      gender: 1,
      status: 1
    },
    columns: [
      {
        label: '姓名',
        type: 'input',
        dataIndex: 'name',
        placeholder: '请输入姓名',
        rules: [{ required: true, message: '请输入姓名' }]
      },
      {
        label: '学号',
        type: 'input',
        dataIndex: 'studentNo',
        placeholder: '请输入学号',
        rules: [{ required: true, message: '请输入学号' }]
      },
      {
        label: '年龄',
        type: 'number',
        dataIndex: 'age',
        min: 1,
        max: 150,
        placeholder: '请输入年龄'
      },
      {
        label: '性别',
        type: 'select',
        dataIndex: 'gender',
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 2 }
        ],
        rules: [{ required: true, message: '请选择性别' }]
      },
      {
        label: '状态',
        type: 'radio',
        dataIndex: 'status',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ]
      }
    ],
    watchEffectFn: (data) => {
      console.log('表单数据变化:', data);
    },
    beforeRequest: (param) => {
      console.log('请求前数据处理:', param);
      // 可以进行数据转换或验证
      // 返回 false 可以阻止请求
      return param;
    },
    afterResponse: (res) => {
      console.log('请求响应:', res);
      // 自定义响应处理
      return {
        isMsg: false  // 不显示默认消息提示
      };
    },
    api: addStudent,
    labelCol: { span: 4 }
  });
};
</script>
```

### config

| 参数 | 说明 | 类型 | 	默认值 | 值域 | 是否必填 |
|------|-----|------|--------|------| --------|
| title | 弹窗标题 | string | '' |  | 否 |
| width | 弹窗宽度 | string | '520' |  | 否 |
| api | API 请求函数，点击确定时调用 | ApiFunction<TParams, TResponse> |  |  | 是 |
| beforeRequest | 请求前的数据处理钩子，返回 false 可阻止请求 | (_data: TParams) => Promise<TParams \| false> \| TParams \| false | (_params) => _params |  | 否 |
| afterResponse | 请求后的响应处理钩子 | (_data: ResponseType<TResponse>) => Promise<AfterResponseReturnType> \| AfterResponseReturnType | 见下方说明 |  | 否 |
| props | AModal 的其他属性（通过 v-bind 透传） | Record<string, unknown> |  |  | 否 |
| data | 表单数据对象 | Record<string, unknown> |  |  | 是 |
| columns | 表单项配置数组，支持 13 种表单类型，详情见[FormComp columns](#columns-1) | FormItemType[] |  |  | 是 |
| watchEffectFn | 表单数据变化时的监听函数 | (_data: Record<string, unknown>, _columns: FormItemType[]) => void |  |  | 否 |
| labelCol | 标签布局配置 | {span?: number, offset?: number} |  |  | 否 |

### 暴露的方法

#### open

打开弹窗并配置表单。

```ts
open: <TParams extends Record<string, unknown> = Record<string, unknown>, TResponse = unknown>(
  config: PupUpFormBoxConfig<TParams, TResponse>
) => void
```

**参数**:
- `config`: 弹窗表单的完整配置对象

**使用示例**:
```ts
popUpFormBoxCompRef.value?.open({
  title: '编辑用户',
  data: { name: '张三', age: 25 },
  columns: [...],
  api: updateUser
});
```

### 类型定义

```ts
// API 请求函数类型
export type ApiFunction<TParams, TResponse> =
  (_params: TParams) => Promise<ResponseType<TResponse>> | ResponseType<TResponse>;

// API 响应类型
type ResponseType<T = unknown> = {
  code: 200 | 401 | 500;
  data: T;
  msg: string;
};

// afterResponse 返回类型
type AfterResponseReturnType = {
  isMsg: false
} | {
  isMsg: true,
  msg: string,
  type: 'success' | 'error' | 'warning'
};
```

### afterResponse 默认行为

当不提供 `afterResponse` 钩子时，默认行为为：

```ts
afterResponse: (res) => ({
  isMsg: true,
  msg: res.msg,
  type: switchType(res.code)  // 200 -> 'success', 500 -> 'error', 其他 -> 'warning'
})
```

### 工作流程

点击弹窗的"确定"按钮时，组件会按以下顺序执行：

1. 设置加载状态（`confirmLoading = true`）
2. 执行表单验证（`validate()`）
3. 获取表单数据（`getFormState()`）
4. 执行 `beforeRequest` 钩子（返回 `false` 可阻止后续流程）
5. 调用 `api` 函数发送请求
6. 执行 `afterResponse` 钩子处理响应
7. 如果 `isMsg: true`，显示消息提示
8. 如果响应 `code === 200`，重置表单并关闭弹窗
9. 恢复加载状态（`confirmLoading = false`）

### 注意事项

> API 响应必须符合 ResponseType 格式，包含 `code`、`data`、`msg` 字段

> 在 `beforeRequest` 中返回 `false` 可以阻止 API 请求的发送

> 只有当响应的 `code === 200` 时，才会重置表单并关闭弹窗

> `columns` 配置支持 FormComp 的所有表单类型（input、select、cascader、datePicker、timePicker、dateTimePicker、dataTimeRangePicker、timeRangePicker、textarea、checkbox、radio、number、component）


## UploadComp 文件上传组件

### 基本用法

```vue
<template>
  <div>
    <AConfigProvider :locale="locale">
      <UploadComp v-model="fileList" :config="uploadConfig" />
    </AConfigProvider>
  </div>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import { ref } from 'vue';

import { UploadComp } from './components/zjwComp/index';

dayjs.locale('zh-cn');
const locale = zhCN;

const fileList = ref<{url: string, code: string}[]>([]);

const uploadConfig = {
  apiUrl: '/api/upload',
  fileSize: 20,              // 限制 20MB
  size: 150,                 // 上传框 150px
  type: ['image/jpeg', 'image/png', 'image/gif', '.pdf', '.doc', '.docx'],  // 限制类型
  multiple: true             // 支持多文件
};
</script>
```

### config

| 参数 | 说明 | 类型 | 	默认值 | 值域 | 是否必填 |
|------|-----|------|--------|------| --------|
| apiUrl | 文件上传接口地址 | string |  |  | 是 |
| fileSize | 文件大小限制，单位 MB | number | 10 |  | 否 |
| size | 上传框的尺寸大小，单位 px | number | 114 |  | 否 |
| type | 允许上传的文件类型（支持 MIME 类型或文件后缀名） | string[] | [] |  | 否 |
| multiple | 是否支持多文件上传 | boolean | true |  | 否 |

### v-model 数据格式

组件使用 `v-model` 双向绑定，数据格式为：

```ts
v-model: {
  url: string,    // 文件访问 URL
  code: string    // 文件唯一标识码
}[]
```

**示例**:
```ts
const fileList = ref([
  { url: 'https://example.com/file1.jpg', code: 'abc123' },
  { url: 'https://example.com/file2.pdf', code: 'def456' }
]);
```

### 文件类型支持

组件支持自动检测以下三种文件类型：

#### image（图片文件）
支持的图片格式：jpeg, jpg, png, gif, bmp, svg, webp, ico, tiff, tif, psd, raw, avif, heic, heif, jfif, jp2, jpm, jxr, apng

#### video（视频文件）
支持的视频格式：mp4, avi, mov, wmv, flv, mkv, webm, m4v, mpg, mpeg, 3gp, 3g2, ts, mts, m2ts, f4v, swf, rm, rmvb, vob, asf

#### file（普通文件）
除图片和视频外的所有文件类型

### 文件预览功能

#### 图片预览
- 使用 Ant Design Vue 的 AImagePreviewGroup 组件
- 支持图片放大、缩小、旋转等操作
- 点击图片可查看大图

#### 视频预览
- 自动提取视频第一帧作为缩略图显示
- 点击可在弹窗中播放视频
- 支持视频播放控制

#### 普通文件
- 显示文件夹图标
- 支持删除操作

### type 配置说明

`type` 配置项支持两种格式：

1. **MIME 类型**：如 `'image/jpeg'`、`'image/png'`、`'application/pdf'`
2. **文件后缀名**：如 `'.jpg'`、`'.pdf'`、`'.doc'`

**示例**:
```ts
{
  // 只允许上传 JPEG 和 PNG 图片
  type: ['image/jpeg', 'image/png']
}

{
  // 只允许上传 PDF 和 Word 文档
  type: ['.pdf', '.doc', '.docx']
}

{
  // 混合使用
  type: ['image/jpeg', '.pdf', 'video/mp4']
}
```

### 上传响应格式

上传接口需要返回以下格式的数据：

```ts
type UploadResponseType = {
  code: 200 | 401 | 500;
  message: string;
  data: {
    code: string;     // 文件唯一标识码
    size: number;     // 文件大小（字节）
    url: string       // 文件访问 URL
  } | {
    code: string;
    size: number;
    url: string
  }[]
}
```

**单文件上传响应示例**:
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "code": "abc123",
    "size": 1024000,
    "url": "https://example.com/uploads/file.jpg"
  }
}
```

**多文件上传响应示例**:
```json
{
  "code": 200,
  "message": "上传成功",
  "data": [
    {
      "code": "abc123",
      "size": 1024000,
      "url": "https://example.com/uploads/file1.jpg"
    },
    {
      "code": "def456",
      "size": 2048000,
      "url": "https://example.com/uploads/file2.pdf"
    }
  ]
}
```

### 注意事项

> 上传前会自动验证文件类型和大小，不符合要求的文件会被拦截

> 视频文件会自动提取第一帧作为缩略图，可能需要一定的加载时间

> 上传接口使用 `multipart/form-data` 格式发送数据

> 当 `type` 为空数组时，不限制文件类型

> 文件大小限制单位为 MB，默认 10MB


## v-loading 加载中指令

### 简介

`v-loading` 是一个自定义 Vue 指令，用于在元素上显示加载动画。它使用 Lottie 动画库提供流畅的加载效果，并自动创建遮罩层覆盖目标元素。

### 注册指令

在应用的入口文件（如 `main.ts`）中注册指令：

```ts
import { createApp } from 'vue';
import App from './App.vue';
import { LoadingPlugin } from '@/directives/loadingDirective';

const app = createApp(App);
app.use(LoadingPlugin);
app.mount('#app');
```

### 基本用法

#### 布尔值模式

最简单的用法是传递一个布尔值，控制加载状态的显示和隐藏：

```vue
<template>
  <div>
    <div v-loading="loading" style="height: 200px; position: relative;">
      <p>这是一些内容</p>
      <p>加载时会被遮罩层覆盖</p>
    </div>
    <AButton @click="toggleLoading">切换加载状态</AButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);

const toggleLoading = () => {
  loading.value = !loading.value;
};
</script>
```

#### 配置对象模式

传递配置对象可以自定义加载动画的样式：

```vue
<template>
  <div>
    <div v-loading="loadingOptions" style="height: 300px; position: relative;">
      <p>自定义样式的加载效果</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loadingOptions = ref({
  width: 150,                           // 动画宽度
  height: 150,                          // 动画高度
  backgroundColor: 'rgba(0, 0, 0, 0.7)',  // 遮罩层背景色
  opacity: 0.9                          // 遮罩层透明度
});

// 也可以设置为 false 来隐藏加载状态
// loadingOptions.value = false;
</script>
```

### 配置项

当传递配置对象时，支持以下配置项：

| 参数 | 说明 | 类型 | 	默认值 | 是否必填 |
|------|-----|------|--------|--------|
| width | Lottie 动画的宽度，单位 px | number | 100 | 否 |
| height | Lottie 动画的高度，单位 px | number | 100 | 否 |
| backgroundColor | 遮罩层的背景颜色，支持 rgba | string | 'rgba(255, 255, 255, 0.9)' | 否 |
| opacity | 遮罩层的透明度，范围 0-1 | number | 0.8 | 否 |

### 指令值类型

```ts
// 布尔值：控制显示/隐藏
v-loading="true"   // 显示加载动画（使用默认配置）
v-loading="false"  // 隐藏加载动画

// 配置对象：自定义样式
v-loading="{
  width: 150,
  height: 150,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  opacity: 0.9
}"
```

### 类型定义

```ts
interface LoadingOptions {
  width?: number;           // 动画宽度
  height?: number;          // 动画高度
  backgroundColor?: string; // 遮罩层背景色
  opacity?: number;         // 遮罩层透明度
}

// 指令接受的值类型
type LoadingValue = boolean | LoadingOptions;
```

### 工作原理

1. **创建遮罩层**：在目标元素上创建一个绝对定位的遮罩层
2. **确保定位**：自动将目标元素设置为 `position: relative`（如果是 `static`）
3. **加载 Lottie 动画**：在遮罩层中渲染 Lottie 动画
4. **禁用交互**：设置 `pointer-events: none` 防止用户在加载时操作元素
5. **自动清理**：当指令值变为 `false` 或组件卸载时，自动销毁动画实例并移除遮罩层

### 使用场景

#### 异步数据加载

```vue
<template>
  <div v-loading="isLoading" style="min-height: 400px; position: relative;">
    <div v-if="!isLoading">
      <h3>用户列表</h3>
      <ul>
        <li v-for="user in users" :key="user.id">{{ user.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isLoading = ref(true);
const users = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('/api/users');
    users.value = await response.json();
  } finally {
    isLoading.value = false;
  }
});
</script>
```

#### 表单提交

```vue
<template>
  <div v-loading="submitting" style="position: relative;">
    <AForm @submit="handleSubmit">
      <AFormItem label="用户名">
        <AInput v-model:value="formData.username" />
      </AFormItem>
      <AFormItem>
        <AButton type="primary" html-type="submit">提交</AButton>
      </AFormItem>
    </AForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const submitting = ref(false);
const formData = ref({ username: '' });

const handleSubmit = async () => {
  submitting.value = true;
  try {
    await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData.value)
    });
  } finally {
    submitting.value = false;
  }
};
</script>
```

#### 全局容器加载

```vue
<template>
  <div v-loading="globalLoading" style="min-height: 100vh; position: relative;">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const globalLoading = ref(false);
const router = useRouter();

router.beforeEach(() => {
  globalLoading.value = true;
});

router.afterEach(() => {
  globalLoading.value = false;
});
</script>
```

### 注意事项

> 使用 `v-loading` 的元素需要有明确的高度，否则遮罩层可能无法正确显示

> 如果元素的 `position` 为 `static`，指令会自动将其设置为 `relative`

> 加载状态下，目标元素会自动设置 `pointer-events: none`，禁止用户交互

> Lottie 动画实例在指令卸载或值变为 `false` 时会自动销毁，无需手动清理

> 遮罩层的 `z-index` 固定为 `9999`，确保显示在元素内容之上
