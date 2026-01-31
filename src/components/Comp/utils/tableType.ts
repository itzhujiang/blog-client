// 作用：书写表格区域的类型
import PopUpFormBoxComp from '../popUpFormBox/index.vue';

import type { ButtonType } from './buttonType';
import type { TableSearch } from './searchTypes';

export interface TableConfig<
  T = Record<string, unknown>,
  C = Record<string, unknown>,
  E extends ResponseFormatType = 'arr',
> {
  /** 搜索配置 */
  search?: TableSearch<C>[];
  /** 按钮配置 */
  button?: ButtonType[];
  /** 表格列配置 */
  columns: TableType<T>[];
  /** 数据请求函数 */
  api:
    | ((_params: RequestType<C>) => Promise<ResponseType<T, E>>)
    | ((_params: RequestType<C>) => ResponseType<T, E>);
  scroll?: {
    x?: number;
    y?: number;
  };
  /** 操作列配置 */
  operate?: OperateType<T>[];
  /** 操作列宽度 */
  operateWidth?: number;
  /** 操作列是否固定 */
  operateFixed?: boolean;
  /** 分页 */
  pagination?: PaginationType;
  /** 行选择配置 */
  rowSelection?: RowSelectionType<T>;
  /** 表格行的唯一标识字段，默认为 'id' */
  rowKey?: Extract<keyof T, string> | ((_record: T) => string | number);
  beforeRequest?:
    | ((_params: RequestType<C>) => Promise<RequestType<Record<string, unknown>> | false>)
    | ((_params: RequestType<C>) => RequestType<Record<string, unknown> | false>);
  afterResponse?: (_res: ResponseType<T>) => void;
}

/** 表格基础类型 */
export interface BaseTableType<T> {
  /** 表头 */
  title: string;
  /** 字段 */
  dataIndex: Extract<keyof T, string>;
  /** 列宽 */
  width?: string | number;

  /** 是否显示多选框 */
  isSelection?: boolean;
}

/** 表格 - 简单类型（文本、日期、日期时间） */
export type SimpleTableType<T> = BaseTableType<T> & {
  /** 内容类型 */
  xtype: 'date' | 'dateTime';
};

export type TextTableType<T> = BaseTableType<T> & {
  /** 内容类型 */
  xtype: 'text';
  /** 一行展示，多余部分省略号展示 */
  line?: boolean;
};

/** 表格 - 自定义渲染类型 */
export interface RenderTableType<T> extends BaseTableType<T> {
  /** 内容类型 */
  xtype: 'render';
  /** 自定义渲染函数 */
  render: (_value: unknown, _row: T, _data: T[]) => string | unknown;
  onClick?: (_value: unknown, _row: T, _data: T[]) => void;
}

/** 操作列 */
export interface OperateTableType<T> extends BaseTableType<T> {
  /** 内容类型 */
  xtype: 'operate';
  fixed?: 'right';
}

/** 表格类型联合 */
export type TableType<T> = SimpleTableType<T> | RenderTableType<T> | TextTableType<T>;

/** 组件内部使用的完整表格类型联合（包含操作列） */
export type InternalTableType<T> = TableType<T> | OperateTableType<T>;

export type RequestType<T> = {
  page: number;
  size: number;
} & T;

export type ResponseFormatType = 'arr' | 'obj';

export type ResponseType<T, C extends ResponseFormatType = 'arr'> = {
  code: 200 | 401 | 500;
  data: {
    data: C extends 'arr' ? Array<T> : T;
    pagination: {
      page: number;
      size: number;
      total: number;
    };
  } | null;
  msg: string;
};

/** 操作列配置 */

export interface OperateType<T> {
  label?: string;
  labelFn?: (_row: T, _data: T[]) => string;
  onClick: (
    _row: T,
    _data: T[],
    _com: InstanceType<typeof PopUpFormBoxComp>,
    _tableMethod: TableMethodType
  ) => void;
  type?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text';
  /** 是否显示 */
  isShow?: (_row: T, _data: T[]) => boolean;
  /** 是否设置为危险按钮 */
  danger?: boolean;
  /** 幽灵属性，使按钮背景透明 */
  ghost?: boolean;
  /** 跳转 */
  href?: boolean;
}

/** 分页配置 */
export interface PaginationType {
  /** 是否显示分页 */
  isShow?: boolean;
  /** 每页条数 */
  pageSizeOptions?: string[];
}

/** 行选择配置 */
export interface RowSelectionType<T = Record<string, unknown>> {
  /** 选择框类型：checkbox（多选）或 radio（单选），默认 checkbox */
  type?: 'checkbox' | 'radio';
  /** 选中项发生变化时的回调 */
  onChange?: (_selectedRowKeys: (string | number)[], _selectedRows: T[]) => void;
  /** 选择框的默认属性配置 */
  getCheckboxProps?: (_record: T) => {
    disabled?: boolean;
    name?: string;
  };
  /** 自定义选择项配置，设置为 true 显示默认选择项，false 不显示 */
  selections?: boolean;
  /** 固定选择列 */
  fixed?: boolean;
  /** 选择框列的宽度 */
  columnWidth?: number | string;
  /** 列标题 */
  columnTitle?: string;
  /** 隐藏全选复选框 */
  hideSelectAll?: boolean;
  /** 保留选项的 key 值（翻页时保持选中状态） */
  preserveSelectedRowKeys?: boolean;
}

/** 表格方法 */
export interface TableMethodType<T = Record<string, unknown>> {
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
  setSelected: (_fn: (_keys: (string | number)[], _data: T[]) => (string | number)[]) => void;
  /** 获取表格数据 */
  getTableData: () => T[];
  /** 清空选中的行 */
  clearSelection: () => void;
  /** 表格刷新 */
  refresh: () => void;
}
