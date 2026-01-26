<!-- form弹窗 -->
<template>
  <div>
    <AModal
    v-model:open="visibleRef"
    :title="configRef?.title"
    :width="configRef?.width || 520" 
    :confirmLoading="confirmLoadingRef"
    v-bind="configRef?.props"
    @cancel="onCancel"
    @ok="onSubmitOk"
    >
        <FormComp
        v-if="visibleRef"
        ref="formCompRef"
        :config="{
          data: configRef!.data,
          columns: configRef!.columns,
          watchEffectFn: configRef?.watchEffectFn,
          labelCol: configRef?.labelCol
        }"
        ></FormComp>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { cloneDeep } from 'lodash';

import FormComp from '../form/index.vue';
import type { PupUpFormBoxConfig } from '../utils/popUpFormBoxType';
import { switchType } from '../utils/utils';

defineOptions({
  name: 'PopUpFormBox'
});


const defaultConfig:PupUpFormBoxConfig = {
  title: '',
  columns: [],
  data: {},
  api: () => {
    return {
      code: 200,
      data: null,
      msg: ''
    };
  },
  beforeRequest: (params) => params,
  afterResponse: (res) => {
    return {
      isMsg: true,
      msg: res.msg,
      type: switchType(res.code)
    };
  },


};


defineExpose({
  open: <TParams = Record<string, unknown>, TResponse = unknown>(config: PupUpFormBoxConfig<TParams, TResponse>) => {
    configRef.value = Object.assign({}, defaultConfig, cloneDeep(config)) as PupUpFormBoxConfig;
    cacheData.value = cloneDeep(config.data)
    visibleRef.value = true;
  }
});

const confirmLoadingRef = ref<boolean>(false);
const formCompRef = ref<InstanceType<typeof FormComp>>();
const configRef = ref<PupUpFormBoxConfig | null>(null);
const visibleRef = ref<boolean>(false);
const cacheData = ref<Record<string, unknown>>()

/**
 * 点击确定
 */
const onSubmitOk = async () => {
  try {
    confirmLoadingRef.value = true;
    await formCompRef.value?.getRef()?.validate();
    const data = formCompRef.value?.getFormState();
    const params = await configRef.value?.beforeRequest?.(data || {});
    if (!params) {
      confirmLoadingRef.value = false;
      return;
    }
    const response = await configRef.value!.api(params);
    const res = await configRef.value?.afterResponse?.(response);
    if (res && res.isMsg) {
      message[res.type](res.msg);
    }
    if (response.code === 200) {
      formCompRef.value?.reset();
      visibleRef.value = false;
    }
  } catch (err) {
    console.error('报错', err);
  } finally {
    confirmLoadingRef.value = false;
  }

};



/**
 * 点击取消
 */
const onCancel = () => {
  formCompRef.value?.reset();
  configRef.value!.data = cacheData.value!
};

</script>

<style lang="less" scoped>

</style>
