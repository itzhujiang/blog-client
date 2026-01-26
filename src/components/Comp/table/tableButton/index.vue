<template>
  <div class="button-container">
    <div>
      <AButton 
      v-for="item in config.leftBut"
      :key="item.label"
      class="left-but-item"
      :type="item.type"
      :danger="item.danger"
      :ghost="item.ghost"
      :href="item.href"
      @click="onButClick(item)"
      >
        {{ item.label }}
      </AButton>
    </div>
    <div class="but-right">
      <AButton 
      v-for="item in config.rightBut"
      :key="item.label"
      class="right-but-item"
      :type="item.type"
      :danger="item.danger"
      :ghost="item.ghost"
      :href="item.href"
      @click="onButClick(item)"
      >
        {{ item.label }}
      </AButton>
    </div>
  </div>
  <PupUpFormBoxComp ref="popUpFormBoxRef"></PupUpFormBoxComp>
</template>

<script setup lang="ts" generic="T = Record<string, unknown>">
import { computed, ref } from 'vue';

import PupUpFormBoxComp from '../../popUpFormBox/index.vue';
import type { ButtonType } from '../../utils/buttonType';
import type { TableMethodType } from '../../utils/tableType';

defineOptions({
  name: 'TableButtonCom'
});

const props = defineProps<{
  buttonConfig: {
    button: ButtonType[],
    tableMethod: TableMethodType<T>
  };
}>();

const popUpFormBoxRef = ref<InstanceType<typeof PupUpFormBoxComp>>();

const config = computed(() => {
  const leftBut = props.buttonConfig.button.filter(item => item.pos === 'left');
  const rightBut = props.buttonConfig.button.filter(item => item.pos === 'right' || !item.pos);
  return {
    leftBut,
    rightBut
  };
});

/**
 * 处理按钮点击
 * @param item 当前按钮的配置对象
 */
const onButClick = (item: ButtonType) => {
  item.onClick?.(popUpFormBoxRef.value!, props.buttonConfig.tableMethod as TableMethodType);
};

</script>

<style lang="less" scoped>
.button-container{
  width: 100%;
  display: flex;
  justify-content: space-between;
  div{
      flex: 1;
  }
  .but-right{
    display: flex;
    justify-content: flex-end;
  }
  .left-but-item{
    margin-right: 10px;
  }
  .right-but-item {
    margin-left: 10px;
  }
}
</style>
