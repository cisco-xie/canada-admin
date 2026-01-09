import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  code: number;
  success: boolean;
  data?: Array<any>;
  msg: string;
};
type ResultAutoBet = {
  code: number;
  success: boolean;
  data?: number;
  msg: string;
};
type ResultToken = {
  code: number;
  success: boolean;
  data?: {
    account: string;
    token: string;
  };
  msg: string;
};
type ResultBatchLogin = {
  code: number;
  msg: string;
  errDesc?: string | null;
  data?: {
    successCount: number;
    failureCount: number;
  };
  success: boolean;
};

// type ResultTable = {
//   success: boolean;
//   data?: {
//     /** 列表数据 */
//     list: Array<any>;
//     /** 总条目数 */
//     total?: number;
//     /** 每页显示条目个数 */
//     pageSize?: number;
//     /** 当前页数 */
//     currentPage?: number;
//   };
// };

/** 单个账号下线 */
export const singleLoginOut = (id?: string) => {
  return http.request<Result>("get", baseUrlApi("single-login-out"), {
    params: { id }
  });
};

/** 批量账号下线 */
export const batchLoginOut = () => {
  return http.request<Result>("get", baseUrlApi("batch-login-out"), {});
};

/** 单个账号登录 */
export const singleLogin = (id?: string) => {
  return http.request<ResultToken>("get", baseUrlApi("single-login"), {
    params: { id }
  });
};

/** 批量账号登录 */
export const batchLogin = () => {
  return http.request<ResultBatchLogin>("post", baseUrlApi("batch-login"), {});
};

/** 获取账号token */
export const getAccountToken = (id?: String) => {
  return http.request<Result>("get", baseUrlApi("token"), {
    params: { id }
  });
};

/** 获取账号余额 */
export const getAccountBalance = (id?: string) => {
  return http.request<Result>("get", baseUrlApi("balance"), {
    params: { id }
  });
};

/** 获取用户是否启用下注 */
export const getAutoBet = () => {
  return http.request<ResultAutoBet>("get", baseUrlApi("auto"));
};
/** 设置用户是否启用下注 */
export const autoBet = (auto?: number) => {
  return http.request<Result>("post", baseUrlApi(`auto/${auto}`));
};
/** 一键启用方案 */
export const enable = () => {
  return http.request<Result>("get", baseUrlApi("config/plan/enable"));
};
/** 一键停用方案 */
export const unenable = () => {
  return http.request<Result>("get", baseUrlApi("config/plan/unenable"));
};
/** 配置方案 */
export const editAccountPlan = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("config/plan"), { data });
};

/** 删除方案 */
export const delAccountPlan = (data?: object) => {
  return http.request<Result>("delete", baseUrlApi("config/plan"), { data });
};

/** 获取账号方案 */
export const getAccountPlan = (params?: object) => {
  return http.request<Result>("get", baseUrlApi("config/plan"), { params });
};

/** 一键启用方案 */
export const enableDouble = () => {
  return http.request<Result>("get", baseUrlApi("config/plan-double/enable"));
};
/** 一键停用方案 */
export const unenableDouble = () => {
  return http.request<Result>("get", baseUrlApi("config/plan-double/unenable"));
};
/** 配置翻倍方案 */
export const editAccountPlanDouble = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("config/plan-double"), {
    data
  });
};

/** 删除翻倍方案 */
export const delAccountPlanDouble = (data?: object) => {
  return http.request<Result>("delete", baseUrlApi("config/plan-double"), {
    data
  });
};

/** 获取账号翻倍方案 */
export const getAccountPlanDouble = (params?: object) => {
  return http.request<Result>("get", baseUrlApi("config/plan-double"), {
    params
  });
};

/** 账号列表 */
export const getAccountList = (params?: object) => {
  return http.request<Result>("get", baseUrlApi("accounts"), { params });
};

/** 配置账号 */
export const editAccount = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("accounts"), { data });
};

/** 删除账号 */
export const deleteAccount = (id?: string) => {
  return http.request<Result>("delete", baseUrlApi(`accounts/${id}`));
};

/** 获取账号是否开启计划超时跳过 */
export const getSkipStatus = () => {
  return http.request<ResultAutoBet>("get", baseUrlApi("skip"), {});
};

/** 设置账号是否开启计划超时跳过 */
export const skip = (skip?: number) => {
  return http.request<Result>("get", baseUrlApi(`skip/${skip}`), {});
};

/** 更新安全码 */
export const editSecurityCode = (securityCode?: string) => {
  return http.request<Result>("get", baseUrlApi("admin/user/code"), {
    params: { securityCode }
  });
};
