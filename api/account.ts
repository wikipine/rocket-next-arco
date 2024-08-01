import request from "@/utils/request";

// 退出登录
export const loginOutApi = () => {
    return request.post({
        url: '/user/logout'
    })
}

// 登录
export const loginApi = () => {
    return request.post({
        url: '/user/logout'
    })
}