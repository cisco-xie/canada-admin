import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

/** 单号码统计 */
export interface DrawStatItem {
  prob: number;
  count: number;
}

/** 开奖统计：球位/和值 -> 号码 -> { prob, count } */
export interface DrawStatData {
  ball1: Record<string, DrawStatItem>;
  ball2: Record<string, DrawStatItem>;
  ball3: Record<string, DrawStatItem>;
  sum: Record<string, DrawStatItem>;
}

export type DrawStatResult = {
  code: number;
  msg: string;
  errDesc?: string | null;
  data: DrawStatData;
  success: boolean;
};

/** 获取开奖统计（各球位号码出现次数与概率、和值统计） */
export const getDrawStat = () => {
  return http.request<DrawStatResult>("get", baseUrlApi("draw/stat"), {});
};
