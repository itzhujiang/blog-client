// 本文件用于创建工具函数
import type { FormTypeConfig } from './formType';
import type { PupUpFormBoxConfig, msgType } from './popUpFormBoxType';
import type { TableSearch } from './searchTypes';
import type { TableConfig, ResponseFormatType, ResponseType } from './tableType';
/**
 * 创建表格配置的工具函数
 */
export function createTableConfig<C, T, E extends ResponseFormatType = 'arr'>(
  config: TableConfig<T, C, E>
): TableConfig<T, C, E> {
  return config;
}

/**
 * 创建表单配置的工具函数
 */
export function createFormConfig(config: FormTypeConfig): FormTypeConfig {
  return config;
}

export function createPopUpFormConfig<T, C>(
  config: PupUpFormBoxConfig<T, C>
): PupUpFormBoxConfig<T, C> {
  return config;
}

/**
 * 根据type获取对应的msg的type
 * @param code
 */
export const switchType = (code: ResponseType<unknown>['code']): msgType => {
  switch (code) {
    case 200:
      return 'success';
    case 500:
      return 'error';
    default:
      return 'warning';
  }
};

export const handleItemprops = <C extends Record<string, unknown>>(
  item: TableSearch<C>,
  formData: Record<string, unknown>
) => {
  if (!item.propsFn) return item.props || {};

  const value = formData[item.dataIndex as string];
  // 使用类型收窄
  switch (item.type) {
    case 'input':
    case 'timePicker':
      return item.propsFn(value as string, formData); // 使用类型断言是安全的
    case 'select':
    case 'cascader':
      return item.propsFn(value as string | number, formData);
    case 'datePicker':
    case 'dateTimePicker':
      return item.propsFn(value as number, formData);
    case 'dataTimeRangePicker':
      return item.propsFn(value as number[], formData);
    case 'timeRangePicker':
      return item.propsFn(value as string[], formData);
    case 'customComponent':
      return item.propsFn(value as unknown, formData);
    default:
      return {};
  }
};

/**
 * 处理字符串数据中的 | 符号，返回数组
 */
export const handleVerticalLine = (text?: string): string[] => {
  if (!text || !text.includes('|')) {
    return ['', ''];
  }
  return text.split('|');
};

/**
 * 获取文件名后缀
 * @param {File} file file文件
 * @returns {string} 文件后缀名（不包含点号），如果没有后缀返回空字符串
 */
export const getFileNameSuffix = (file: File): string => {
  const name = file.name;
  const lastDotIndex = name.lastIndexOf('.');

  // 如果没有找到点号，或者点号是最后一个字符，返回空字符串
  if (lastDotIndex === -1 || lastDotIndex === name.length - 1) {
    return '';
  }

  // 返回最后一个点号之后的部分，并转为小写
  return name.slice(lastDotIndex + 1).toLowerCase();
};

/**
 * 获取url的后缀
 * @param url 文件url
 * @returns {string} 文件后缀名（不包含点号），如果没有后缀返回空字符串
 */
export const getUrlSuffix = (url: string): string => {
  if (!url) {
    return '';
  }

  // 移除查询参数和锚点
  const cleanUrl = url.split('?')[0]?.split('#')[0] ?? url;

  const lastSlashIndex = cleanUrl.lastIndexOf('/');
  // 获取文件名（包含后缀）
  const fileName = lastSlashIndex !== -1 ? cleanUrl.slice(lastSlashIndex + 1) : cleanUrl;

  const lastDotIndex = fileName.lastIndexOf('.');

  // 如果没有找到点号，或者点号是最后一个字符，返回空字符串
  if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
    return '';
  }

  // 返回最后一个点号之后的部分，并转为小写
  return fileName.slice(lastDotIndex + 1).toLowerCase();
};

/**
 * 检测文件类型
 * @param suffix 文件后缀
 * @returns 文件类型 'image' | 'video' | 'file'
 */
export const detectFileType = (suffix: string): 'image' | 'video' | 'file' => {
  // 动态导入枚举数组以避免循环依赖
  const imageExtensions = [
    'jpeg',
    'jpg',
    'png',
    'gif',
    'bmp',
    'svg',
    'webp',
    'ico',
    'tiff',
    'tif',
    'psd',
    'raw',
    'avif',
    'heic',
    'heif',
    'jfif',
    'jp2',
    'jpm',
    'jxr',
    'apng',
  ];
  const videoExtensions = [
    'mp4',
    'avi',
    'mov',
    'wmv',
    'flv',
    'mkv',
    'webm',
    'm4v',
    'mpg',
    'mpeg',
    '3gp',
    '3g2',
    'ts',
    'mts',
    'm2ts',
    'f4v',
    'swf',
    'rm',
    'rmvb',
    'vob',
    'asf',
  ];

  if (videoExtensions.includes(suffix)) {
    return 'video';
  } else if (imageExtensions.includes(suffix)) {
    return 'image';
  } else {
    return 'file';
  }
};

/**
 * 获取视频第一帧的图片
 * @param source 视频源，可以是 File 对象或视频 URL
 * @param options 配置项
 * @param options.width 截图宽度，默认为视频宽度
 * @param options.height 截图高度，默认为视频高度
 * @param options.quality 图片质量，范围 0-1，默认 0.92
 * @param options.type 图片类型，默认 'image/png'
 * @returns Promise<string> 返回图片的 base64 字符串
 */
export const getVideoFirstFrame = (
  source: File | string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    type?: 'image/png' | 'image/jpeg' | 'image/webp';
  }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous'; // 处理跨域视频
    video.preload = 'metadata';
    video.muted = true; // 静音以允许自动播放

    // 错误处理
    video.onerror = () => {
      reject(new Error('视频加载失败'));
      URL.revokeObjectURL(video.src); // 清理 URL 对象
    };

    // 当视频元数据加载完成时
    video.onloadedmetadata = () => {
      // 设置视频时间为第一帧
      video.currentTime = 0;
    };

    // 当视频可以播放时（已加载第一帧）
    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('无法创建 Canvas 上下文'));
          return;
        }

        // 设置 canvas 尺寸
        canvas.width = options?.width || video.videoWidth;
        canvas.height = options?.height || video.videoHeight;

        // 绘制视频第一帧到 canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 转换为 base64
        const imageType = options?.type || 'image/png';
        const quality = options?.quality ?? 0.92;
        const base64 = canvas.toDataURL(imageType, quality);

        // 清理资源
        if (typeof source !== 'string') {
          URL.revokeObjectURL(video.src);
        }

        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };

    // 设置视频源
    if (source instanceof File) {
      video.src = URL.createObjectURL(source);
    } else {
      video.src = source;
    }
  });
};
