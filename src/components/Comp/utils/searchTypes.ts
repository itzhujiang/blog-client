import type { Dayjs } from 'dayjs';
import type { Component } from 'vue';

type InferpropsFn<T> = T extends { type: 'input' | 'timePicker' }
  ? (_value: string, _row: Record<string, unknown>) => Record<string, unknown>
  : T extends { type: 'select' | 'cascader' }
    ? (_value: string | number, _row: Record<string, unknown>) => Record<string, unknown>
    : T extends { type: 'datePicker' | 'dateTimePicker' }
      ? (_value: number, _row: Record<string, unknown>) => Record<string, unknown>
      : T extends { type: 'dataTimeRangePicker' }
        ? (_value: number[], _row: Record<string, unknown>) => Record<string, unknown>
        : T extends { type: 'timeRangePicker' }
          ? (_value: string[], _row: Record<string, unknown>) => Record<string, unknown>
          : (_value: unknown, _row: Record<string, unknown>) => Record<string, unknown>;

export type SearchType =
  | 'select'
  | 'input'
  | 'cascader'
  | 'datePicker'
  | 'timePicker'
  | 'dateTimePicker'
  | 'dataTimeRangePicker'
  | 'timeRangePicker'
  | 'customComponent';

/** 基础搜索配置 */
type BaseTableSearch<T extends SearchType, C> = {
  type: SearchType;
  /** 搜索字段 */
  dataIndex: Extract<keyof C, string>;
  /** 搜索标题 */
  label?: string;
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 设置值 */
  value?: string | number | undefined;
  /** 栅栏占位数 */
  span?: number;
  /** 其他属性 */
  props?: Record<string, unknown>;
  propsFn?: InferpropsFn<{ type: T }>;
};

/** 选项类型 */
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

/**
 * mode 到 value 类型的映射 - 当添加新的 mode 时，只需在这里添加映射
 */
export type SelectModeValueMap = {
  multiple: number[] | string[] | undefined;
};

/** mode 类型定义 - 可以轻松扩展新的 mode 类型 */
export type SelectMode = keyof SelectModeValueMap;

/** Select 类型的搜索配置基础类型 */
type SelectTableSearchBase<C> = Omit<BaseTableSearch<'select', C>, 'value'> & {
  /** 搜索类型 */
  type: 'select';
  /** 选项列表（select 类型必填） */
  option: SelectOption[];
  /** 是否支持清除 */
  allowClear?: boolean;
};

/** Select 类型的搜索配置 - 多选模式 */
type SelectTableSearchWithMode<TMode extends SelectMode, C> = SelectTableSearchBase<C> & {
  mode: TMode;
  value?: SelectModeValueMap[TMode];
};

/** Select 类型的搜索配置 - 单选模式（无 mode） */
type SelectTableSearchWithoutMode<C> = SelectTableSearchBase<C> & {
  mode?: undefined;
  value?: string | number | undefined;
};

/** Select 类型的搜索配置（必须包含 option）- 使用类型体操自动推导 */
export type SelectTableSearch<C> =
  | SelectTableSearchWithoutMode<C>
  | (SelectMode extends infer Mode
      ? Mode extends SelectMode
        ? SelectTableSearchWithMode<Mode, C>
        : never
      : never);

/** cascader的option */
export type CascaderOption = SelectOption & {
  /** 子节点 */
  children?: CascaderOption[];
};

/** cascader类型的搜索配置（必须包含option） */
export type CascaderTableSearch<C> = Omit<BaseTableSearch<'cascader', C>, 'value'> & {
  /** 搜索类型 */
  type: 'cascader';
  value: string[] | number[] | undefined;
  /** 是否支持清除 */
  allowClear?: boolean;
  /** 是否多选 */
  multiple?: boolean;
  /** 选项列表 */
  option: CascaderOption[];
};

export type Picker = 'week' | 'month' | 'quarter' | 'year';

