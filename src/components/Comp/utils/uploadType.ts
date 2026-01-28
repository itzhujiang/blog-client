interface BaseType {
  /** 文件大小 */
  fileSize?: number;
  /** 文件框大小 */
  size?: number;
  /** 文件类型 */
  type?: string[];
  /** 是否支持多选 */
  multiple?: boolean;
  /** 上传地址 */
  apiUrl: (_file: File) => Promise<UploadResponseType>;
  onPreview?: (_data: { code: string; url: string }) => void;
}

/** upload组件 */
export type UploadType = BaseType;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
/** 合并后的配置类型（将 fileSize 和 size 设为必填） */
export type UploadMergedConfigType = PartialBy<
  Required<Pick<BaseType, 'fileSize' | 'size' | 'multiple' | 'type' | 'apiUrl' | 'onPreview'>>,
  'onPreview'
>;

/** 成功上传的文件列表 */
export type SuccessFile = {
  /** 文件类型 file: 普通文件 image: 图片 video: 视频 */
  type: 'file' | 'image' | 'video';
  /** 图片url：用于展示 */
  imgUrl: string;
  /** 预览url：用于预览 */
  previewUrl: string;
  /** code:用于在发起网络请求携带 */
  code: string;
};

export type UploadResponseType = {
  code: 200 | 401 | 500;
  msg: string;
  data: {
    code: string;
    size: number;
    url: string;
  };
};

export type ModelValueType = {
  url: string;
  code: string;
  file?: File;
};
