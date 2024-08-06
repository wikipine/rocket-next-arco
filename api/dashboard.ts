import request from '@/utils/request';

/**
 * 获取overview content
 */
export const getOverviewContentApi = () => {
  return request.get({
    url: '/api/workplace/overview-content',
  });
};

/**
 * 获取Popular content
 */
export const getPopularContentApi = (params: any) => {
  return request.get({
    url: '/api/workplace/popular-contents',
    params,
  });
};

/**
 * 获取Percentage content
 */
export const getPercentageContentApi = () => {
  return request.get({
    url: '/api/workplace/content-percentage',
  });
};

/**
 * 获取Announcement content
 */
export const getAnnouncementContentApi = () => {
  return request.get({
    url: '/api/workplace/announcement',
  });
};
