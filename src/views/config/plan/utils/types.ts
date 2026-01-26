interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  higherDeptOptions: Record<string, string>[];
  account: string; // 账号
  lottery: string; // 游戏名称
  planType: number; // 方案类型 1自定义 2随机
  name: string; // 方案名称
  positions: string[]; // 随机位置，第一名到第十名
  twoSidedDxPositions: string[]; // 双面位置，大小
  twoSidedDsPositions: string[]; // 双面位置，单双
  twoSidedLhPositions: string[]; // 双面位置，龙虎
  enable: number; // 是否启用（1: 启用, 0: 停用）
  positiveNum: number; // 正投数量
  reverseNum: number; // 反投数量
  positionsNum: number; // 号码随机数量
  twoSidedDxNum: number; // 大小随机数量
  twoSidedDsNum: number; // 单双随机数量
  twoSidedLhNum: number; // 龙虎随机数量
  positiveAccountNum: number; // 正投账号数量
  positiveAmount: number; // 正投金额
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
