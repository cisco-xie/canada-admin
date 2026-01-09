import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  // username: [{ required: true, message: "账号为必填项", trigger: "blur" }],
  // password: [{ required: true, message: "用户密码为必填项", trigger: "blur" }],
  // group: [{ required: true, message: "小组为必填项", trigger: "blur" }]
});
