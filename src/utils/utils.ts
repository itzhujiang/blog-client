import { marked } from 'marked';

/**
 * 解析md文件
 * @param url - Markdown文件的URL地址
 * @returns Promise<{ mdhtml: string; urls: string[]; content: string }> - 返回包含HTML、原始内容和媒体URL数组的对象
 */
export async function analysisMd(url: string): Promise<{ mdhtml: string; urls: string[]; content: string }> {
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

    // 返回HTML、原始内容和去重后的URL数组
    return {
      mdhtml,
      content: markdownContent,
      urls: Array.from(new Set(urls)),
    };
  } catch (error) {
    console.error('获取 markdown 内容失败:', error);
    throw error;
  }
}

export type MapType = {
  label: string;
  value: string | number;
};

/**
 * 数组转映射
 * @param { MapType } arr 数组
 * @param 谁为键
 * @returns
 */
export const arrToMap = (arr: MapType[], key: 'label' | 'value' = 'value') => {
  const result = arr.reduce((obj: Record<string, string | number>, item) => {
    if (key === 'value') {
      obj[item.value] = item.label;
    } else {
      obj[item.label] = item.value;
    }
    return obj;
  }, {});
  return result;
};

/**
 * 映射转数组
 */
export const mapToArr = (
  obj: Record<string, unknown>
): Array<{ label: string; value: unknown }> => {
  return Object.entries(obj).map(([key, value]) => ({
    label: key,
    value: value,
  }));
};

/**
 * md文本转html
 * @param str
 * @returns
 */
export const mdToHtml = async (str: string) => {
  const mdhtml = await marked(str);
  return mdhtml;
};
