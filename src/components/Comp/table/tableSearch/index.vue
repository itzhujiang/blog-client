<template>
  <div class="search-container">
    <AForm :model="search" style="width: 100%">
      <ARow :gutter="24">
        <ACol v-for="item in searchConfig" :key="item.dataIndex" :span="item.span || 4">
          <!-- 输入框 -->
          <template v-if="item.type === 'input'">
            <AFormItem :label="item.label">
              <AInput
                v-model:value="search[item.dataIndex as string]"
                v-bind="item.propsFn ? handleItemprops(item as any, search) : item.props"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :allowClear="item.allowClear"
              ></AInput>
            </AFormItem>
          </template>
          <!-- 下拉选项 -->
          <template v-if="item.type === 'select'">
            <AFormItem :label="item.label">
              <ASelect
                v-model:value="search[item.dataIndex as string]"
                v-bind="item.propsFn ? handleItemprops(item, search) : item.props"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :mode="item.mode"
                :allowClear="item.allowClear"
              >
                <ASelectOption
                  v-for="it in item.option"
                  :key="it.value"
                  :disabled="it.disabled"
                  :value="it.value"
                  >{{ it.label }}</ASelectOption
                >
              </ASelect>
            </AFormItem>
          </template>
          <!-- 级联 -->
          <template v-if="item.type === 'cascader'">
            <AFormItem :label="item.label">
              <ACascader
                v-model:value="search[item.dataIndex as string]"
                v-bind="item.propsFn ? handleItemprops(item, search) : item.props"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :options="item.option"
                :allowClear="item.allowClear"
              ></ACascader>
            </AFormItem>
          </template>
          <!-- 日期选择框 -->
          <template v-if="item.type === 'datePicker'">
            <AFormItem :label="item.label">
              <ADatePicker
                v-model:value="search[item.dataIndex as string]"
                v-bind="item.propsFn ? handleItemprops(item, search) : item.props"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :showToday="item.showToday"
                :picker="item.picker"
                :disabledDate="item.disabledDate"
                valueFormat="x"
                :allowClear="item.allowClear"
                style="width: 100%"
              ></ADatePicker>
            </AFormItem>
          </template>
          <!-- 时间选择框 -->
          <template v-if="item.type === 'timePicker'">
            <AFormItem :label="item.label">
              <ATimePicker
                v-model:value="search[item.dataIndex as string]"
                v-bind="item.propsFn ? handleItemprops(item, search) : item.props"
                :placeholder="item.placeholder"
                :format="item.format || 'HH:mm:ss'"
                :disabled="item.disabled"
                :showNow="item.showNow"
                :secondStep="item.secondStep"
                :hourStep="item.hourStep"
                :minuteStep="item.minuteStep"
                :allowClear="item.allowClear"
                style="width: 100%"
                :valueFormat="item.format || 'HH:mm:ss'"
              ></ATimePicker>
            </AFormItem>
          </template>
          <template v-if="item.type === 'dateTimePicker'">
            <ADatePicker
              v-model:value="search[item.dataIndex as string]"
              v-bind="item.propsFn ? handleItemprops(item, search) : item.props"
              show-time
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :disabledDate="item.disabledDate"
              :disabledTime="item.disabledTime"
              valueFormat="x"
              :showToday="item.showToday"
              :allowClear="item.allowClear"
              style="width: 100%"
            />
          </template>
          <!-- 日期范围选择框 -->
          <template v-if="item.type === 'dataTimeRangePicker'">
            <AFormItem :label="item.label">
              <DateTimeRangePickerComp
                :config="{
                  ...item,
                  valueObj: search,
                }"
                :modelValue="{
                  start: search[handleVerticalLine(item.dataIndex)[0]!] as
                    | string
                    | number
                    | undefined,
                  end: search[handleVerticalLine(item.dataIndex)[1]!] as
                    | string
                    | number
                    | undefined,
                }"
                @update:modelValue="value => onSearchUpdate(item, value)"
              ></DateTimeRangePickerComp>
            </AFormItem>
          </template>
          <!-- 时间范围选择框 -->
          <template v-if="item.type === 'timeRangePicker'">
            <AFormItem :label="item.label">
              <TimeRangePicker
                :config="{
                  ...item,
                  valueObj: search,
                }"
                :modelValue="{
                  start: search[handleVerticalLine(item.dataIndex)[0]!] as
                    | string
                    | number
                    | undefined,
                  end: search[handleVerticalLine(item.dataIndex)[1]!] as
                    | string
                    | number
                    | undefined,
                }"
                @update:modelValue="value => onSearchUpdate(item, value)"
              />
            </AFormItem>
          </template>
          <!-- 自定义 -->
          <template v-if="item.type === 'customComponent'">
            <AFormItem :label="item.label">
              <component
                :is="item.component"
                v-bind="item"
                v-model="search[item.dataIndex as string]"
              ></component>
            </AFormItem>
          </template>
        </ACol>
        <ACol span="4">
          <!-- 按钮区域 -->
          <AButton type="primary" style="margin-right: 10px" @click="onSearchClick">搜索</AButton>
          <AButton @click="onResetClick">重置</AButton>
        </ACol>
      </ARow>
    </AForm>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

