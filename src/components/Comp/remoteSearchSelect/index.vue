<template>
  <div class="down-load-select-container">
    <ASelect
      v-model:value="value"
      show-search
      :fieldNames="{
        label: config.labelkey,
        value: config.valueKey,
      }"
      :placeholder="config.placeholder"
      style="width: 200px"
      :mode="config.multiple ? 'multiple' : undefined"
      :options="optionsRef"
      :filter-option="onSearch"
      @focus="onSelectFocus"
      @blur="onSelectBlur"
      @popupScroll="onPopupScroll"
    >
    </ASelect>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash';
import { reactive, ref, watch } from 'vue';

import type { ParamsType, RemoteSearchSelectType } from '../utils/remoteSearchSelectType';
import type { RequestType, ResponseType } from '../utils/tableType';

defineOptions({
  name: 'remoteSearchSelect',
});
const props = defineProps<{
  config: RemoteSearchSelectType;
}>();
const value = defineModel<string | number | undefined>();

const mapRef = ref<Map<string, ResponseType<Record<string, unknown>>>>(new Map()); // 请求数据缓存
const isNextRequestRef = ref<boolean>(true); // 是否发起下一个请求
const optionsRef = ref<Record<string, unknown>[]>([]); // 选项数据
const isRequestRef = ref<boolean>(false); // 是否请求中
// 搜索参数
const params = reactive<ParamsType>({
  page: 1,
  size: 10,
  query: '',
});

watch(
  () => props.config.defaultSelectOption,
  () => {
    optionsRef.value = props.config.defaultSelectOption || [];
  }
);

/**
 * 处理搜索请求
 * @param query 搜索参数
 * @param isDownLoad 是否是加载更多
 */
const handleRequestFn = async (query: string = '', isDownLoad: boolean = false) => {
  try {
    if (!isDownLoad) {
      params.page = 1;
      params.size = 10;
      optionsRef.value = [];
    }
    if (!isNextRequestRef.value) {
      return;
    }
    if (isRequestRef.value) {
      return;
    }
    isRequestRef.value = true;
    params.query = query;
    const requestParams = (await props.config.beforeRequest?.(params)) || params;
    const apiFn = getRequestFn(requestParams);
    const res = await apiFn();
    if (res.code !== 200) {
      message.error(res.msg);
      throw new Error(res.msg);
    }
    const mapKey = JSON.stringify(requestParams);
    mapRef.value.set(mapKey, res);
    const result = await props.config.afterResponse?.(
      res.data?.data,
      cloneDeep(optionsRef.value),
      res.data?.pagination.total || 0
    );
    if (result?.data) {
      optionsRef.value.push(...result.data);
    }
    params.page++;
    isNextRequestRef.value = result.isNextRequest;
  } catch (error) {
    console.error(error);
    isNextRequestRef.value = false;
  } finally {
    isRequestRef.value = false;
  }
};

/**
 * 获取请求函数
 */
const getRequestFn = (params: RequestType<Record<string, unknown>>) => {
  const mapKey = JSON.stringify(params);
  const data = mapRef.value.get(mapKey);
  if (data) {
    return () => Promise.resolve(data);
  } else {
    return () => props.config.api(params);
  }
};
/**
 * 搜索
 * @param input 搜索值
 */
const onSearch = async (input: string) => {
  await handleRequestFn(input);
};
/** 处理下拉聚焦 */
const onSelectFocus = () => {
  handleRequestFn();
};
/**
 * 处理下拉滚动
 */
const onPopupScroll = (e: Event) => {
  const dom = e.target as HTMLElement;
  if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
    handleRequestFn(params.query, true);
  }
};

const onSelectBlur = () => {
  isNextRequestRef.value = true;
};
</script>

<style lang="less" scoped></style>
