import { message } from 'ant-design-vue';
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

import { TOKEN } from './constants';

import type { ResponseType, ResponseFormatType } from '@/components/Comp/index';

type TypedAxiosInstance = Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete'> & {
  get<T = null, D = null, C extends ResponseFormatType = 'arr'>(
    _url: string,
    _config?: AxiosRequestConfig<T>
  ): Promise<ResponseType<D, C>>;
  post<T = null, D = null, C extends ResponseFormatType = 'arr'>(
    _url: string,
    _data?: T,
    _config?: AxiosRequestConfig
  ): Promise<ResponseType<D, C>>;
  put<T = null, D = null, C extends ResponseFormatType = 'arr'>(
    _url: string,
    _data?: T,
    _config?: AxiosRequestConfig
  ): Promise<ResponseType<D, C>>;
  delete<T = null, D = null, C extends ResponseFormatType = 'arr'>(
    _url: string,
    _config?: AxiosRequestConfig<T>
  ): Promise<ResponseType<D, C>>;
};

const instance: TypedAxiosInstance = axios.create({
  timeout: 10000,
  baseURL: '/',
});

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem(TOKEN);
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  err => Promise.reject(err)
);

instance.interceptors.response.use(
  res => {
    return res.data;
  },
  err => {
    if (err.response.data.code === 401) {
      message.error('权限不通，请重新登录');
      localStorage.removeItem(TOKEN);
      location.pathname = '/';
    }
  }
);

export default instance;
