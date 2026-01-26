import "./reset.css";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "./types";
import {
  // getKeyList,
  isAllEmpty,
  // hideTextAtIndex,
  deviceDetection
} from "@pureadmin/utils";
// import {
//   // getRoleIds,
//   // getDeptList,
//   // getUserList,
//   // getAllRoleList
// } from "@/api/system";
import {
  getAccountList,
  enableDouble,
  unenableDouble,
  getAccountPlanDouble,
  editAccountPlanDouble,
  delAccountPlanDouble,
  getSkipStatus,
  skip
} from "@/api/config";
import { ElMessageBox } from "element-plus";
import {
  type Ref,
  h,
  ref,
  toRaw,
  watch,
  computed,
  reactive,
  onMounted
} from "vue";

export function useUser(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    // 左侧账号树的
    name: "",
    lottery: "",
    account: "",
    enable: "",
    positions: "",
    positiveNum: "",
    reverseNum: "",
    positiveAmount: ""
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  // 存储是否跳过状态
  const skipStatus = ref<number | null>(null); // 0: 关闭跳过, 1: 启用跳过
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const lotterys = {
    all: "主势盘",
    OPN: "单球1-3",
    TPD: "二字定位",
    DW3: "三字定位",
    n5: "两面盘"
  };

  const planTypeOptions = [
    { value: 1, label: "001 - 号码投注" },
    { value: 2, label: "002 - 位置开号投注" },
    { value: 3, label: "003 - 灵活开某投某" },
    { value: 5, label: "005 - 号码追踪" },
    { value: 17, label: "017 - 冷热号投注" },
    { value: 25, label: "025 - 开某投某" }
  ];

  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "所属游戏",
      prop: "lottery",
      minWidth: 130,
      formatter: row => lotterys[row.lottery] || "未知游戏"
    },
    {
      label: "计划类型",
      prop: "planType",
      minWidth: 130,
      formatter: row => {
        // 判断 planType 是否存在并且通过 planTypeOptions 查找对应的 label
        const planTypeOption = planTypeOptions.find(
          option => option.value === row.planType
        );
        return planTypeOption ? planTypeOption.label : "未知计划"; // 如果找不到，则返回"未知计划"
      }
    },
    {
      label: "计划名称",
      prop: "name",
      minWidth: 130
    },
    {
      label: "状态",
      prop: "enable",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.enable}
          active-value={1}
          inactive-value={0}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "正投账号数量",
      prop: "positiveAccountNum",
      minWidth: 50
    },
    {
      label: "正投金额",
      minWidth: 90,
      prop: "positiveAmount"
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });

  // 当前密码强度（0-4）
  const curScore = ref();
  // const roleOptions = ref([]);

  async function onChange({ row, index }) {
    if (loading.value) {
      return; // 如果正在加载，直接返回，避免重复触发
    }

    const action = row.enable === 0 ? "停用" : "启用";

    ElMessageBox.confirm(
      `确认要<strong>${action}</strong><strong style='color:var(--el-color-primary)'>${row.name}</strong>方案吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        // 开始加载状态
        switchLoadMap.value[index] = {
          ...switchLoadMap.value[index],
          loading: true
        };

        try {
          // 调用接口同步状态
          const response = await editAccountPlanDouble(toRaw(row));

          if (response?.success) {
            // 本地更新状态
            row.enable = row.enable === 0 ? 1 : 0;

            message("已成功修改方案状态", {
              type: "success"
            });
          } else {
            throw new Error("修改失败");
          }
        } catch (error) {
          console.error("修改方案状态失败:", error);

          // 回滚本地状态
          row.enable = row.enable === 0 ? 0 : 1;

          message("修改方案状态失败，请稍后重试", {
            type: "error"
          });
        } finally {
          // 结束加载状态
          switchLoadMap.value[index] = {
            ...switchLoadMap.value[index],
            loading: false
          };
          onSearch();
        }
      })
      .catch(() => {
        // 用户取消操作，回滚状态
        row.enable = row.enable === 0 ? 1 : 0;
      });
  }

  function handleUpdate(row) {
    console.log(row);
  }

  async function handleDelete(row) {
    const response = await delAccountPlanDouble([toRaw(row)]);
    if (response?.success) {
      message("删除成功", {
        type: "success"
      });
    } else {
      throw new Error("删除失败");
    }
    onSearch();
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  async function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    const response = await delAccountPlanDouble(curSelected);
    if (response?.success) {
      message("批量删除成功", {
        type: "success"
      });
    } else {
      throw new Error("批量删除失败");
    }
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  /** 一键启用方案 */
  async function handBatchEnable() {
    const response = await enableDouble();
    if (response?.success) {
      message("一键启用成功", {
        type: "success"
      });
    } else {
      throw new Error("一键启用失败");
    }
    onSearch();
  }

  /** 一键停用方案 */
  async function handBatchUnEnable() {
    const response = await unenableDouble();
    if (response?.success) {
      message("一键停用成功", {
        type: "success"
      });
    } else {
      throw new Error("一键停用失败");
    }
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getAccountPlanDouble(toRaw(form));
    dataList.value = data.flat(); // 将嵌套数组展平为一个平面数组
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function onSearchSkipStatus() {
    const { data } = await getSkipStatus();
    skipStatus.value = data;
    console.log(skipStatus.value);
  }

  // 切换方案状态的方法
  const toggleSkipStatus = async () => {
    if (skipStatus.value === 0) {
      // 启用方案
      try {
        await skip(1); // skip方法的参数1代表启用跳过
        skipStatus.value = 1; // 更新状态为停用方案
      } catch (error) {
        console.error("开启跳过失败", error);
      }
    } else if (skipStatus.value === 1) {
      // 停用方案
      try {
        await skip(0); // skip方法的参数0代表停用跳过
        skipStatus.value = 0; // 更新状态为启用方案
      } catch (error) {
        console.error("关闭跳过失败", error);
      }
    }
  };
  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    form.account = "";
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ account, selected }) {
    form.account = selected ? account : "";
    onSearch();
  }

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].status === 0 ? true : false;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}计划`,
      props: {
        formInline: {
          id: row?.id ?? "",
          title,
          higherDeptOptions: formatHigherDeptOptions(higherDeptOptions.value),
          account: row?.account ?? "",
          lottery: row?.lottery ?? "all",
          planType: row?.planType ?? 1,
          doubleType: row?.doubleType ?? 1,
          settleType: row?.settleType ?? 1,
          reverseType: row?.reverseType ?? "1",
          name: row?.name ?? "",
          positions: row?.positions ?? [],
          locations: row?.locations ?? [],
          twoSidedDxPositions: row?.twoSidedDxPositions ?? [],
          twoSidedDsPositions: row?.twoSidedDsPositions ?? [],
          twoSidedLhPositions: row?.twoSidedLhPositions ?? [],
          enable: row?.enable ?? 1,
          winNum: row?.winNum ?? 1,
          monitorNum: row?.monitorNum ?? 0,
          twoSidedDxNum: row?.twoSidedDxNum ?? 10,
          twoSidedDsNum: row?.twoSidedDsNum ?? 10,
          twoSidedLhNum: row?.twoSidedLhNum ?? 5,
          positiveAccountNum: row?.positiveAccountNum ?? "",
          positiveAmount: row?.positiveAmount ?? ""
        }
      },
      top: "0vh",
      width: "70%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          console.log(curData);
          editAccountPlanDouble(curData)
            .then(response => {
              // 假设返回数据中有 success 字段，判断操作是否成功
              if (response.success) {
                message(
                  `您为账号${curData.account}${title}了方案名称为${curData.name}的这条数据`,
                  {
                    type: "success"
                  }
                );
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              } else {
                // 如果 success 为 false，显示失败提示并输出错误信息
                message(`操作失败: ${response.msg}`, {
                  type: "error"
                });
              }
            })
            .catch(err => {
              console.error(err);
              message("操作失败，请稍后重试", { type: "error" });
            });
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log(curData.id);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();
    onSearchSkipStatus();

    // 归属部门
    const { data } = await getAccountList();
    const processedData = data.map(item => ({
      ...item,
      parentId: 0 // 添加或覆盖 parentId 属性
    }));
    higherDeptOptions.value = handleTree(processedData);
    treeData.value = handleTree(processedData);
    treeLoading.value = false;
    console.log(processedData);
  });
  /**
   * @description 提取接口数据中的所有 account
   * @param response 接口返回的完整数据
   * @returns account 列表
   */
  // 定义接口返回值的类型
  interface AccountResponse {
    data?: {
      account: string;
      [key: string]: any; // 允许有其他字段
    }[];
  }

  // 提取账户的方法
  const extractAccounts = (response: AccountResponse): string[] => {
    if (!response || !Array.isArray(response.data)) {
      console.warn("Invalid response format or data is not an array");
      return [];
    }
    return response.data.map(item => item.account);
  };

  // 异步调用接口并提取账户
  const fetchAccounts = async () => {
    try {
      const response: AccountResponse = await getAccountList(); // 确保 getAccountList 返回值符合 AccountResponse 类型
      const accountList = extractAccounts(response);
      console.log("Account List:", accountList);
      return accountList;
    } catch (error) {
      console.error("Error fetching account list:", error);
      return [];
    }
  };

  // 调用示例
  fetchAccounts();

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    planTypeOptions,
    skipStatus,
    deviceDetection,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    onTreeSelect,
    handleUpdate,
    handleDelete,
    // handleUpload,
    // handleReset,
    // handleRole,
    handBatchEnable,
    handBatchUnEnable,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange,
    onSearchSkipStatus,
    toggleSkipStatus
  };
}
