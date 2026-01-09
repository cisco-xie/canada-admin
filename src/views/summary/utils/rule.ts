import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { isUrl } from "@pureadmin/utils";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  account: [{ required: true, message: "账号为必填项", trigger: "blur" }],
  password: [{ required: true, message: "用户密码为必填项", trigger: "blur" }],
  baseUrl: [
    { required: true, message: "盘口地址为必填项", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isUrl(value)) {
          callback(new Error("请输入正确的盘口地址"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});
