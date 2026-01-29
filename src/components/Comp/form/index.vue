<!-- 表单组件 -->
<template>
  <div class="form-container">
    <AForm ref="formRef" :model="formState" :labelCol="configuration.labelCol">
      <AFormItem
        v-for="item in configuration.columns"
        :key="item.dataIndex"
        :label="item.label"
        :name="item.dataIndex"
        :rules="item.rules"
      >
        <template v-if="item.type === 'input'">
          <AInput
            v-model:value="formState[item.dataIndex as string]"
            v-bind="
              item.propsFn
                ? item.propsFn(formState[item.dataIndex as string], formState)
                : item.props || {}
            "
            :placeholder="item.placeholder"
            :disabled="item.disabled"
            :showCount="item.showCount"
            :maxlength="item.maxlength"
            :allowClear="item.allowClear"
            :type="item.inputType || 'text'"
          ></AInput>
        </template>
        <template v-else-if="item.type === 'select'">
          <ASelect
            v-model:value="formState[item.dataIndex as string]"
            v-bind="
              item.propsFn
                ? item.propsFn(formState[item.dataIndex as string], formState)
                : item.props || {}
            "
            :placeholder="item.placeholder"
            :disabled="item.disabled"
            :mode="item.mode"
            :allowClear="item.allowClear"
          >
            <ASelectOption
              v-for="option in item.options"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </ASelectOption>
          </ASelect>
        </template>
        <template v-else-if="item.type === 'cascader'">
          <ACascader
            v-model:value="formState[item.dataIndex as string]"
            v-bind="
              item.propsFn
                ? item.propsFn(formState[item.dataIndex as string], formState)
                : item.props || {}
            "
            :options="item.options"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
            :multiple="item.multiple"
          ></ACascader>
        </template>
        <template v-else-if="item.type === 'datePicker'">
          <ADatePicker
            v-model:value="formState[item.dataIndex as string]"
            v-bind="
              item.propsFn
                ? item.propsFn(formState[item.dataIndex as string], formState)
                : item.props || {}
            "
            :allowClear="item.allowClear"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
            :showToday="item.showToday"
            :picker="item.picker"
            :disabledDate="item.disabledDate"
            valueFormat="x"
            style="width: 100%"
          ></ADatePicker>
        </template>
        <template v-else-if="item.type === 'timePicker'">
          <ATimePicker
            v-model:value="formState[item.dataIndex as string]"
            v-bind="
              item.propsFn
                ? item.propsFn(formState[item.dataIndex as string], formState)
                : item.props || {}
            "
            :placeholder="item.placeholder"
            :allowClear="item.allowClear"
            :format="item.format || 'HH:mm:ss'"
            :disabled="item.disabled"
            :showNow="item.showNow"
            :secondStep="item.secondStep"
            :hourStep="item.hourStep"
            :minuteStep="item.minuteStep"
            style="width: 100%"
            :valueFormat="item.format || 'HH:mm:ss'"
          ></ATimePicker>
        </template>
        <template v-else-if="item.type === 'dateTimePicker'">
          <ADatePicker
            v-model:value="formState[item.dataIndex as string]"
            v-bind="
              item.propsFn
                ? item.propsFn(formState[item.dataIndex as string], formState)
                : item.props || {}
            "
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
        <template v-else-if="item.type === 'dataTimeRangePicker'">
          <DateTimeRangePickerComp
            :config="{
              ...item,
              valueObj: formState,
            }"
            :model-value="{
              start: formState[handleVerticalLine(item.dataIndex)[0] as string] as
                | string
                | number
                | undefined,
              end: formState[handleVerticalLine(item.dataIndex)[1] as string] as
                | string
                | number
                | undefined,
            }"
            @update:modelValue="value => onFormStateUpdate(item, value)"
          ></DateTimeRangePickerComp>
        </template>
        <template v-else-if="item.type === 'timeRangePicker'">
          <TimeRangePickerComp
            :config="{
              ...item,
              valueObj: formState,
            }"
            :model-value="{
              start: formState[handleVerticalLine(item.dataIndex)[0] as string] as
                | string
                | undefined,
              end: formState[handleVerticalLine(item.dataIndex)[1] as string] as string | undefined,
            }"
            @update:modelValue="value => onFormStateUpdate(item, value)"
          ></TimeRangePickerComp>
        </template>
        <template v-else-if="item.type === 'checkbox'">
          <ACheckboxGroup
            v-model:value="formState[item.dataIndex as string]"
            v-bind="
              item.propsFn
                ? item.propsFn(formState[item.dataIndex as string], formState)
                : item.props || {}
            "
            :disabled="item.disabled"
            :options="item.options"
          />
        </template>
        <template v-else-if="item.type === 'radio'">
          <ARadioGroup
            v-model:value="formState[item.dataIndex as string]"
            v-bind="
              item.propsFn
                ? item.propsFn(formState[item.dataIndex as string], formState)
                : item.props || {}
            "
            :disabled="item.disabled"
            :options="item.options"
          />
        </template>
        <template v-else-if="item.type === 'number'">
          <AInputNumber
            v-model:value="formState[item.dataIndex as string]"
            v-bind="
              item.propsFn
                ? item.propsFn(formState[item.dataIndex as string], formState)
                : item.props || {}
            "
            style="width: 100%"
            :disabled="item.disabled"
            :min="item.min"
            :max="item.max"
            :step="item.step"
            :placeholder="item.placeholder"
            :precision="item.precision"
          />
        </template>
        <template v-else-if="item.type === 'component'">
          <component
            :is="item.component"
            v-bind="{
              ...item,
              formState,
            }"
            v-model="formState[item.dataIndex as string]"
          >
          </component>
        </template>
        <template v-else-if="item.type === 'textarea'">
          <ATextarea
            v-model:value="formState[item.dataIndex as string]"
            v-bind="
              item.propsFn
                ? item.propsFn(formState[item.dataIndex as string], formState)
                : item.props || {}
            "
            :placeholder="item.placeholder"
            :showCount="item.showCount"
            :allowClear="item.allowClear"
            :rows="item.rows"
          />
        </template>
      </AFormItem>
    </AForm>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';
