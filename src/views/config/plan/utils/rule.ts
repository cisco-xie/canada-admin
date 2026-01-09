import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export function getFormRules(formInline: any): FormRules {
  return {
    lottery: [{ required: true, message: "游戏为必填项", trigger: "blur" }],
    planType: [
      { required: true, message: "方案类型为必填项", trigger: "blur" }
    ],
    name: [{ required: true, message: "方案名称为必填项", trigger: "blur" }],
    // positions: [
    //   { required: true, message: "随机位置为必填项", trigger: "blur" }
    // ],
    // 自定义的验证规则，确保至少选择一个选项
    atLeastOnePosition: [
      {
        validator: (rule: any, value: any, callback: Function) => {
          const {
            positions,
            twoSidedDxPositions,
            twoSidedDsPositions,
            twoSidedLhPositions
          } = formInline;
          // 检查四个字段中是否至少有一个选项被选择
          if (
            !positions.length &&
            !twoSidedDxPositions.length &&
            !twoSidedDsPositions.length &&
            !twoSidedLhPositions.length
          ) {
            callback(
              new Error("号码/大小/单双/龙虎。至少选择其中一个进行投注")
            );
          } else {
            callback();
          }
        },
        trigger: "change"
      }
    ],
    positiveAccountNum: [
      { required: true, message: "正投账号数量为必填项", trigger: "blur" }
    ],
    reverseAccountNum: [
      { required: true, message: "反投账号数量为必填项", trigger: "blur" }
    ],
    positiveNum: [
      {
        required: true,
        message: "正投个数为必填项",
        trigger: "blur"
      },
      {
        validator: (rule, value, callback) => {
          if (value < 1) {
            callback(new Error("正投个数不能小于 1"));
          } else if (value > 9) {
            callback(new Error("正投个数不能大于 9"));
          } else {
            callback();
          }
        },
        trigger: "blur"
      }
    ],
    positiveAmount: [
      {
        required: true,
        message: "正投金额为必填项",
        trigger: "blur"
      },
      {
        validator: (rule, value, callback) => {
          if (value < formInline.positiveNum) {
            callback(new Error("正投金额不能小于正投个数"));
          } else if (value < formInline.positiveAccountNum) {
            callback(new Error("正投金额不能小于正投账号数"));
          } else {
            callback();
          }
        },
        trigger: "blur"
      }
    ],
    reverseAmount: [
      {
        required: true,
        message: "反投金额为必填项",
        trigger: "blur"
      },
      {
        validator: (rule, value, callback) => {
          if (value < formInline.reverseNum) {
            callback(new Error("反投金额不能小于反投个数"));
          } else if (value < formInline.reverseAccountNum) {
            callback(new Error("反投金额不能小于反投账号数"));
          } else {
            callback();
          }
        },
        trigger: "blur"
      }
    ]
  };
}
