<template>
  <div class="dynamics-form-container">
    <AButton v-if="mergedConfig.showAddButton" type="primary" @click="onAddClick"> 添加 </AButton>
    <AForm ref="formRef" :model="{ tableData }">
      <ATable
        size="small"
        :data-source="tableData"
        :columns="tableColumns"
        :bordered="true"
        :scroll="mergedConfig.height ? { y: mergedConfig.height } : undefined"
        style="width: 100%; margin-top: 10px"
        :pagination="false"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key !== 'operate'">
            <template v-if="column.xtype === 'input'">
              <AFormItem
                v-if="column.rules"
                :name="['tableData', index, column.dataIndex]"
                :rules="column.rules"
              >
                <AInput
                  v-model:value="record[column.dataIndex]"
                  :placeholder="column.placeholder"
                  v-bind="
                    column.propsFn ? column.propsFn(record[column.dataIndex], record) : column.props
                  "
                  @change="handlerDataChange(index, $event.target.value, column.dataIndex, column)"
                />
              </AFormItem>
              <AInput
                v-else
                v-model:value="record[column.dataIndex]"
                :placeholder="column.placeholder"
                v-bind="
                  column.propsFn ? column.propsFn(record[column.dataIndex], record) : column.props
                "
                @change="handlerDataChange(index, $event.target.value, column.dataIndex, column)"
              />
            </template>
            <template v-else-if="column.xtype === 'number'">
              <AFormItem
                v-if="column.rules"
                :name="['tableData', index, column.dataIndex]"
                :rules="column.rules"
              >
                <AInputNumber
                  v-model:value="record[column.dataIndex]"
                  :min="column.min"
                  :max="column.max"
                  :step="column.step"
                  :precision="column.precision"
                  v-bind="
                    column.propsFn ? column.propsFn(record[column.dataIndex], record) : column.props
                  "
                  style="width: 100%"
                  @change="handlerDataChange(index, $event.target.value, column.dataIndex, column)"
                />
              </AFormItem>
              <AInputNumber
                v-else
                v-model:value="record[column.dataIndex]"
                :min="column.min"
                :max="column.max"
                :step="column.step"
                :precision="column.precision"
                v-bind="
                  column.propsFn ? column.propsFn(record[column.dataIndex], record) : column.props
                "
                style="width: 100%"
                @change="handlerDataChange(index, $event.target.value, column.dataIndex, column)"
              />
            </template>
            <template v-else-if="column.xtype === 'datePicker'">
              <AFormItem
                v-if="column.rules"
                :name="['tableData', index, column.dataIndex]"
                :rules="column.rules"
              >
                <ADatePicker
                  v-model:value="record[column.dataIndex]"
                  style="width: 100%"
                  :allowClear="column.allowClear"
                  :placeholder="column.placeholder"
                  :disabled="column.disabled"
                  :showToday="column.showToday"
                  :picker="column.picker"
                  :disabledDate="column.disabledDate"
                  valueFormat="x"
                  v-bind="
                    column.propsFn ? column.propsFn(record[column.dataIndex], record) : column.props
                  "
                  @change="
                    handlerDataChange(index, record[column.dataIndex], column.dataIndex, column)
                  "
                />
              </AFormItem>
              <ADatePicker
                v-else
                v-model:value="record[column.dataIndex]"
                style="width: 100%"
                :allowClear="column.allowClear"
                :placeholder="column.placeholder"
                :disabled="column.disabled"
                :showToday="column.showToday"
                :picker="column.picker"
                :disabledDate="column.disabledDate"
                valueFormat="x"
                v-bind="
                  column.propsFn ? column.propsFn(record[column.dataIndex], record) : column.props
                "
                @change="
                  handlerDataChange(index, record[column.dataIndex], column.dataIndex, column)
                "
              />
            </template>
            <template v-else-if="column.xtype === 'timePicker'">
              <AFormItem
                v-if="column.rules"
                :name="['tableData', index, column.dataIndex]"
                :rules="column.rules"
              >
                <ATimePicker
                  v-model:value="record[column.dataIndex]"
                  style="width: 100%"
                  :placeholder="column.placeholder"
                  :allowClear="column.allowClear"
                  :format="column.format || 'HH:mm:ss'"
                  :disabled="column.disabled"
                  :showNow="column.showNow"
                  :secondStep="column.secondStep"
                  :hourStep="column.hourStep"
                  :minuteStep="column.minuteStep"
                  :valueFormat="column.format || 'HH:mm:ss'"
                  v-bind="
                    column.propsFn ? column.propsFn(record[column.dataIndex], record) : column.props
                  "
                  @change="
                    handlerDataChange(index, record[column.dataIndex], column.dataIndex, column)
                  "
                />
              </AFormItem>
              <ATimePicker
                v-else
                v-model:value="record[column.dataIndex]"
                style="width: 100%"
                :placeholder="column.placeholder"
                :allowClear="column.allowClear"
                :format="column.format || 'HH:mm:ss'"
                :disabled="column.disabled"
                :showNow="column.showNow"
                :secondStep="column.secondStep"
                :hourStep="column.hourStep"
                :minuteStep="column.minuteStep"
                :valueFormat="column.format || 'HH:mm:ss'"
                v-bind="
                  column.propsFn ? column.propsFn(record[column.dataIndex], record) : column.props
                "
                @change="
                  handlerDataChange(index, record[column.dataIndex], column.dataIndex, column)
                "
              />
            </template>
            <template v-else-if="column.xtype === 'dateTimePicker'">
              <AFormItem
                v-if="column.rules"
                :name="['tableData', index, column.dataIndex]"
                :rules="column.rules"
              >
                <ADatePicker
                  v-model:value="record[column.dataIndex]"
                  style="width: 100%"
                  show-time
                  :allowClear="column.allowClear"
                  :placeholder="column.placeholder"
                  :disabled="column.disabled"
                  :showToday="column.showToday"
                  :picker="column.picker"
                  :disabledDate="column.disabledDate"
                  valueFormat="x"
                  v-bind="
                    column.propsFn ? column.propsFn(record[column.dataIndex], record) : column.props
                  "
                  @change="
                    handlerDataChange(index, record[column.dataIndex], column.dataIndex, column)
                  "
                />
              </AFormItem>
              <ADatePicker
                v-else
                v-model:value="record[column.dataIndex]"
                style="width: 100%"
                show-time
                :placeholder="column.placeholder"
                :disabled="column.disabled"
                :disabledDate="column.disabledDate"
                :disabledTime="column.disabledTime"
                valueFormat="x"
                :showToday="column.showToday"
                :allowClear="column.allowClear"
                v-bind="
                  column.propsFn ? column.propsFn(record[column.dataIndex], record) : column.props
                "
                @change="
                  handlerDataChange(index, record[column.dataIndex], column.dataIndex, column)
                "
              />
            </template>
            <template v-else-if="column.xtype === 'select'">
              <AFormItem
                v-if="column.rules"
                :name="['tableData', index, column.dataIndex]"
                :rules="column.rules"
              >
                <ASelect
                  v-model:value="record[column.dataIndex]"
                  :placeholder="column.placeholder"
                  :disabled="column.disabled"
                  :mode="column.mode"
                  :allowClear="column.allowClear"
                  style="width: 100%"
                  v-bind="
                    column.propsFn ? column.propsFn(record[column.dataIndex], record) : column.props
                  "
                  @change="handlerDataChange(index, $event, column.dataIndex, column)"
                >
                  <ASelectOption
                    v-for="op in column.options"
                    :key="op.value"
                    :label="op.label"
                    :value="op.value"
                    :disabled="op.disabled"
                  />
                </ASelect>
              </AFormItem>
              <ASelect
                v-else
                v-model:value="record[column.dataIndex]"
                :placeholder="column.placeholder"
                :disabled="column.disabled"
                :mode="column.mode"
                :allowClear="column.allowClear"
                style="width: 100%"
                v-bind="
                  column.propsFn ? column.propsFn(record[column.dataIndex], record) : column.props
                "
                @update:value="handlerDataChange(index, $event, column.dataIndex, column)"
              >
                <ASelectOption
                  v-for="op in column.options"
                  :key="op.value"
                  :label="op.label"
                  :value="op.value"
                  :disabled="op.disabled"
                />
              </ASelect>
            </template>
            <template v-else-if="column.xtype === 'component'">
              <AFormItem
                v-if="column.rules"
                :name="['tableData', index, column.dataIndex]"
                :rules="column.rules"
              >
                <component
                  :is="column.component"
                  v-model:value="record[column.dataIndex]"
                  :config="column"
                  :scope="{ row: record, $index: index }"
                  @update:value="
                    handlerDataChange(index, record[column.dataIndex], column.dataIndex, column)
                  "
                />
              </AFormItem>
              <component
                :is="column.component"
                v-else
                v-model:value="record[column.dataIndex]"
                :config="column"
                :scope="{ row: record, $index: index }"
                @update:value="
                  handlerDataChange(index, record[column.dataIndex], column.dataIndex, column)
                "
              />
            </template>
          </template>
          <template v-if="column.xtype === 'operate'">
            <span v-for="(item, idx) in mergedConfig.operate" :key="idx">
              <AButton
                v-if="item.isShowFn ? item.isShowFn(record) : true"
                type="link"
                size="small"
                @click="onHandleClick(item, index)"
              >
                {{ item.label }}
              </AButton>
            </span>
          </template>
        </template>
      </ATable>
    </AForm>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash';
