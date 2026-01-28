import type { Dayjs } from 'dayjs';
import type { Component } from 'vue';

export interface DynamicsFormType {
  /** 是否显示添加按钮 */
  showAddButton?: boolean;
  /** 表格高度 */
  height?: number;
  /** 表格行配置 */
  columns: FormItemType[];
  operate?: Operate[];
}

/** 组件内部使用的完整表格类型联合（包含操作列） */
export type InternalTableType = FormItemType | OperateTableType;

export interface Operate {
  /** 标签 */
  label: string;
  /** 是否显示 */
  isShowFn?: (_row: Record<string, unknown>) => boolean;
  /** 点击处理函数 */
  onClick?: (
    _data: Record<string, unknown>[],
    _index: number
  ) => { data?: Record<string, unknown>[] } | void;
}

export interface BaseFormType {
  /** 表格头部标题 */
  title: string;
  /** 字段 */
  dataIndex: string;
  /** 占位符 */
  placeholder?: string;
  /** 列宽 */
  width?: number;
  /** 校验规则 */
  rules?: Record<string, unknown>[];
  /** 其他属性 */
  props?: Record<string, unknown>;
  propsFn?: (_value: unknown, _formData: Record<string, unknown>) => Record<string, unknown>;
  /** 是否禁用 */
  disabled?: boolean;
  /** 值变化回调 */
  change?: (
    _newTableData: Record<string, unknown>[],
    _index: number,
    _value: unknown,
    _dataIndex: string
  ) => void;
}

/** 选项类型 */
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

/** Select表单项 */
type SelectFormType = BaseFormType & {
  /** 类型 */
  xtype: 'select';
  /** 选项 */
  options: SelectOption[];
  /** 多选模式 */
  mode?: 'multiple';
  /** 是否支持清除 */
  allowClear?: boolean;
};
/** input表单项 */
type InputFormType = BaseFormType & {
  /** 类型 */
  xtype: 'input';
  /** 是否显示字数统计 */
  showCount?: boolean;
  /** 最大输入长度 */
  maxlength?: number;
  /** 是否支持清除 */
  allowClear?: boolean;
  /** 输入框类型 */
  inputType?: string;
};

/** number表单项 */
type NumberFormType = BaseFormType & {
  xtype: 'number';
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长 */
  step?: number;
  /** 数值精度 */
  precision?: number;
};

/** datepicker表单项 */
type DatePickerFormType = BaseFormType & {
  /** 类型 */
  xtype: 'datePicker';
  /** 模式 */
  picker?: Picker;
  /** 是否显示“今天”按钮 */
  showToday?: boolean;
  /** 禁用日期函数 */
  disabledDate?: (_currentDate: Dayjs) => boolean;
  allowClear?: boolean;
};

/** timepicker表单项 */
type TimePickerFormType = BaseFormType & {
  xtype: 'timePicker';
  format?: string;
  /** 面板是否显示“此刻”按钮 */
  showNow?: boolean;
  /** 秒选项间隔 */
  secondStep?: number;
  /** 小时选项间隔 */
  hourStep?: number;
  /** 分钟选项间隔 */
  minuteStep?: number;
  /** 不可选择的时间 */
  disabledTime?: DisabledTime;
  allowClear?: boolean;
};

type DisabledTime = (_now: Dayjs) => {
  disabledHours?: () => number[];
  disabledMinutes?: (_selectedHour: number) => number[];
  disabledSeconds?: (_selectedHour: number, _selectedMinute: number) => number[];
};

type Picker = 'week' | 'month' | 'quarter' | 'year';

/** dateTimepicker表单项 */
type DateTimePickerFormType = BaseFormType & {
  xtype: 'dateTimePicker';
  /** 不可选择的日期 */
  disabledDate?: (_currentDate: Dayjs) => boolean;
  /** 不可选择的时间 */
  disabledTime?: DisabledTime;
  allowClear?: boolean;
  /** 是否显示“今天”按钮 */
  showToday?: boolean;
};

/** 自定义组件表单项 */
type CustomComponentFormType = BaseFormType & {
  xtype: 'component';
  /** vue组件 */
  component: Component;
} & Record<string, unknown>;

/** 操作列 */
export interface OperateTableType extends BaseFormType {
  /** 内容类型 */
  xtype: 'operate';
}

export type FormItemType =
  | SelectFormType
  | InputFormType
  | NumberFormType
  | DatePickerFormType
  | TimePickerFormType
  | DateTimePickerFormType
  | CustomComponentFormType;
