// form表单

import type { Dayjs } from 'dayjs';
import type { Component } from 'vue';

export type FormType =
  | 'select'
  | 'input'
  | 'cascader'
  | 'datePicker'
  | 'timePicker'
  | 'dateTimePicker'
  | 'dataTimeRangePicker'
  | 'timeRangePicker'
  | 'component'
  | 'checkbox'
  | 'radio'
  | 'number'
  | 'textarea';

type BaseFormType = {
  type: FormType;
  /** 搜索字段 */
  dataIndex: string;
  /** 搜索标题 */
  label?: string;
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 其他属性 */
  props?: Record<string, unknown>;
  /** 校验规则 */
  rules?: Record<string, unknown>[];
  propsFn?: (_value: unknown, _formData: Record<string, unknown>) => Record<string, unknown>;
};

/** 选项类型 */
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

/** Select表单项 */
type SelectFormType = BaseFormType & {
  /** 类型 */
  type: 'select';
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
  type: 'input';
  /** 是否显示字数统计 */
  showCount?: boolean;
  /** 最大输入长度 */
  maxlength?: number;
  /** 是否支持清除 */
  allowClear?: boolean;
  /** 输入框类型 */
  inputType?: string;
};

/** cascader表单项 */
type CascaderFormType = BaseFormType & {
  /** 类型 */
  type: 'cascader';
  /** 选项 */
  options: CascaderOption[];
  /** 是否支持清除 */
  allowClear?: boolean;
  /** 是否多选 */
  multiple?: boolean;
};

/** cascader的option */
type CascaderOption = SelectOption & {
  /** 子节点 */
  children?: CascaderOption[];
};

/** datepicker表单项 */
type DatePickerFormType = BaseFormType & {
  /** 类型 */
  type: 'datePicker';
  /** 模式 */
  picker?: Picker;
  /** 是否显示“今天”按钮 */
  showToday?: boolean;
  /** 禁用日期函数 */
  disabledDate?: (_currentDate: Dayjs) => boolean;
  allowClear?: boolean;
};

type Picker = 'week' | 'month' | 'quarter' | 'year';

/** timepicker表单项 */
type TimePickerFormType = BaseFormType & {
  type: 'timePicker';
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

/** dateTimepicker表单项 */
type DateTimePickerFormType = BaseFormType & {
  type: 'dateTimePicker';
  /** 不可选择的日期 */
  disabledDate?: (_currentDate: Dayjs) => boolean;
  /** 不可选择的时间 */
  disabledTime?: DisabledTime;
  allowClear?: boolean;
  /** 是否显示“今天”按钮 */
  showToday?: boolean;
};

/** dataTimeRangePicker表单项 */
export type DataTimeRangePickerFormType = Omit<BaseFormType, 'dataIndex' | 'placeholder'> & {
  type: 'dataTimeRangePicker';
  /** 是否显示清除 */
  allowClear?: boolean;
  /** 是否显示时间 */
  showTime?: boolean;
  dataIndex: `${string}|${string}`;
  placeholder?: `${string}|${string}`;
  picker?: Picker;
  /** 不可选择的日期 */
  disabledDate?: (_currentDate: Dayjs) => boolean;
  disabledTime?: DateTimerangePickerDisabledTime;
};

type DateTimerangePickerDisabledTime = (_date: Dayjs, _type: 'start' | 'end') => boolean;

/** timeRangePicker表单项 */
export type TimeRangePickerFormType = Omit<BaseFormType, 'dataIndex' | 'placeholder'> & {
  type: 'timeRangePicker';
  dataIndex: `${string}|${string}`;
  placeholder?: `${string}|${string}`;
  format?: string;
  /** 不可选择的时间	 */
  disabledTime?: RangeDisabledTime;
  /** 秒选项间隔 */
  secondStep?: number;
  /** 小时选项间隔 */
  hourStep?: number;
  /** 分钟选项间隔 */
  minuteStep?: number;
  /** 是否显示清除 */
  allowClear?: boolean;
};

type RangeDisabledTime = (
  _now: Dayjs,
  _type: 'start' | 'end'
) => {
  disabledHours?: () => number[];
  disabledMinutes?: (_selectedHour: number) => number[];
  disabledSeconds?: (_selectedHour: number, _selectedMinute: number) => number[];
};

/** 自定义组件表单项 */
type CustomComponentFormType = BaseFormType & {
  type: 'component';
  /** vue组件 */
  component: Component;
} & Record<string, unknown>;

/** checkbox表单项 */
type CheckboxFormType = Omit<BaseFormType, 'placeholder'> & {
  type: 'checkbox';
  /** 选项 */
  options: (SelectOption & {
    disabled?: boolean;
  })[];
};

/** radio表单项 */
type RadioFormType = Omit<BaseFormType, 'placeholder'> & {
  type: 'radio';
  /** 选项 */
  options: (SelectOption & {
    disabled?: boolean;
  })[];
};

/** number表单项 */
type NumberFormType = BaseFormType & {
  type: 'number';
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长 */
  step?: number;
  /** 数值精度 */
  precision?: number;
};

/** textarea表单项 */
type TextareaFormType = BaseFormType & {
  type: 'textarea';
  /** 是否展示字数 */
  showCount?: boolean;
  /** 自适应内容高度 */
  autosize?: boolean | { minRows?: number; maxRows?: number };
  /** 可以点击清除图标删除内容	 */
  allowClear?: boolean;
  rows?: number;
};

export type FormItemType =
  | SelectFormType
  | InputFormType
  | CascaderFormType
  | DatePickerFormType
  | TimePickerFormType
  | DateTimePickerFormType
  | DataTimeRangePickerFormType
  | TimeRangePickerFormType
  | CustomComponentFormType
  | CheckboxFormType
  | RadioFormType
  | NumberFormType
  | TextareaFormType;

export type FormTypeConfig = {
  data: Record<string, unknown>;
  columns: FormItemType[];
  watchEffectFn?: (_data: Record<string, unknown>, _columns: FormItemType[]) => void;
  labelCol?: {
    span?: number;
    offset?: number;
  };
};
