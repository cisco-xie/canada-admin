interface FormItemProps {
  orderNo: string;
  time: string;
  type?: string;
  drawNumber?: string;
  play?: string;
  range?: string;
  amount?: string;
  rebate?: string;
  result?: string;
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
