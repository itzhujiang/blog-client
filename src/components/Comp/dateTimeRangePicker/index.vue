<!-- 日期范围选择框 -->
<template>
  <ARangePicker
    v-model:value="dateTimeRange"
    v-bind="config.propsFn ? handleItemprops(config, config.valueObj) : config.props || {}"
    :disabledDate="config.disabledDate"
    :placeholder="placeholder"
    :disabled="config.disabled"
    :showTime="config.showTime"
    :allowClear="config.allowClear"
    valueFormat="x"
    style="width: 100%"
    @change="onRangeChange"
  />
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { computed } from 'vue';

import type { DateTimerangePickerTableSearch } from '../utils/searchTypes';
import { handleItemprops, handleVerticalLine } from '../utils/utils';

defineOptions({
  name: 'DateTimeRangePickerComp',
});

const props = defineProps<{
  config: DateTimerangePickerTableSearch & {
    valueObj: Record<string, unknown>;
  } & {
    rules?: Record<string, unknown>[];
  };
  modelValue: {
    start: string | number | undefined;
    end: string | number | undefined;
  };
}>();

const emits = defineEmits<{
  (
    _e: 'update:modelValue',
    _value: { start: string | number | undefined; end: string | number | undefined }
  ): void;
}>();

const dateTimeRange = computed({
  get: () => {
    return [props.modelValue.start, props.modelValue.end];
  },
  set: (value: string[] | number[] | null) => {
    if (!value) {
      emits('update:modelValue', {
        start: '',
        end: '',
      });
    } else {
      emits('update:modelValue', {
        start: value[0],
        end: value[1],
      });
    }
  },
});

const placeholder = computed(() => {
  const dataIndexArr = handleVerticalLine(props.config.placeholder);
  return dataIndexArr;
});

/**
 * 日期发生变化
 */
const onRangeChange = (data: string[]) => {
  if (!props.config.showTime) {
    dateTimeRange.value = [
      dayjs(Number(data[0])).startOf('day').valueOf(),
      dayjs(Number(data[1])).endOf('day').valueOf(),
    ];
  }
};
</script>

<style lang="less" scoped></style>
