import { message } from 'ant-design-vue';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { login as loginApi, getUserInfo as getUserInfoApi } from '@/api/user';
import type { UserInfoResponseType, LoginRequestType } from '@/api/user';
import { TOKEN } from '@/utils/constants';
export const useUserStore = defineStore('UserInfo', () => {
  const userInfo = reactive<UserInfoResponseType>({
    id: 0,
    username: '',
    displayName: '',
    email: '',
    avatarUrl: '',
  });
  const readUserInfo = computed(() => userInfo); // 管理员数据
  const loadingRef = ref(false); // 是否加载中
  const isLoginRef = ref(false); // 是否登录成功
  const readLoading = computed(() => loadingRef.value);
  const readIsLogin = computed(() => isLoginRef.value);
  const router = useRouter();
  /**
   * 登录
   * @param info
   * @returns
   */
  const login = async (info: LoginRequestType) => {
    loadingRef.value = true;
    const { code, data, msg } = await loginApi(info);
    if (code !== 200) {
      message.error(msg);
      loadingRef.value = false;
      return;
    }
    console.log('data', data);

    const token = data?.data.token;
    if (!token) {
      message.error('未获取到token');
      return;
    }
    localStorage.setItem(TOKEN, token);
    message.success('登录成功');
    await getUserInfo();
    isLoginRef.value = true;
    loadingRef.value = false;
    router.push({
      name: 'home',
    });
  };
  /**
   * 获取用户信息
   * @returns
   */
  const getUserInfo = async () => {
    const token = localStorage.getItem(TOKEN);
    if (!token) {
      message.error('未获取到token, 请重新登录');
      return;
    }
    const { code, data, msg } = await getUserInfoApi();
    if (code !== 200) {
      message.error(msg);
      return;
    }
    if (data?.data) {
      Object.assign(userInfo, data.data);
    }
  };
  /**
   * 退出登录
   */
  const logout = () => {
    localStorage.removeItem(TOKEN);
    router.replace({
      name: 'login',
    });
  };

  return {
    readUserInfo,
    readLoading,
    readIsLogin,
    login,
    getUserInfo,
    logout,
  };
});
