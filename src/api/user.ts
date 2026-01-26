import instance from '@/utils/axios';

export interface LoginRequestType {
  /** 账号 */
  username: string;
  /** 密码 */
  password: string;
}

export interface LoginResponseType {
  token: string;
}

/**
 * 登录
 * @param param
 * @returns token
 */
export const login = async (param: LoginRequestType) =>
  await instance.post<LoginRequestType, LoginResponseType, 'obj'>('/api/user/admin/login', param);

export interface UserInfoResponseType {
  /** id */
  id: number;
  /** 账号 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 昵称 */
  displayName: string;
  /** 头像 */
  avatarUrl: string;
}

/**
 * 获取用户信息
 */
export const getUserInfo = async () =>
  await instance.get<null, UserInfoResponseType, 'obj'>('/api/user/admin/getUesrInfo');
