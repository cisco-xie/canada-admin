interface FormItemProps {
  username: string;
  password: string;
  group: string;
}
interface FormItemGroupProps {
  group: string;
}
interface FormProps {
  [x: string]: any;
  formInline: {
    users: FormItemProps[]; // 用数组来管理多个账号、密码和小组的组合
    groups: string[]; // 小组的选项数组
  };
}
interface FormGroupProps {
  formInline: FormItemGroupProps;
}

export type { FormItemProps, FormProps, FormGroupProps, FormItemGroupProps };
