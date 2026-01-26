import type { UploadResponseType } from '@/components/Comp';
import instance from '@/utils/axios';

/**
 * 上传
 * @param data
 * @returns
 */
export const upload = async (data: File) =>
  await instance.post<{ file: File }, UploadResponseType['data'], 'obj'>(
    '/api/blog/media/upload',
    {
      file: data,
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
