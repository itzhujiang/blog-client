import SparkMd5 from 'spark-md5';
/**
 * 对文件进行分片
 * @param file file 文件
 * @param chunkSize 分片大小 单位 MB
 */
export const createChunks = (file: File, chunkSize: number) => {
  const result = [];
  for (let i = 0; i < file.size; i += chunkSize) {
    result.push(file.slice(i, i + chunkSize));
  }
  return result;
};

/**
 * 获取文件hash
 * @param {Array<Blob>} 分片数组
 */
export const getFileHash = (chunks: Blob[]) => {
  return new Promise(resolve => {
    const spark = new SparkMd5();
    function _read(i: number) {
      if (i >= chunks.length) {
        resolve(spark.end());
        return;
      }
      const blob = chunks[i];
      const reader = new FileReader();
      reader.onload = e => {
        const bytes = e.target?.result;
        spark.append(bytes || '');
        _read(i + 1);
      };
      reader.readAsArrayBuffer(blob!);
    }
    _read(0);
  });
};
