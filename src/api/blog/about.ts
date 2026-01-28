import instance from '@/utils/axios';

export interface AboutSkillItem {
  /**  技能名称（如：React） */
  name: string;
  /** 熟练度 0-100 */
  level: number;
}

export interface AboutSkill {
  /** 技能分类名称（如：前端开发） */
  category: string;
  /** 该分类下的技能列表 */
  items: AboutSkillItem[];
}

export interface AboutTimelineItem {
  /** 时间戳（毫秒级Unix时间戳） */
  timestamp: number; //
  /** 标题（如：开启博客之旅） */
  title: string;
  /** 描述 */
  description: string;
}

export type AboutInfo = {
  /** id */
  id: number;
  /** 昵称 */
  nickname: string;
  /** 职业标签 */
  jobTitle: string;
  /** 内容 */
  contentUrl: string;
  /** 个人标签数组 */
  personalTags: string[];
  /** 联系方式，JSON格式 */
  contactInfo: Record<string, unknown>;
  /** 社交媒体链接，JSON格式 */
  socialLinks: Record<string, unknown>;
  /** 技能专长数组 */
  skills: AboutSkill[];
  /** 成长足迹数组 */
  timeline: AboutTimelineItem[];
  /** 头像 */
  avatarUrl: string;
};

/**
 * 获取关于我的信息
 * @returns
 */
export const getAboutInfo = async () =>
  await instance.get<Record<string, unknown>, AboutInfo, 'arr'>('/api/blog/about-me/info');

export interface UpdateAbout {
  /** id */
  id: number;
  /** 职业标签 */
  jobTitle: string;
  /** 头像文件Code */
  avatarCode?: string;
  /** 内容文件Code（Markdown格式） */
  contentCode?: string;
  /**个人标签数组 */
  personalTags: string[];
  /** 联系方式 */
  contactInfo: Record<string, unknown>;
  /** 社交媒体链接 */
  socialLinks: Record<string, unknown>;
  /** 技能专长数组 */
  skills: AboutSkill[];
  /** 成长足迹数组 */
  timeline: AboutTimelineItem[];
  /** 是否更新头像 */
  isUpdateAvatar: boolean;
  /** 是否更新内容文件 */
  isUpdateContent: boolean;
}

/**
 * 修改关于我信息
 * @param data
 * @returns
 */
export const updateAboutInfo = async (data: UpdateAbout) =>
  await instance.put<UpdateAbout, null, 'obj'>('/api/blog/about-me/update', data);
