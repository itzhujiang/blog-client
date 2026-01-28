<template>
  <div class="login-container">
    <div class="main">
      <h1 class="title">后台系统</h1>
      <FormComp ref="formCompRef" :config="config"></FormComp>
      <AButton type="primary" @click="onLoginClick">登录</AButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { LoginRequestType } from '@/api/user';
import { FormComp, createFormConfig } from '@/components/Comp/index';
import { useUserStore } from '@/store/useUserStore';

defineOptions({
  name: 'LoginIndex',
});

const { login } = useUserStore();
const formCompRef = ref<InstanceType<typeof FormComp>>();
const config = createFormConfig({
  data: {
    username: '', // 用户名
    password: '', // 密码
  },
  columns: [
    {
      label: '账号',
      type: 'input',
      dataIndex: 'username',
      placeholder: '请输入账号',
      rules: [{ required: true, message: '请输入账号' }],
    },
    {
      label: '密码',
      type: 'input',
      dataIndex: 'password',
      placeholder: '请输入密码',
      inputType: 'password',
      rules: [{ required: true, message: '请输入密码' }],
    },
  ],
});

/**
 * 点击登录
 */
const onLoginClick = async () => {
  try {
    await formCompRef.value?.getRef()?.validate();

    const data = formCompRef.value?.getFormState() as LoginRequestType | undefined;
    if (data) {
      await login(data);
    }
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="less" scoped>
@import '@/styles/var.less';
.login-container {
  width: 100vw;
  height: 100vh;
  min-height: 600px;
  background-color: @second;
  position: relative;
  overflow: hidden;

  // 右上角几何装饰 - 圆形
  &::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background-color: @primary;
    opacity: 0.1;
    top: -200px;
    right: -100px;
  }

  // 左下角几何装饰 - 圆形
  &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background-color: @white;
    opacity: 0.08;
    bottom: -150px;
    left: -80px;
  }

  .main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: @white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    padding: 48px;
    min-width: 360px;
    max-width: 440px;
    width: 90%;
    z-index: 1;

    .title {
      color: @text;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 32px;
      text-align: center;
    }

    :deep(.ant-btn) {
      width: 100%;
      height: 40px;
      margin-top: 24px;
      border-radius: 8px;
      font-size: 16px;
    }
  }

  // 响应式设计 - 移动端
  @media (max-width: 768px) {
    .main {
      padding: 24px;
      min-width: 280px;
      width: 85%;
    }
  }
}
</style>
