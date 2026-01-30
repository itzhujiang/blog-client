<template>
  <div class="about-container">
    <TableComp :config="config"></TableComp>
    <PreviewDialogComp ref="previewDialogCompRef"></PreviewDialogComp>
    <AImage
      :width="200"
      :style="{ display: 'none' }"
      :preview="{
        visible: visibleImageRef,
        onVisibleChange: setvisibleImage,
      }"
      :src="imgUrlRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { getAboutInfo, updateAboutInfo, type AboutInfo } from '@/api/blog/about';
import { upload } from '@/api/blog/upload';
import {
  DynamicsFormComp,
  UploadComp,
  createDynamicsFormConfig,
  type UploadResponseType,
  type UploadModelValueType,
  switchType,
  TableComp,
  createTableConfig,
  PreviewDialogComp,
} from '@/components/Comp/index';
import { FILE_DOMAIN } from '@/utils/constants';
import { analysisMd, arrToMap, mapToArr, type MapType } from '@/utils/utils';

defineOptions({
  name: 'blogAbout',
});

const config = createTableConfig<Record<string, unknown>, AboutInfo>({
  columns: [
    {
      title: 'id',
      dataIndex: 'id',
      width: 50,
      xtype: 'text',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      xtype: 'text',
    },
    {
      title: '职业标签',
      dataIndex: 'jobTitle',
      xtype: 'text',
    },
    {
      title: '头像',
      dataIndex: 'avatarUrl',
      xtype: 'render',
      render: () => {
        return '<a>查看</a>';
      },
      onClick: async value => {
        console.log('value', value);
        imgUrlRef.value = value as string;
        visibleImageRef.value = true;
      },
    },
    {
      title: '内容',
      dataIndex: 'contentUrl',
      xtype: 'render',
      render: () => {
        return '<a>查看</a>';
      },
      onClick: async value => {
        const { mdhtml } = await analysisMd((FILE_DOMAIN + value) as string);
        previewDialogCompRef.value?.open({
          title: '内容',
          content: mdhtml,
        });
      },
    },
    {
      title: '个人标签',
      dataIndex: 'personalTags',
      xtype: 'render',
      render: value => {
        return (value as string[]).join('、');
      },
    },
    {
      title: '联系方式',
      dataIndex: 'contactInfo',
      xtype: 'render',
      render: () => {
        return '<a>查看</a>';
      },
      onClick: value => {
        previewDialogCompRef.value?.open({
          title: '联系方式',
          content: `<pre>${JSON.stringify(value, null, 2)}</pre>`,
        });
      },
    },
    {
      title: '社交媒体',
      dataIndex: 'socialLinks',
      xtype: 'render',
      render: () => {
        return '<a>查看</a>';
      },
      onClick: value => {
        previewDialogCompRef.value?.open({
          title: '社交媒体',
          content: `<pre>${JSON.stringify(value, null, 2)}</pre>`,
        });
      },
    },
    {
      title: '技能专长',
      dataIndex: 'skills',
      xtype: 'render',
      render: () => {
        return '<a>查看</a>';
      },
      onClick: value => {
        previewDialogCompRef.value?.open({
          title: '技能专长',
          content: `<pre>${JSON.stringify(value, null, 2)}</pre>`,
        });
      },
    },
    {
      title: '成长足迹',
      dataIndex: 'timeline',
      xtype: 'render',
      render: () => {
        return '<a>查看</a>';
      },
      onClick: value => {
        previewDialogCompRef.value?.open({
          title: '成长足迹',
          content: `<pre>${JSON.stringify(value, null, 2)}</pre>`,
        });
      },
    },
  ],
  operate: [
    {
      label: '修改',
      onClick: (row, _data, comp, tableMethod) => {
        console.log(row);
        comp.open({
          title: '修改',
          width: '80%',
          labelCol: {
            span: 2,
          },
          data: {
            id: row.id,
            contactInfoArr: mapToArr(row.contactInfo),
            jobTitle: row.jobTitle,
            avatar: row.avatarUrl
              ? [
                  {
                    code: '',
                    url: row.avatarUrl,
                  },
                ]
              : '',
            content: row.contentUrl
              ? [
                  {
                    code: '',
                    url: row.contentUrl,
                  },
                ]
              : '',
            tags: row.personalTags.join('、'),
            socialLinksArr: mapToArr(row.socialLinks),
            skill: JSON.stringify(row.skills, null, 2),
            timeline: row.timeline,
            isUpdateAvatar: false,
            isUpdateContent: false,
          },
          columns: [
            {
              label: '职业标签',
              type: 'input',
              dataIndex: 'jobTitle',
              rules: [{ required: true, message: '请输入职业标签' }],
            },
            {
              label: '个人标签',
              type: 'input',
              dataIndex: 'tags',
              rules: [{ required: true, message: '请输入个人标签' }],
            },
            {
              label: '联系方式',
              type: 'component',
              component: DynamicsFormComp,
              dataIndex: 'contactInfoArr',
              config: createDynamicsFormConfig({
                showAddButton: true,
                height: 300,
                columns: [
                  {
                    title: '键',
                    dataIndex: 'label',
                    xtype: 'input',
                    rules: [{ required: true, message: '请输入联系方式的键' }],
                  },
                  {
                    title: '值',
                    dataIndex: 'value',
                    xtype: 'input',
                    rules: [{ required: true, message: '请输入联系方式的值' }],
                  },
                ],
                operate: [
                  {
                    label: '删除',
                    onClick: (data, index) => {
                      data.splice(index, 1);
                      return {
                        data,
                      };
                    },
                  },
                ],
              }),
              rules: [{ required: true, message: '请输入联系方式' }],
            },
            {
              label: '头像',
              type: 'component',
              component: UploadComp,
              dataIndex: 'avatar',
              config: {
                multiple: false,
                fileSize: 2,
                apiUrl: handleUpload,
                type: ['image/png', 'image/jpeg', 'image/jpg'],
              },
            },
            {
              label: '内容',
              type: 'component',
              component: UploadComp,
              dataIndex: 'content',
              config: {
                multiple: false,
                fileSize: 2,
                apiUrl: handleUpload,
                type: ['md'],
                onPreview: async (data: { code: string; url: string }) => {
                  console.log(data);
                  const content = (await analysisMd(data.url)).mdhtml;
                  previewDialogCompRef.value?.open({
                    title: '内容',
                    content,
                  });
                },
              },
            },
            {
              label: '社交媒体',
              type: 'component',
              component: DynamicsFormComp,
              dataIndex: 'socialLinksArr',
              config: createDynamicsFormConfig({
                showAddButton: true,
                height: 300,
                columns: [
                  {
                    title: '键',
                    dataIndex: 'label',
                    xtype: 'input',
                    placeholder: '请输入社交媒体的键',
                    rules: [{ required: true, message: '请输入社交媒体的键' }],
                  },
                  {
                    title: '值',
                    dataIndex: 'value',
                    xtype: 'input',
                    placeholder: '请输入社交媒体的值',
                    rules: [{ required: true, message: '请输入社交媒体的值' }],
                  },
                ],
                operate: [
                  {
                    label: '删除',
                    onClick: (data, index) => {
                      data.splice(index, 1);
                      return {
                        data,
                      };
                    },
                  },
                ],
              }),
              rules: [{ required: true, message: '请输入社交媒体' }],
            },
            {
              label: '成长足迹',
              type: 'component',
              component: DynamicsFormComp,
              dataIndex: 'timeline',
              config: createDynamicsFormConfig({
                showAddButton: true,
                height: 200,
                columns: [
                  {
                    title: '时间',
                    dataIndex: 'timestamp',
                    xtype: 'datePicker',
                    placeholder: '请选择时间',
                    rules: [{ required: true, message: '请选择时间' }],
                  },
                  {
                    title: '标题',
                    dataIndex: 'title',
                    xtype: 'input',
                    placeholder: '请输入标题',
                    rules: [{ required: true, message: '请输入标题' }],
                  },
                  {
                    title: '描述',
                    dataIndex: 'description',
                    xtype: 'input',
                    placeholder: '请输入描述',
                    rules: [{ required: true, message: '请输入描述' }],
                  },
                ],
                operate: [
                  {
                    label: '删除',
                    onClick: (data, index) => {
                      data.splice(index, 1);
                      return {
                        data,
                      };
                    },
                  },
                ],
              }),
              rules: [{ required: true, message: '请输入成长足迹' }],
            },
            {
              label: '技能专长',
              type: 'textarea',
              dataIndex: 'skill',
              placeholder: '请输入技能专长',
              rows: 10,
              rules: [{ required: true, message: '请输入技能专长' }],
            },
          ],
          api: updateAboutInfo,
          beforeRequest: async (data, getComponetRef) => {
            try {
              const timelineCompRef = (getComponetRef().timeline as InstanceType<
                typeof DynamicsFormComp
              >)!.getRef();
              const socialLinksCompRef = (getComponetRef().socialLinksArr as InstanceType<
                typeof DynamicsFormComp
              >)!.getRef();
              const contactInfoCompRef = (getComponetRef().contactInfoArr as InstanceType<
                typeof DynamicsFormComp
              >)!.getRef();
              const validateArr = [timelineCompRef, socialLinksCompRef, contactInfoCompRef].map(
                item => {
                  return new Promise(async (resolve, reject) => {
                    try {
                      await item?.validate();
                      resolve(1);
                    } catch {
                      reject();
                    }
                  });
                }
              );
              await Promise.all(validateArr);
              const avatar = data.avatar as '' | UploadModelValueType[];
              if (avatar && avatar[0]?.code) {
                data.isUpdateAvatar = true;
                data.avatarCode = avatar[0]?.code;
              }
              const content = data.content as '' | UploadModelValueType[];
              if (content && content[0]?.code) {
                data.isUpdateContent = true;
                data.contentCode = content[0]?.code;
              }
              const tag = data.tags as string;
              data.personalTags = tag.split('、');
              const skills = data.skill as string;
              data.skills = JSON.parse(skills);
              const socialLinksArr = data.socialLinksArr as MapType[];
              data.socialLinks = arrToMap(socialLinksArr, 'label');
              const contactInfoArr = data.contactInfoArr as MapType[];
              data.contactInfo = arrToMap(contactInfoArr, 'label');
              return data;
            } catch {
              return false;
            }
          },
          afterResponse: res => {
            if (res.code === 200) {
              console.log(tableMethod);

              tableMethod.refresh();
            }
            return {
              isMsg: true,
              msg: res.msg,
              type: switchType(res.code),
            };
          },
        });
      },
    },
  ],
  api: getAboutInfo,
  pagination: {
    isShow: true,
  },
});

const previewDialogCompRef = ref<InstanceType<typeof PreviewDialogComp>>();
const visibleImageRef = ref<boolean>(false); // 展示图片预览
const imgUrlRef = ref<string>();

/**
 * 设置图片预览隐藏
 */
const setvisibleImage = () => {
  visibleImageRef.value = false;
};

const handleUpload = async (file: File): Promise<UploadResponseType> => {
  const res = await upload(file);
  return {
    code: res.code,
    data: {
      code: res.data!.data.code,
      size: res.data!.data.size,
      url: res.data!.data.url,
    },
    msg: res.msg,
  };
};
</script>

<style lang="less" scoped></style>
