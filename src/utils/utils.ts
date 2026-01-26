import { marked } from 'marked';

/**
 * 解析md文件
 * @param url - Markdown文件的URL地址
 * @returns Promise<{ mdhtml: string; urls: string[] }> - 返回包含HTML和媒体URL数组的对象
 */
export async function analysisMd(url: string): Promise<{ mdhtml: string; urls: string[] }> {
  try {
    // 1. 从URL获取Markdown内容
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const markdownContent = await response.text();

    // 2. 将 markdown 转换为 HTML
    const mdhtml = await marked(markdownContent);

    // 3. 提取所有媒体文件的URL
    const urls: string[] = [];

    // 提取Markdown图片语法 ![alt](url) 或 ![alt](url "title")
    const markdownImageRegex = /!\[.*?\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
    let match: RegExpExecArray | null;
    while ((match = markdownImageRegex.exec(markdownContent)) !== null) {
      if (match[1]) {
        urls.push(match[1].trim());
      }
    }

    // 提取HTML <img src="url">
    const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    while ((match = htmlImageRegex.exec(markdownContent)) !== null) {
      if (match[1]) {
        urls.push(match[1].trim());
      }
    }

    // 提取HTML <video src="url">
    const htmlVideoRegex = /<video[^>]+src=["']([^"']+)["']/gi;
    while ((match = htmlVideoRegex.exec(markdownContent)) !== null) {
      if (match[1]) {
        urls.push(match[1].trim());
      }
    }

    // 提取HTML <source src="url">
    const htmlSourceRegex = /<source[^>]+src=["']([^"']+)["']/gi;
    while ((match = htmlSourceRegex.exec(markdownContent)) !== null) {
      if (match[1]) {
        urls.push(match[1].trim());
      }
    }

    // 返回HTML和去重后的URL数组
    return {
      mdhtml,
      urls: Array.from(new Set(urls)),
    };
  } catch (error) {
    console.error('获取 markdown 内容失败:', error);
    throw error;
  }
}

/**
 * 判断URL是否是绝对路径（带有域名）
 * @param url - 要检查的URL字符串
 * @returns boolean - 如果是绝对路径返回true，否则返回false
 */
export function isAbsoluteUrl(url: string): boolean {
  try {
    // 尝试创建URL对象，如果成功且有protocol和host，则为绝对路径
    const urlObj = new URL(url);
    // 检查是否有协议和主机名
    return !!urlObj.protocol && !!urlObj.host;
  } catch {
    // 如果URL构造失败，说明是相对路径或无效URL
    return false;
  }
}

/**
 * 将URL链接转换为File对象
 * @param url - 要转换的URL地址
 * @param filename - 可选的文件名，如果不提供则从URL中提取
 * @returns Promise<File> - 返回File对象
 */
export async function urlToFile(url: string, filename?: string): Promise<File> {
  try {
    // 使用fetch获取URL内容
    const response = await fetch(
      'https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-15-055646.png'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 获取blob数据
    const blob = await response.blob();

    // 如果没有提供文件名，从URL中提取
    let finalFilename = filename;
    if (!finalFilename) {
      // 从URL中提取文件名
      const urlPath = new URL(url).pathname;
      finalFilename = urlPath.substring(urlPath.lastIndexOf('/') + 1);

      // 如果URL中没有文件名，使用默认名称
      if (!finalFilename || finalFilename === '') {
        // 根据MIME类型生成默认文件名
        const mimeType = blob.type;
        const extension = mimeType.split('/')[1] || 'bin';
        finalFilename = `file_${Date.now()}.${extension}`;
      }
    }

    // 创建File对象
    const file = new File([blob], finalFilename, {
      type: blob.type,
      lastModified: Date.now(),
    });

    return file;
  } catch (error) {
    console.error('URL转换为File失败:', error);
    throw error;
  }
}

export type UrlToFileArrResult = {
  file: File;
  source: string;
};

/**
 * 获取url数组的file文件
 * @param urlArr
 * @returns
 */
export const urlToFileArr = async (urlArr: string[]): Promise<UrlToFileArrResult[]> => {
  const reqArr = urlArr.map(item => {
    return new Promise(async reslove => {
      const file = urlToFile(item);
      reslove({
        source: item,
        file,
      });
    });
  });
  const fileArr = (await Promise.all(reqArr)) as UrlToFileArrResult[];
  return fileArr;
};
