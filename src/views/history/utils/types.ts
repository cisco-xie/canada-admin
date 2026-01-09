interface FormItemProps {
  higherDeptOptions?: any[];
  id: string;
  account: string;
  date: string;
  betAmount?: string;
  count?: string;
  dividend?: string;
  forceAmount?: number;
  cm?: string;
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
