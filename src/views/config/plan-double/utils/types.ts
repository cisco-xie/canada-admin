interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  higherDeptOptions: Record<string, string>[];
  account: string; // 账号
  lottery: string; // 游戏名称
  planType: number; // 方案类型 1自定义 2随机
  doubleType: number; // 翻倍类型
  settleType: number; // 结算类型 1不中翻倍 2中翻倍
  reverseType: string; // 反投类型 1竖式 2横式
  name: string; // 方案名称
  positions: {
    enable: any;
    winLocationNum: any; // 开号位置-用于计划003
    trackPositionNum: any; // 追踪号码-用于计划005
    shiftPositionNum: any; // 号码位移-用于计划005
    coolHotPositionNum: any; // 冷热位置-用于计划017
    coolHotRank: any; // 冷热排行-用于计划017
    winPositionNum: any; // 开出号码-用于计划003和025
    positionNum: any;
    locationNum: any;
  }[]; // 随机位置，第一名到第十名
  winPositions: string[]; // 开出号码数组-用于计划025
  locations: string[]; // 位置数组-用于计划025
  twoSidedDxPositions: string[]; // 双面位置，大小
  twoSidedDsPositions: string[]; // 双面位置，单双
  twoSidedLhPositions: string[]; // 双面位置，龙虎
  enable: number; // 是否启用（1: 启用, 0: 停用）
  winNum: number; // 中投数量
  monitorNum: number; // 监控期数
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
