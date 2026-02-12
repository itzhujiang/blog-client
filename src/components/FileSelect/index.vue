<!-- 用于选择文件 -->
<template>
  <div class="file-select-container">
    <AButton type="primary" @click="onOpenClick">上传附件</AButton>
    <AModal v-model:open="visibleRef" title="附件映射" @ok="onOk">
      <div class="main">
        <div v-for="item in listRef" :key="item.source" class="item">
          <div class="source">
            {{ item.source }}
          </div>
          <div class="icon">
            <IconComp type="jiantou_xiangyou"></IconComp>
          </div>
          <div class="upload">
            <UploadComp
              v-model="item.file"
              :config="{
                apiUrl: handleUpload,
                fileSize: 10,
                multiple: false,
                type: ['image/jpeg', 'image/png'],
              }"
            ></UploadComp>
          </div>
        </div>
      </div>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import IconComp from '../Icon/index.vue';

import { upload } from '@/api/blog/upload';
import { UploadComp, type UploadResponseType } from '@/components/Comp/index';
import type { UploadModelValueType } from '@/components/Comp/index';

type ListType = {
  source: string;
  file: UploadModelValueType | '';
};

defineOptions({
  name: 'fileSelect',
});

const modelValue = defineModel<ListType[]>();

const visibleRef = ref<boolean>(false);
const listRef = ref<{ source: string; file: UploadModelValueType[] | '' }[]>([]);

/**
 * 点击打开弹窗
 */
const onOpenClick = () => {
  listRef.value =
    modelValue.value?.map(item => {
      return {
        source: item.source,
        file: item.file ? [item.file] : '',
      };
    }) || [];
  visibleRef.value = true;
};

/**
 * 处理上传
 * @param file
 */
const handleUpload = async (file: File): Promise<UploadResponseType> => {
  const res = await upload(file);
  return {
    code: 200,
    msg: '成功',
    data: {
      code: res.data!.data.code,
      url: res.data!.data.url,
      size: res.data!.data.size,
    },
  };
};

const onOk = () => {
  modelValue.value = listRef.value.map(item => {
    return {
      source: item.source,
      file: item.file
        ? {
            code: item.file[0]!.code,
            url: item.file[0]!.url,
            file: item.file[0]!.file,
          }
        : '',
    };
  });
  visibleRef.value = false;
};
</script>

<style lang="less" scoped>
.main {
  max-height: 500px;
  overflow: auto;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 140px;
  overflow: hidden;

  .source {
    width: 1px;
  }
  div {
    flex: 1 1 0;
    flex-wrap: wrap;
  }
  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
  }
}
</style>
