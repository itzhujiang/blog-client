import type { RequestType, ResponseType } from './tableType';

export type RemoteSearchSelectType<C = Record<string, unknown>, T = Record<string, unknown>> = {
  api:
    | ((_params: RequestType<C>) => Promise<ResponseType<T, 'arr'>>)
    | ((_params: RequestType<C>) => ResponseType<T, 'arr'>);
  beforeRequest?:
    | ((_params: ParamsType) => Promise<RequestType<Record<string, unknown>>>)
    | ((_params: ParamsType) => RequestType<Record<string, unknown>>);
  afterResponse: (
    _res: T[] | undefined,
    _totalData: T[],
    _total: number
  ) => { data: T[]; isNextRequest: boolean };
  /** 站位符 */
  placeholder?: string;
  labelkey: Extract<keyof T, string>;
  valueKey: Extract<keyof T, string>;
  props?: Record<string, unknown>;
  /** 是否多选 */
  multiple?: boolean;
  defaultSelectOption?: T[];
};

export type ParamsType = RequestType<{ query: string }>;
