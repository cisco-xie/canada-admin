import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export function getFormRules(): FormRules {
  return {
    lottery: [{ required: true, message: "游戏为必填项", trigger: "blur" }],
    planType: [
      { required: true, message: "方案类型为必填项", trigger: "blur" }
    ],
    doubleType: [
      { required: true, message: "翻倍方式为必填项", trigger: "blur" }
    ],
    settleType: [
      { required: true, message: "结算模式为必填项", trigger: "blur" }
    ],
    name: [{ required: true, message: "方案名称为必填项", trigger: "blur" }],

    positiveAccountNum: [
      { required: true, message: "正投账号数量为必填项", trigger: "blur" }
    ],
    reverseAccountNum: [
      { required: true, message: "反投账号数量为必填项", trigger: "blur" }
    ],
    positiveAmount: [
      {
        required: true,
        message: "正投金额为必填项",
        trigger: "blur"
      }
    ],
    reverseAmount: [
      {
        required: true,
        message: "反投金额为必填项",
        trigger: "blur"
      }
    ]
  };
}
