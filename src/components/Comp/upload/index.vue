<!-- 文件上传 -->
<template>
  <div class="upload-container">
    <div v-if="mergedConfigRef.multiple">
      <PreviewComp
       :file-list=successFileListRef
       :size="mergedConfigRef.size"
       :onPreview="mergedConfigRef.onPreview"
       @on-del-click="onDelClick"
      />
    </div>
    <AUpload
      name="avatar"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :customRequest="customRequest"
      :multiple="mergedConfigRef.multiple"
    >
     <template v-if="mergedConfigRef.multiple || successFileListRef.length === 0">
      <PlusOutlined 
      :style="{
       fontSize: `${mergedConfigRef.size / 3}px`
      }"/>
     </template>
     <template v-else-if="!mergedConfigRef.multiple && successFileListRef.length !== 0">
      <PreviewComp
       :file-list=successFileListRef
       :size="mergedConfigRef.size"
       :onPreview="mergedConfigRef.onPreview"
       @on-del-click="onDelClick"
      />
     </template>
    </AUpload>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
import { cloneDeep } from 'lodash';
import { ref, watch } from 'vue';

import type { UploadType, UploadMergedConfigType, SuccessFile, UploadResponseType, ModelValueType } from '../utils/uploadType';
import { getFileNameSuffix, getUrlSuffix, detectFileType, getVideoFirstFrame } from '../utils/utils';

import PreviewComp from './components/Preview.vue';


defineOptions({
  name: 'UploadComp'
});

const modelValue = defineModel<ModelValueType[] | ''>()

const props = defineProps<{
    config: UploadType;
}>();


const defaultConfig = {
  fileSize: 10,
  size: 114,
  type: [],
  multiple: true,
  apiUrl:  (_file: File): Promise<UploadResponseType> => {
    return new Promise(reslove => {
      reslove({
        code: 200,
        data: {
          code: '',
          size: 0,
          url: '',
        },
        msg: '成功',
      })
    })
  },
  onPreview: undefined
};

const mergedConfigRef = ref<UploadMergedConfigType>(defaultConfig);
const successFileListRef = ref<SuccessFile[]>([]);


watch(modelValue, async (newValue) => {
  try {
    const data = newValue ? newValue?.map(item => {
      return new Promise<SuccessFile>(async (resolve) => {
        const suffix = getUrlSuffix(item.url);
        let imageUrl = null;
        if (detectFileType(suffix) === 'video') {
          imageUrl = await getVideoFirstFrame(item.url);
        } else {
          imageUrl = item.url;
        }
        resolve({
          imgUrl:imageUrl,
          code: item.code,
          previewUrl: item.url,
          type: detectFileType(suffix)
        });
      });
    }) : [];
  const list = await Promise.all(mergedConfigRef.value.multiple ? data : data[0] ? [data[0]] : []);
  successFileListRef.value = list;
  } catch (err) {
    console.error('处理失败：',err);
  }
}, {
  deep: true,
  immediate: true
})

const handleConfig = () => {
  const config = cloneDeep(props.config || {});
  mergedConfigRef.value = Object.assign({}, defaultConfig, config);
};

handleConfig();

/**
 * 上传前
 * @param file 
 */
const beforeUpload = (file: File) => {
  console.log(mergedConfigRef.value.type, file.type);
  
  if (file.type && mergedConfigRef.value.type.length > 0  && !mergedConfigRef.value.type.includes(file.type)) {
    message.error(`文件不符合:${mergedConfigRef.value?.type.join()}`);
    return false
  }
  const suffix = getFileNameSuffix(file);
  if (!file.type && mergedConfigRef.value.type.length > 0 && !mergedConfigRef.value.type.includes(suffix)) {
    message.error(`文件不符合:${mergedConfigRef.value?.type.join()}`);
    return false
  }
  if (file.size / 1024 / 1024 > mergedConfigRef.value.fileSize) {
    message.error(`文件不可超过:${mergedConfigRef.value.fileSize}MB`);
    return false
  };
  return true;

};

/**
 * 自定义上传
 */
const customRequest = async (option:UploadRequestOption) => {
  try {
    const res = await mergedConfigRef.value.apiUrl(option.file as File);
    if (res.code !== 200) {
      message.error('文件上传失败');
      throw new Error('文件上传失败')
    }
    const arr  = Array.isArray(res.data) ? res.data : [res.data];
    if (mergedConfigRef.value.multiple) {
      const primitive = modelValue.value || []
      modelValue.value = [...primitive, ...arr.map(item => {
        return {
          url: item.url,
          code: item.code,
          file: option.file as File
        }
      })];

    } else {
      modelValue.value = arr.map(item => {
        return {
          url: item.url,
          code: item.code,
          file: option.file as File
        }
      });
    }
  } catch (err) {
    console.error('上传报错：', err);
    
  }
  
};
/**
 * 删除
 * @param index 
 */
const onDelClick = (index:number) => {
  successFileListRef.value.splice(index, 1);
  modelValue.value && modelValue.value?.splice(index, 1);
};

</script>

<style lang="less" scoped>
.upload-container{
  display: flex;
  
  ::v-deep .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width:  v-bind('mergedConfigRef.size + "px"');
    height:  v-bind('mergedConfigRef.size + "px"');
  }
}


</style>
