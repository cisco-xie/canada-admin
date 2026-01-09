import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
  msg: string;
};

type ResultSummary = {
  success: boolean;
  data?: Array<any>;
  msg: string;
};

type ResultBetFailed = {
  success: boolean;
  data?: string;
};

type Result = {
  success: boolean;
  data?: {
    lastWeek: Array<any>;
    thisWeek: Array<any>;
  };
};

/** 今日已结 */
export const getSettled = (params: {
  account: string;
  settled: boolean;
  pageNo: number;
}) => {
  return http.request<ResultTable>("get", baseUrlApi("settled"), {
    params // 传递对象
  });
};

/** 今日汇总 */
export const getSummary = (params?: object) => {
  return http.request<ResultSummary>("get", baseUrlApi("summary/today"), {
    params
  });
};

/** 失败投注 */
export const getFailedBet = () => {
  return http.request<ResultSummary>("get", baseUrlApi("bet/failed"), {});
};

/** 今日最新失败投注 */
export const getFailedBetLatest = () => {
  return http.request<ResultBetFailed>(
    "get",
    baseUrlApi("bet/failed/latest"),
    {}
  );
};

/** 确认失败投注 */
export const confirm = (params: { key: string }) => {
  return http.request<Result>("get", baseUrlApi("bet/failed/confirm"), {
    params // 传递对象
  });
};

/** 本周报表 */
export const getHistory = (params: { account: string; lottery: string }) => {
  return http.request<Result>("get", baseUrlApi("history"), {
    params // 传递对象
  });
};

/** 代理报表 */
export const getAgent = (params?: object) => {
  return http.request<ResultSummary>("get", baseUrlApi("agent"), {
    params // 传递对象
  });
};
