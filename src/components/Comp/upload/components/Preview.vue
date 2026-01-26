<!-- 预览 -->
<template>
  <div class="preview-container">
    <div
    v-for="(item,index) in fileList"
    :key="index"
    class="file-preview"
    :style="{
        width: size + 'px',
        height: size+ 'px',
    }"
    >
    <div>
      <img v-if="item.type !== 'file'" :src="item.imgUrl" alt="">
      <div v-else>
          <FolderOpenOutlined
           :style="{
            fontSize: size / 2 + 'px',
            color: '#1677ff',
           }"
          />
      </div>
      <div class="tool-box" @click.stop>
              <EyeOutlined
                v-if="props.onPreview || item.type !== 'file'"
                :style="{
                    color: ' #fff', 
                    fontSize: `${size / 6}px`
                }"
                @click="onPreviewClick(item, index)"
              />
              <DeleteOutlined 
                :style="{
                  color: ' #fff', 
                  fontSize: `${size / 6}px`
                }"
                @click="onDelClick(index)"
              />
      </div>
    </div>
    </div>
  </div>
  <AImagePreviewGroup 
      :preview="{
        visible: visibleImageRef,
        onVisibleChange,
        current: currentRef,
      }"
      >
      <AImage
        v-for="(item,index) in imageFileList"
        :key="index"
        :src="item.previewUrl"
        style="display: none;"
      ></AImage>
  </AImagePreviewGroup>
  <AModal
      v-model:open="visibleVideoRef" 
      :footer="false"
      title="视频"
      @cancel="onCloseCancel"
    >
        <video
          ref="videoDomRef"
          controls
          :src="fileList[currentRef]?.previewUrl" 
          class="modal-video"
        ></video>
  </AModal>
</template>

<script setup lang="ts">
import { EyeOutlined, DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons-vue';
import { computed, ref } from 'vue';

import type { SuccessFile } from '../../utils/uploadType';

defineOptions({
  name: 'PreviewComp'
});

const props = defineProps<{
    fileList: SuccessFile[],
    size: number,
    onPreview?: (data: {code: string, url: string}) => void;
}>();

const emits = defineEmits<{
     (_e: 'onDelClick', _value: number): void;
}>();

const visibleImageRef = ref<boolean>(false);
const visibleVideoRef = ref<boolean>(false);
const videoDomRef = ref<HTMLVideoElement>();
const currentRef = ref<number>(1);

const imageFileList = computed(() => {
  return props.fileList.filter(item => item.type === 'image');
}); 

/**
 * 预览框变化
 * @param value 
 */
const onVisibleChange = (value:boolean) => {
  visibleImageRef.value = value;
};
/**
 * 点击预览
 * @param index 
 */
const onPreviewClick = (it: SuccessFile, index: number) => {
  if (it.type === 'image') {
    const index = imageFileList.value.findIndex((item) => item.imgUrl === it.imgUrl);
    currentRef.value = index;
    onVisibleChange(true);
  } else if (it.type === 'video') {
    currentRef.value = index;
    visibleVideoRef.value = true;
  } else if (it.type === 'file') {
   props.onPreview && props.onPreview({
      url: it.previewUrl,
      code: it.code
    })
  }
    
};
/**
 * 点击删除
 * @param index 
 */
const onDelClick = (index:number) => {
  emits('onDelClick', index);
};

const onCloseCancel = () => {
  if (videoDomRef.value) {
    videoDomRef.value.pause();
    videoDomRef.value.currentTime = 0;
  }
};

</script>

<style lang="less" scoped>
.preview-container{
    display: flex;
    .file-preview{
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border-radius: 6px;
         border: 1px dashed #d9d9d9;
        img {
            max-width: 100%;
            max-height: 100%;
            object-fit:fill;
        }
        .tool-box{
            display: none;
            position: absolute;
            background-color: rgba(0, 0, 0, 0.5);
            width: 100%;
            left: 0;
            bottom: 0;
            border-radius: 0 0 5px 5px;
            justify-content: space-around;
            padding: 5px 0;
        }
        &:hover .tool-box {
            display: flex !important;

        }
    }
    
}
.modal-video{
    max-width: 100%;
    max-height: 100%;
    object-fit:fill;
}
</style>
