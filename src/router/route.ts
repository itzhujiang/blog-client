import type { RouteRecordRaw } from 'vue-router';

import IconComp from '@/components/Icon/index.vue';

declare module 'vue-router' {
  interface RouteMeta {
    title: string; // 菜单标题
    icon?: InstanceType<typeof IconComp>['type']; // 图标名称
    showInMenu: boolean; // 是否显示在菜单
    id: string;
  }
}

export const routes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    name: 'home',
    path: '/',
    component: () => import('@/views/home/index.vue'),
    redirect: '/blog/article',
    children: [
      {
        name: 'blog',
        path: '/blog',
        meta: {
          title: '博客',
          icon: 'blog',
          showInMenu: true,
          id: '01',
        },
        children: [
          {
            name: 'blogArticle',
            path: '/blog/article',
            component: () => import('@/views/blogArticle/index.vue'),
            meta: {
              title: '博客文章',
              icon: 'article',
              showInMenu: true,
              id: '0101',
            },
          },
          {
            name: 'category',
            path: '/blog/category',
            component: () => import('@/views/blogCategory/index.vue'),
            meta: {
              title: '博客分类',
              icon: 'category',
              showInMenu: true,
              id: '0102',
            },
          },
          {
            name: 'comment',
            path: '/blog/comment',
            component: () => import('@/views/blogComment/index.vue'),
            meta: {
              title: '博客评论',
              icon: 'comment',
              showInMenu: true,
              id: '0103',
            },
          },
          {
            name: 'about',
            path: '/blog/about',
            component: () => import('@/views/blogAbout/index.vue'),
            meta: {
              title: '关于我',
              icon: 'about',
              showInMenu: true,
              id: '0104',
            },
          },
        ],
      },
    ],
  },
];