import DateTimeRangePickerComp from '../../dateTimeRangePicker/index.vue';
import TimeRangePicker from '../../timeRangePicker/index.vue';
import type { TableSearch } from '../../utils/searchTypes';
import { handleItemprops, handleVerticalLine } from '../../utils/utils';

defineOptions({
  name: 'TableSearchComp',
});

type SearchReactiveType = Record<string, string | number | undefined>;

const props = defineProps<{
  searchConfig: TableSearch<Record<string, unknown>>[];
}>();

const emits = defineEmits<{
  (_e: 'search', _value: SearchReactiveType): void;
}>();

defineExpose({
  /**
   * 获取搜索参数
   */
  getSearch: () => {
    return { ...search };
  },
  /**
   * 重置
   */
  reset: () => {
    onResetClick();
  },
});

const search = reactive<SearchReactiveType>({});
const backupSearch: SearchReactiveType = {};

/**
 * 处理props中的dataIndex和value，赋值给search对象
 */
const handleprops = () => {
  props.searchConfig.forEach(item => {
    if (item.type === 'dataTimeRangePicker' || item.type === 'timeRangePicker') {
      const dataIndexArr = handleVerticalLine(item.dataIndex);
      const valueArr = handleVerticalLine(item.value);
      if (dataIndexArr[0]) {
        search[dataIndexArr[0]] = valueArr[0] || '';
        backupSearch[dataIndexArr[0]] = valueArr[0] || '';
      }
      if (dataIndexArr[1]) {
        search[dataIndexArr[1]] = valueArr[1] || '';
        backupSearch[dataIndexArr[1]] = valueArr[1] || '';
      }
    } else {
      const dataIndex = item.dataIndex as string;
      search[dataIndex] = item.value as string | number | undefined;
      backupSearch[dataIndex] = item.value as string | number | undefined;
    }
  });
};

handleprops();

/**
 * 修改search的值
 * @param item
 */
const onSearchUpdate = (
  item: TableSearch<Record<string, unknown>>,
  value: { start: string | number | undefined; end: string | number | undefined }
) => {
  const dataIndexArr = handleVerticalLine(item.dataIndex as string);
  search[dataIndexArr[0]!] = value.start;
  search[dataIndexArr[1]!] = value.end;
};

/**
 * 点击搜索
 */
const onSearchClick = () => {
  emits('search', { ...search });
};
/**
 * 点击重置
 */
const onResetClick = () => {
  Object.assign(search, backupSearch);
  onSearchClick();
};
</script>

<style lang="less" scoped></style>
