interface FormItemProps {
  higherDeptOptions?: any[];
  baseUrl: string;
  account: string;
  password: string;
  betType?: number;
  proxyType?: number;
  proxyHost?: string;
  proxyPort?: number;
  proxyUsername?: string;
  proxyPassword?: string;
}

interface FormProps {
  formInline: FormItemProps;
}

interface RoleFormItemProps {
  account: string;
  nickname: string;
  /** 角色列表 */
  roleOptions: any[];
  /** 选中的角色列表 */
  ids: Record<number, unknown>[];
}
interface RoleFormProps {
  formInline: RoleFormItemProps;
}

export type { FormItemProps, FormProps, RoleFormItemProps, RoleFormProps };
