<template>
  <div class="table-container">
    <div v-if="config.search?.length">
      <TableSearchComp
        ref="tableSearchCompRef"
        :search-config="config.search"
        @search="onSearchClick"
      ></TableSearchComp>
    </div>
    <div v-if="config.button?.length">
      <TableButtonComp
        :button-config="{
          button: config.button,
          tableMethod,
        }"
      >
      </TableButtonComp>
    </div>
    <ATable
      v-loading="loadingRef"
      class="a-table"
      :columns="mergedColumns"
      :dataSource="tableDataRef"
      :scroll="Object.assign({ y: 600 }, config.scroll)"
      :pagination="false"
      :rowKey="config.rowKey || 'id'"
      :rowSelection="mergedRowSelection"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.xtype === 'render'">
          <div
            @click="column.onClick?.(text, record, column)"
            v-html="column.render(text, record, column)"
          ></div>
        </template>
        <template v-if="column.xtype === 'text'">
          <ATooltip v-if="column.line">
            <template #title>
              <div>{{ text }}</div>
            </template>
            <div
              class="ellipsis"
              :style="{
                width: column.width ? column.width + 'px' : 'auto',
              }"
            >
              {{ text }}
            </div>
          </ATooltip>
        </template>
        <template v-if="column.xtype === 'date'">
          {{ dayjs(Number(text)).format('YYYY-MM-DD') }}
        </template>
        <template v-if="column.xtype === 'dateTime'">
          {{ dayjs(Number(text)).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.xtype === 'operate'">
          <template v-for="item in config.operate" :key="item.label">
            <AButton
              v-if="item.isShow ? item.isShow(record, tableDataRef!) : true"
              :type="item.type || 'link'"
              :danger="item.danger"
              :ghost="item.ghost"
              :href="item.href"
              @click="
                () =>
                  item.onClick(
                    record,
                    tableDataRef!,
                    popUpFormBoxCompRef!,
                    tableMethod as TableMethodType
                  )
              "
            >
              {{ item.labelFn ? item.labelFn(record, tableDataRef!) : item.label }}
            </AButton>
          </template>
        </template>
      </template>
    </ATable>
    <APagination
      v-if="config.pagination?.isShow"
      style="margin-top: 20px"
      :current="paginationRef.page"
      :pageSize="paginationRef.size"
      :pageSizeOptions="config.pagination.pageSizeOptions || ['10', '20', '50', '100']"
      show-size-changer
      show-quick-jumper
      :total="paginationRef.total"
      @change="onPaginationChange"
    />
  </div>
  <PopUpFormBoxComp ref="popUpFormBoxCompRef"></PopUpFormBoxComp>
</template>

<script setup lang="ts" generic="T = Record<string, unknown>">
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { computed, onMounted, ref } from 'vue';

import PopUpFormBoxComp from '../popUpFormBox/index.vue';
import type { TableConfig, InternalTableType, TableMethodType } from '../utils/tableType';

import TableButtonComp from './tableButton/index.vue';
import TableSearchComp from './tableSearch/index.vue';

defineOptions({
  name: 'TabelComp',
});

const props = defineProps<{
  config: TableConfig<T>;
}>();
const tableSearchCompRef = ref<InstanceType<typeof TableSearchComp>>(); // 搜索组件实例
const popUpFormBoxCompRef = ref<InstanceType<typeof PopUpFormBoxComp>>(); // 弹窗组件实例
const tableDataRef = ref<T[]>(); // 表格数据
const selectedRowKeysRef = ref<(string | number)[]>([]); // 选中行的 key
const selectedRowsRef = ref<T[]>([]); // 选中的行数据

const paginationRef = ref({
  page: 1,
  size: 10,
  total: 0,
});

const loadingRef = ref(false);

// 处理行选择变化
const handleSelectionChange = (selectedRowKeys: (string | number)[], selectedRows: T[]) => {
  selectedRowKeysRef.value = selectedRowKeys;
  selectedRowsRef.value = selectedRows;
  // 调用用户自定义的 onChange 回调
  props.config.rowSelection?.onChange?.(selectedRowKeys, selectedRows);
};

// 合并 rowSelection 配置
const mergedRowSelection = computed(() => {
  if (!props.config.rowSelection) {
    return undefined;
  }

  return {
    selectedRowKeys: selectedRowKeysRef.value,
    onChange: handleSelectionChange,
    type: props.config.rowSelection.type || 'checkbox',
    ...props.config.rowSelection,
  };
});

// 合并用户配置的列和内部操作列
const mergedColumns = computed<InternalTableType<T>[]>(() => {
  const columns: InternalTableType<T>[] = [...props.config.columns];

  // 如果有操作配置，添加操作列
  if (props.config.operate && props.config.operate.length > 0) {
    columns.push({
      title: '操作',
      dataIndex: '' as Extract<keyof T, string>,
      xtype: 'operate',
      fixed: props.config.operateFixed ? 'right' : undefined,
      width: props.config.operateWidth || 200,
    });
  }
  return columns;
});

onMounted(async () => {
  const res = tableSearchCompRef.value?.getSearch();
  await handleRequest(res || {});
});

/**
 * 搜索
 * @param search 搜索参数对象
 */
const onSearchClick = (search: Record<string, string | number | undefined>) => {
  paginationRef.value.page = 1;
  handleRequest({ ...search, page: 1, size: paginationRef.value.size });
};

/**
 * 分页变化
 * @param page 当前页
 * @param pageSize 每页条数
 */
const onPaginationChange = async (page: number, pageSize: number) => {
  if (pageSize !== paginationRef.value.size) {
    paginationRef.value.size = pageSize;
    paginationRef.value.page = 1;
  } else {
    paginationRef.value.page = page;
  }
  await handleRequest({
    ...tableSearchCompRef.value?.getSearch(),
    page: paginationRef.value.page,
    size: paginationRef.value.size,
  });
};

/**
 * 处理请求
 */
const handleRequest = async (params: Record<string, unknown>) => {
  loadingRef.value = true;
  let parameter: Record<string, unknown> | false = params;
  if (props.config.beforeRequest) {
    parameter = await props.config.beforeRequest({
      page: 1,
      size: 10,
      ...params,
    });
  }
  if (parameter === false) {
    loadingRef.value = false;
    return;
  }
  const res = await props.config.api({
    page: 1,
    size: 10,
    ...parameter,
  });
  if (res.code !== 200) {
    message.error(res.msg);
  }
  if (res.data && Array.isArray(res.data.data)) {
    tableDataRef.value = res.data.data;
    paginationRef.value.total = res.data.pagination.total;
  }
  props.config.afterResponse?.(res);
  loadingRef.value = false;
};

const tableMethod: TableMethodType<T> = {
  goPage: (page: number) => {
    onPaginationChange(page, paginationRef.value.size);
  },
  setSize: (size: number) => {
    onPaginationChange(1, size);
  },
  getSelectedRows: () => {
    return selectedRowsRef.value;
  },
  setSelected: fn => {
    selectedRowKeysRef.value = fn(selectedRowKeysRef.value, tableDataRef.value!);
    const rowKey = props.config.rowKey || 'id';
    selectedRowsRef.value = tableDataRef.value!.filter(item => {
      const key =
        typeof rowKey === 'function'
          ? (item as Record<string, unknown>)[rowKey(item)]
          : (item as Record<string, unknown>)[rowKey];
      return selectedRowKeysRef.value.includes(key as string | number);
    });
  },
  clearSelection: () => {
    selectedRowKeysRef.value = [];
    selectedRowsRef.value = [];
  },
  getTableData: () => {
    return tableDataRef.value!;
  },
  refresh: () => {
    if (tableSearchCompRef.value) {
      tableSearchCompRef.value?.reset();
    } else {
      handleRequest({});
    }
  },
};
</script>

<style scoped lang="less">
.table-container {
  padding: 16px;

  // Less 嵌套语法示例
  .table-header {
    margin-bottom: 16px;
  }
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .a-table {
    margin-top: 10px;
  }
}
</style>
