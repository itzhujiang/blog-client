<template>
  <div class="time-range-container">
    <ATimeRangePicker 
        v-model:value="timeRange"
        v-bind="config.propsFn ? handleItemprops(config, config.valueObj) : config.props"
        :placeholder="placeholder"
        :format="config.format || 'HH:mm:ss'"
        style="width: 100%;"
        :valueFormat="config.format || 'HH:mm:ss'"
        :disabled="config.disabled"
       :secondStep="config.secondStep"
       :hourStep="config.hourStep"
       :minuteStep="config.minuteStep"
       :disabledTime="config.disabledTime"
       :allowClear="config.allowClear"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { TimeRangePickerTableSearch } from '../utils/searchTypes';
import { handleItemprops, handleVerticalLine } from '../utils/utils';


defineOptions({
  name: 'TimeRangePickerComp'
});

const props = defineProps<{
  config: TimeRangePickerTableSearch & {
    valueObj: Record<string, unknown>;
  },
  modelValue: {
    start: string | number | undefined;
    end: string | number | undefined;
  }
}>();

const emits = defineEmits<{
  (_e: 'update:modelValue', _value: { start: string | number | undefined; end: string | number | undefined }): void;
}>();

const timeRange = computed({
  get: () => {
    return [props.modelValue.start, props.modelValue.end];
  },
  set: (value: string[] | number[] | null) => {
    if (!value) {
      emits('update:modelValue', {
        start: '',
        end: ''
      });
    } else {
      emits('update:modelValue', {
        start: value[0],
        end: value[1]
      });
    }
    
  }
});

const placeholder = computed(() => {
  const dataIndexArr = handleVerticalLine(props.config.placeholder);
  return dataIndexArr;
});

</script>

<style lang="less" scoped>

</style>
