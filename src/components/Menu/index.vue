<template>
    <div class="menu-container">
      <AMenu 
      mode="inline"
      :selectedKeys="selectedKeys"
      :openKeys="openKeys"
      :items="meun"
      @click="onMenuClcik"
      ></AMenu>
    </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { computed, h, onMounted, ref } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import type { ItemType, MenuProps } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router'
import { routes } from '@/router/route';

import IconComp from '@/components/Icon/index.vue'
import type { HistoryType } from '@/utils/type';


const props = withDefaults(defineProps<{
  height?: string
}>(), {
  height: '0'
})

defineExpose<{
  getHistory: () => HistoryType[],
  delHistory: (_id: string) => void
}>({
  /**
   * 获取历史选择的路由数组
   */
  getHistory: () => historyRef.value,
  delHistory: (id: string) => handleDelHistory(id)
})


const router = useRouter()
const route = useRoute()
const meun = computed<ItemType[]>(() => handleMeun(routes))
const historyRef = ref<HistoryType[]>([]);
const selectedKeys = computed<string[]>(() => [handleSelctedKey()]);
const openKeys = computed<string[]>(() => {
  const key =handleSelctedKey();
  return handleOpenKey(key)
});



onMounted(() => {
  const selctedKey = handleSelctedKey();
  historyRef.value.push({
    id: selctedKey,
    title: route.meta.title,
    pathName: route.name as string
  })
});



/**
 * 获取需要展开的菜单keys
 * @param targetKey 目标key
 */
const handleOpenKey = (targetKey: string): string[] => {
  const openKeys: string[] = [];
  /**
   * 递归查找目标路径
   * @param routes 路由数组
   * @param path 当前路径
   */
  const findPath = (routes: RouteRecordRaw[], path: string[]): boolean => {
    for (const route of routes) {
      if (route?.meta && route.meta.showInMenu) {
        const currentKey = route.meta.id + '-' + (route.name as string);
        const newPath = [...path, currentKey];

        if (currentKey === targetKey) {
          openKeys.push(...path);
          return true;
        }

        if (route.children && isMetaKey(route.children)) {
          if (findPath(route.children, newPath)) {
            return true;
          }
        }
      } else if (route?.children) {
        if (findPath(route.children, path)) {
          return true;
        }
      }
    }
    return false;
  };

  findPath(routes, []);
  return openKeys;
}

/**
 * 获取选择的key
 */
const handleSelctedKey = () => {
  return route.meta.id + '-' + (route.name as string)
}

/**
 * 处理 menu
 * @param routes
 */
const handleMeun = (routes: RouteRecordRaw[]): ItemType[] => {
  const result: ItemType[] = []
  const RecursionFn = (routes: RouteRecordRaw[], itemMap: ItemType[]) => {
    const length = routes.length;
    let i = 0;
    
    while(true) {
      if (i > length) {
        return
      }
      const route = routes[i];
      i++;
      if (route?.meta) {
        if (!route?.meta.showInMenu) {
          continue;
        }
        itemMap.push({
          key: route.meta.id + '-' + (route.name as string),
          icon: h(IconComp, {
            type: route.meta.icon,
            style: {
              fontSize: '16px'
            }
          }),
          label: route.meta.title || '',
          children: (route?.children && isMetaKey(route.children) ? [] : undefined) as ItemType[]
        })
      }
      if (route?.children) {
        const lastItem = itemMap[itemMap.length - 1];
        const map = lastItem && typeof lastItem === 'object' && 'children' in lastItem && Array.isArray(lastItem.children)
          ? lastItem.children
          : itemMap;
        RecursionFn(route.children, map)
      }
    }
  }
  RecursionFn(routes, result)
  
  return result;
}

/**
 * 是否有 Meta 属性
 * @param routes 
 */
const isMetaKey = (routes: RouteRecordRaw[]) => {
  
  const fn = (routes: RouteRecordRaw[]) => {
    let i = 0;
  const length = routes.length;
    while (true) {
      if (i > length) {
        return false;
      }
      const route = routes[i];
      i++;
      if (route?.meta) {
        return true;
      } 
      if (route?.children) {
       return fn(route.children)
      }
    }
  }
  return fn(routes)
}

/**
 * 获取路由跳转name
 * @param key 
 */
const getPathName = (key: string) => {
  let index = key.indexOf('-');
  return (index !== -1) ? key.substring(index + 1) : "";
}
/**
 * 菜单点击
 * @param item 
 */
const onMenuClcik:MenuProps['onClick'] = async (item) => {
  const pathName = getPathName(item.key as string)
  await router.push({
    name: pathName
  })
  if (historyRef.value.length >= 5) {
    historyRef.value.pop();
  }
  const id = handleSelctedKey();
  if (!historyRef.value.some(item => item.id === id)) {
    historyRef.value.push({
      id,
      title: route.meta.title,
      pathName,
    })
  }
  
}

/**
 * 处理删除历史项
 * @param id 
 */
const handleDelHistory = (id: string): void => {
  if (!historyRef.value.some(item => item.id === id)) {
    message.error('未在历史记录查找到')
    return
  }
  const index = historyRef.value.findIndex(item => item.id === id);
  historyRef.value.splice(index, 1)
}
</script>

<style lang="less" scoped>
.menu-container{
  width: 100%;
  height: calc(100% - v-bind(height));
  :deep(.ant-menu.ant-menu-root.ant-menu-inline.ant-menu-light){
    height: 100%;
  }
}

</style>