/**
 * 监听队列使用
 */
type RenderData = {
  renderNo: number | string;
  startTime: number;
  endTime: number;
};
export const useListenQueue = (
  intervalTime: number,
  callBack: (data: RenderData) => void
) => {
  let renderList: RenderData[] = [];
  let listenId: NodeJS.Timeout | null = null;
  // 加入监听队列
  const addQueueListener = (data: RenderData) => {
    renderList.push(data);
    startListener();
  };
  // 移除监听队列
  const removeQueueListener = (renderNo: number | string) => {
    renderList = renderList.filter((item) => item['renderNo'] !== renderNo);
  };
  // 移除监听
  const clearListener = () => {
    if (listenId) {
      clearInterval(listenId);
      listenId = null; // 重置监听ID
      renderList = [];
    }
  };
  // 启动监听
  const startListener = () => {
    if (listenId) {
      return;
    }
    listenId = setInterval(function () {
      const renderLength = renderList.length;
      if (renderLength === 0) {
        // 调用 clearListener 来处理清空逻辑
        clearListener();
        return;
      }
      const nowTime = new Date().getTime();
      const clearList = [];
      for (let i = 0; i < renderLength; i++) {
        const record = renderList[i];
        // 小于开始时间不处理
        if (record.startTime > nowTime) {
          continue;
        }
        // 大于开始时间
        if (record.endTime < nowTime) {
          clearList.push(i);
          continue;
        }
        // 执行回调函数
        callBack(record);
      }
      // 清除数据由大到小删除，避免 renderList 索引变化导致删除失败
      clearList.reverse().forEach((val) => {
        renderList.splice(val, 1);
      });
    }, intervalTime ?? 1000);
  };

  return {
    addQueueListener,
    removeQueueListener,
    clearListener,
  };
};
