import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  data?: Array<any>;
};

/** 平台用户列表 */
export const getUsers = (params?: object) => {
  return http.request<Result>("get", baseUrlApi("admin/user"), { params });
};

/** 新增修改平台用户 */
export const editUser = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("admin/user"), { data });
};

/** 删除平台用户 */
export const delUser = (username?: string) => {
  return http.request<Result>("delete", baseUrlApi(`admin/user/${username}`));
};

/** 平台小组列表 */
export const getGroups = () => {
  return http.request<Result>("get", baseUrlApi("admin/group"), {});
};

/** 新增修改平台列表 */
export const editGroup = (params?: object) => {
  return http.request<Result>("post", baseUrlApi("admin/group"), { params });
};

/** 平台用户投注异常通知列表 */
export const geNotices = () => {
  return http.request<Result>("get", baseUrlApi("bet/skip/notices"), {});
};