import { ref, computed, watch } from 'vue';

import type {
  DynamicsFormType,
  FormItemType,
  InternalTableType,
  Operate,
} from '../utils/dynamicsFormType';

defineOptions({
  name: 'DynamicsForm',
});

const props = defineProps<{
  config: DynamicsFormType;
}>();

const modelValue = defineModel<Record<string, unknown>[]>({ default: () => [] });

const formRef = ref();

const defaultConfig: DynamicsFormType = {
  showAddButton: true,
  columns: [],
  operate: [],
};

const mergedConfig = ref<DynamicsFormType>({ ...defaultConfig });

watch(
  () => props.config,
  value => {
    mergedConfig.value = { ...defaultConfig, ...value };
  },
  { deep: true, immediate: true }
);

const tableData = computed({
  get: () => modelValue.value,
  set: value => {
    modelValue.value = value;
  },
});

const tableColumns = computed(() => {
  const cols = mergedConfig.value.columns.map((item: FormItemType) => ({
    ...item,
    key: item.dataIndex,
  }));

  if (mergedConfig.value.operate && mergedConfig.value.operate.length > 0) {
    (cols as InternalTableType[]).push({
      title: '操作',
      width: 100,
      xtype: 'operate',
      dataIndex: '',
    });
  }

  return cols;
});

const onAddClick = () => {
  tableData.value = [...tableData.value, {}];
};

const handlerDataChange = (
  index: number,
  value: unknown,
  dataIndex: string,
  item: FormItemType
) => {
  const newTableData = cloneDeep(tableData.value);
  if ('change' in item && typeof item.change === 'function') {
    item.change(newTableData, index, value, dataIndex);
    tableData.value = newTableData;
  }
};

const onHandleClick = (item: Operate, index: number) => {
  if (item.onClick) {
    const result = item.onClick(cloneDeep(tableData.value), index);
    if (result && result.data) {
      tableData.value = result.data;
    }
  }
};

defineExpose({
  formRef,
});
</script>

<style lang="less" scoped>
.dynamics-form-container {
  :deep(.ant-form-item) {
    margin-bottom: 0;
  }
}
</style>