import { cloneDeep } from 'lodash';
import { reactive, watchEffect, nextTick, ref } from 'vue';

import DateTimeRangePickerComp from '../dateTimeRangePicker/index.vue';
import TimeRangePickerComp from '../timeRangePicker/index.vue';
import type {
  FormTypeConfig,
  DataTimeRangePickerFormType,
  TimeRangePickerFormType,
} from '../utils/formType';
import { handleVerticalLine } from '../utils/utils';

defineOptions({
  name: 'FormComp',
});

const props = defineProps<{
  config: FormTypeConfig;
}>();

defineExpose({
  /**
   * 获取form实例
   */
  getRef: () => {
    return formRef.value;
  },
  /**
   * 获取数据
   */
  getFormState: () => {
    return formState;
  },
  /**
   * 重置
   */
  reset: () => {
    Object.assign(formState, cloneDeep(backupFormState));
  },
});

const formState = reactive<Record<string, unknown>>({});
const backupFormState: Record<string, unknown> = {};
const configuration = reactive(cloneDeep(props.config));
const formRef = ref<FormInstance | null>(null);

watchEffect(() => {
  Object.keys(formState).forEach(key => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    formState[key];
  });
  nextTick(() => {
    configuration.watchEffectFn?.(formState, configuration.columns);
  });
});

const handlepropsToFormState = () => {
  const data = cloneDeep(configuration.data);
  Object.assign(formState, data);
  configuration.columns.forEach(item => {
    if (item.type === 'dataTimeRangePicker' || item.type === 'timeRangePicker') {
      const dataIndexArr = handleVerticalLine(item.dataIndex);
      if (dataIndexArr[0]) {
        formState[dataIndexArr[0]] = data[dataIndexArr[0]] || '';
        backupFormState[dataIndexArr[0]] = data[dataIndexArr[0]] || '';
      }
      if (dataIndexArr[1]) {
        formState[dataIndexArr[1]] = data[dataIndexArr[1]] || '';
        backupFormState[dataIndexArr[1]] = data[dataIndexArr[1]] || '';
      }
      formState[item.dataIndex] =
        dataIndexArr[0] && dataIndexArr[1]
          ? formState[dataIndexArr[0]] && formState[dataIndexArr[1]]
            ? [formState[dataIndexArr[0]], formState[dataIndexArr[1]]]
            : ''
          : '';
      backupFormState[item.dataIndex] =
        dataIndexArr[0] && dataIndexArr[1]
          ? formState[dataIndexArr[0]] && formState[dataIndexArr[1]]
            ? [formState[dataIndexArr[0]], formState[dataIndexArr[1]]]
            : ''
          : '';
    } else {
      const dataIndex = item.dataIndex as string;
      formState[dataIndex] = data[dataIndex] || '';
      backupFormState[dataIndex] = data[dataIndex] || '';
    }
  });
};

handlepropsToFormState();

/**
 * 修改formState的值
 * @param item
 */
const onFormStateUpdate = (
  item: DataTimeRangePickerFormType | TimeRangePickerFormType,
  value: { start: string | number | undefined; end: string | number | undefined }
) => {
  const dataIndexArr = handleVerticalLine(item.dataIndex as string);
  formState[item.dataIndex] = value.start && value.end ? [value.start, value.end] : undefined;
  formState[dataIndexArr[0]!] = value.start;
  formState[dataIndexArr[1]!] = value.end;
};
</script>

<style lang="less" scoped>
.form-container {
  width: 100%;
  height: 100%;
}
</style>