/** datePicker类型的搜索配置 */
export type DatePickerTableSerch<C> = BaseTableSearch<'datePicker', C> & {
  type: 'datePicker';
  /** 模式 */
  picker?: Picker;
  /** 是否显示“今天”按钮 */
  showToday?: boolean;
  allowClear?: boolean;
  disabledDate?: (_currentDate: Dayjs) => boolean;
};

type DisabledTime = (_now: Dayjs) => {
  disabledHours?: () => number[];
  disabledMinutes?: (_selectedHour: number) => number[];
  disabledSeconds?: (_selectedHour: number, _selectedMinute: number) => number[];
};

/** timePicker类型的搜索配置 */
export type TimePickerTableSearch<C> = BaseTableSearch<'timePicker', C> & {
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
  allowClear?: boolean;
  /** 不可选择的时间 */
  disabledTime?: DisabledTime;
};

/** dateTimePicker类型的搜索配置 */
export type DateTimePickerTableSearch<C> = BaseTableSearch<'dateTimePicker', C> & {
  type: 'dateTimePicker';
  /** 不可选择的日期 */
  disabledDate?: (_currentDate: Dayjs) => boolean;
  /** 不可选择的时间 */
  disabledTime?: DisabledTime;
  showToday?: boolean;
  allowClear?: boolean;
};

type DateTimerangePickerDisabledTime = (_date: Dayjs, _type: 'start' | 'end') => boolean;

export type DateTimerangePickerTableSearch<C = Record<string, unknown>> = Omit<
  BaseTableSearch<'dataTimeRangePicker', C>,
  'dataIndex' | 'placeholder' | 'value'
> & {
  type: 'dataTimeRangePicker';
  /** 是否显示清除 */
  allowClear?: boolean;
  /** 是否显示时间 */
  showTime?: boolean;
  dataIndex: `${Extract<keyof C, string>}|${Extract<keyof C, string>}`;
  placeholder?: `${string}|${string}`;
  value?: `${string}|${string}`;
  picker?: Picker;
  /** 不可选择的日期 */
  disabledDate?: (_currentDate: Dayjs) => boolean;
  disabledTime?: DateTimerangePickerDisabledTime;
};

type RangeDisabledTime = (
  _now: Dayjs,
  _type: 'start' | 'end'
) => {
  disabledHours?: () => number[];
  disabledMinutes?: (_selectedHour: number) => number[];
  disabledSeconds?: (_selectedHour: number, _selectedMinute: number) => number[];
};

export type TimeRangePickerTableSearch<C = Record<string, unknown>> = Omit<
  BaseTableSearch<'timeRangePicker', C>,
  'dataIndex' | 'placeholder' | 'value'
> & {
  type: 'timeRangePicker';
  dataIndex: `${Extract<keyof C, string>}|${Extract<keyof C, string>}`;
  placeholder?: `${string}|${string}`;
  value?: `${string}|${string}`;
  format?: string;
  /** 不可选择的时间	 */
  disabledTime?: RangeDisabledTime;
  /** 秒选项间隔 */
  secondStep?: number;
  /** 小时选项间隔 */
  hourStep?: number;
  /** 分钟选项间隔 */
  minuteStep?: number;
  /** 是否支持清除 */
  allowClear?: boolean;
};

export type CustomComponentTableSearch<C> = Omit<
  BaseTableSearch<'customComponent', C>,
  'disabled'
> & {
  type: 'customComponent';
  component: Component;
} & Record<string, unknown>;

export type InputTableSearch<C> = BaseTableSearch<'input', C> & {
  type: 'input';
  /** 是否显示字数统计 */
  showCount?: boolean;
  /** 最大输入长度 */
  maxlength?: number;
  /** 是否支持清除 */
  allowClear?: boolean;
};

/** 搜索配置联合类型 */
export type TableSearch<C = Record<string, unknown>> =
  | SelectTableSearch<C>
  | InputTableSearch<C>
  | CascaderTableSearch<C>
  | DatePickerTableSerch<C>
  | TimePickerTableSearch<C>
  | DateTimePickerTableSearch<C>
  | DateTimerangePickerTableSearch<C>
  | TimeRangePickerTableSearch<C>
  | CustomComponentTableSearch<C>;
