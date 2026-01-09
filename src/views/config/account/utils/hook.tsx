import "./reset.css";
import editForm from "../form/index.vue";
import securityCodeForm from "../form/securityCode.vue";
import { handleTree } from "@/utils/tree";
import { usePublicHooks } from "@/views/system/hooks";
import { useUserStoreHook } from "@/store/modules/user";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "./types";
import { getKeyList, deviceDetection } from "@pureadmin/utils";
import { getDeptList } from "@/api/system";
import { ElMessageBox } from "element-plus";
import {
  getAccountList,
  editAccount,
  deleteAccount,
  singleLoginOut,
  batchLoginOut,
  singleLogin,
  enable,
  unenable,
  // batchLogin,
  getAccountBalance,
  editSecurityCode
} from "@/api/config";
import { getSummary } from "@/api/settled";
import {
  type Ref,
  h,
  ref,
  toRaw,
  computed,
  reactive,
  onMounted,
  // watch
  onUnmounted
} from "vue";
// import { useAccountStore } from "@/store/modules/account";

// const accountStore = useAccountStore(); // 获取 Pinia store 实例
// const loginList = computed(() => accountStore.accountList); // 绑定 Pinia 数据
const { tagStyle } = usePublicHooks();

export function useUser(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    // 左侧部门树的id
    deptId: "",
    account: "",
    phone: "",
    status: "",
    between: ""
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const timer = ref(null);

  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 监听每个row的 isTokenValid变化，触发刷新
  // watch(
  //   () => loginList.value.map(row => row.isTokenValid), // 监听所有 row 的 isTokenValid 字段
  //   (newValue, oldValue) => {
  //     if (!newValue.every((v, i) => v === oldValue[i])) {
  //       // 如果值发生变化
  //       onSearch(); // 刷新数据
  //     }
  //   },
  //   { deep: true } // 深度监听，监控对象的嵌套值
  // );

  // 计算是否有 agent 角色
  const hasAgentRole = computed(() =>
    useUserStoreHook()?.roles?.includes("agent")
  );
  const columns: TableColumnList = [
    // {
    //   label: "勾选列", // 如果需要表格多选，此处label必须设置
    //   type: "selection",
    //   fixed: "left",
    //   reserveSelection: true // 数据刷新后保留选项
    // },
    {
      label: "盘口地址",
      prop: "baseUrl",
      minWidth: 180,
      hide: true
    },
    {
      label: "在线状态",
      prop: "isTokenValid",
      minWidth: 80,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} style={tagStyle.value(row.isTokenValid)}>
          {row.isTokenValid === 1 ? "在线" : "离线"}
        </el-tag>
      )
    },
    {
      label: "账号",
      prop: "account",
      minWidth: 130
    },
    {
      label: "密码",
      prop: "password",
      minWidth: 130,
      hide: true
    },
    {
      label: "投注类型",
      prop: "betType",
      minWidth: 100,
      formatter: row => (row.betType === 1 ? "正投" : "反投"),
      hide: hasAgentRole.value
    },
    {
      label: "额度",
      prop: "balance",
      minWidth: 130
    },
    {
      label: "未结算金额",
      prop: "betting",
      minWidth: 130,
      hide: hasAgentRole.value
    },
    {
      label: "两面有效金额",
      prop: "forceAmountTwoSided",
      minWidth: 130,
      hide: !hasAgentRole.value
    },
    {
      label: "两面应收下线",
      prop: "receivableTwoSided",
      minWidth: 130,
      hide: !hasAgentRole.value
    },
    {
      label: "非两面有效金额",
      prop: "forceAmountNonTwoSided",
      minWidth: 130,
      hide: !hasAgentRole.value
    },
    {
      label: "非两面应收下线",
      prop: "receivableNonTwoSided",
      minWidth: 130,
      hide: !hasAgentRole.value
    },
    {
      label: "总有效金额",
      prop: "forceAmount",
      minWidth: 130,
      hide: !hasAgentRole.value
    },
    {
      label: "总应收下线",
      prop: "receivable",
      minWidth: 130,
      hide: !hasAgentRole.value
    },
    {
      label: "今日流水",
      prop: "amount",
      minWidth: 130,
      hide: hasAgentRole.value
    },
    {
      label: "今日盈亏",
      prop: "result",
      minWidth: 130,
      hide: hasAgentRole.value
    },
    {
      label: "盘口",
      prop: "accountType",
      minWidth: 80,
      formatter: row => (row.accountType ? `${row.accountType}盘` : ""),
      hide: true
    },
    {
      label: "代理类型",
      prop: "proxyType",
      minWidth: 100,
      formatter: row => {
        if (
          row.proxyType === null ||
          row.proxyType === undefined ||
          row.proxyType === 0
        ) {
          return ""; // 返回空字符串表示不显示内容
        }
        return row.proxyType === 1 ? "HTTP模式" : "SOCKS模式";
      },
      hide: true
    },
    {
      label: "代理IP",
      prop: "proxyHost",
      minWidth: 150
    },
    {
      label: "延迟",
      prop: "delayMs",
      formatter: row => (row.delayMs ? `${row.delayMs}ms` : "-"),
      minWidth: 150
    },
    {
      label: "代理端口",
      prop: "proxyPort",
      minWidth: 80,
      hide: true
    },
    {
      label: "代理账号",
      prop: "proxyUsername",
      minWidth: 120,
      hide: true
    },
    {
      label: "代理密码",
      prop: "proxyPassword",
      minWidth: 120,
      hide: true
      // formatter: () => "****" // 可隐藏具体密码，显示掩码
    },
    {
      label: "封盘时间",
      prop: "closeTime",
      minWidth: 120,
      formatter: row =>
        row.closeTime === null ? "及时下注" : row.closeTime + "秒",
      hide: true
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
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

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    deleteAccount(row.id)
      .then(response => {
        const success = response?.success;
        success
          ? message(`您删除了账号为${row.account}的这条数据`, {
              type: "success"
            })
          : message("删除失败", { type: "error" });
      })
      .catch(error => {
        console.error("删除失败", error);
      });
    onSearch();
  }

  function handleSingleLoginOut(row) {
    ElMessageBox.confirm("下线后将无法自动投注，确定吗?", "系统提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString: true,
      draggable: true
    })
      .then(async () => {
        singleLoginOut(row?.id)
          .then(response => {
            const success = response?.success;
            if (success) {
              message(`账号 ${row.account} 下线成功`, { type: "success" });
            } else {
              message("下线失败", { type: "error" });
            }
          })
          .catch(error => {
            console.error("下线失败", error);
            message("下线失败，请检查网络或重试", { type: "error" });
          })
          .finally(() => {
            onSearch(); // 刷新数据
          });
      })
      .catch(() => {
        // 用户取消操作，回滚状态
      });
  }

  function handleBatchLoginOut() {
    ElMessageBox.confirm(
      "即将一键下线所有账号，下线后将无法自动投注，确定吗?",
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
        loading.value = true;
        batchLoginOut()
          .then(response => {
            const success = response?.success;
            if (success) {
              message("批量下线成功", { type: "success" });
            } else {
              message("批量下线失败", { type: "error" });
            }
          })
          .catch(error => {
            console.error("批量下线失败", error);
            message("批量下线失败，请检查网络或重试", { type: "error" });
          })
          .finally(() => {
            loading.value = false;
            onSearch(); // 刷新数据
          });
      })
      .catch(() => {
        // 用户取消操作，回滚状态
      });
  }

  async function handleBatchLoadingSummary() {
    try {
      loading.value = true;

      // 格式化日期为 YYYY-MM-DD
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，所以需要 +1
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      // 创建 query 对象
      // 检查 between 是否为数组
      const query = {
        ...toRaw(form),
        startDate: form.between?.[0]
          ? formatDate(new Date(form.between[0]))
          : undefined,
        endDate: form.between?.[1]
          ? formatDate(new Date(form.between[1]))
          : undefined
      };
      delete query.between; // 删除 between
      console.log(query);
      const { data } = await getSummary(query);
      // 更新 dataList
      dataList.value = data;
    } catch (error) {
      console.error("获取今日流水失败", error);
    } finally {
      // 假设有加载延迟的情况，设置一个小延迟
      setTimeout(() => {
        loading.value = false;
        onSearch();
      }, 100);
    }
  }
  async function handleBatchLoadingBalance() {
    if (!dataList.value || dataList.value.length === 0) {
      message("当前页面没有可更新的数据", { type: "warning" });
      return;
    }

    loading.value = true; // 启用加载状态
    let successCount = 0;
    let failureCount = 0;

    for (const row of dataList.value) {
      try {
        const response = await getAccountBalance(row?.id);
        if (response?.success) {
          successCount++;
          message(`账号: ${row?.account} 额度刷新成功`, {
            duration: 3000,
            type: "success"
          });
        } else {
          failureCount++;
          message(
            `账号: ${row?.account} 额度刷新失败，原因: ${response?.msg || "未知错误"}`,
            {
              customClass: "el",
              duration: 3000,
              type: "error"
            }
          );
        }
      } catch (error) {
        failureCount++;
        console.error(`账号: ${row?.account} 刷新失败，异常:`, error);
        message(`账号: ${row?.account} 额度刷新失败，网络异常`, {
          customClass: "el",
          duration: 3000,
          type: "error"
        });
      }
    }

    // 显示汇总结果
    message(`操作完成：成功 ${successCount} 条，失败 ${failureCount} 条`, {
      duration: 3000,
      type: "success"
    });

    // 根据需要刷新数据或单独更新
    onSearch();

    loading.value = false; // 关闭加载状态
  }

  function handleSingleLogin(row) {
    // const data = {
    //   account: row?.account,
    //   password: row?.password
    // };
    // 调用 API 函数 singleLogin
    singleLogin(row?.id)
      .then(response => {
        const success = response?.success;
        if (success) {
          if (response?.data.token) {
            message(`账号 ${row.account} 登录成功`, { type: "success" });
          } else {
            message("登录失败，请检查网络或重试", { type: "error" });
          }
        } else {
          message(response?.msg, { type: "error" });
        }
      })
      .catch(error => {
        console.error("登录失败", error);
        message("登录失败，请检查网络或重试", { type: "error" });
      })
      .finally(() => {
        onSearch(); // 刷新数据
      });
  }

  async function handleBatchLogin() {
    ElMessageBox.confirm(
      "即将一键登录所有账号，登录成功后其他平台将会退出对应账号，确定吗?",
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
        loading.value = true; // 启用加载状态
        let successCount = 0;
        let failureCount = 0;

        for (const row of dataList.value) {
          try {
            const response = await singleLogin(row?.id); // 每次调用单个登录接口
            const success = response?.success;

            if (success) {
              if (response?.data.token) {
                successCount++;
                message(`账号 ${row.account} 登录成功`, {
                  type: "success",
                  duration: 3000
                });
              } else {
                failureCount++;
                message(`账号 ${row.account} 登录失败`, {
                  type: "error",
                  duration: 3000
                });
              }
            } else {
              failureCount++;
              message(`${response?.msg}`, { type: "error", duration: 3000 });
            }
          } catch (error) {
            failureCount++;
            console.error(`账号 ${row.account} 登录失败，异常:`, error);
            message(`账号 ${row.account} 登录失败，网络异常`, {
              type: "error",
              duration: 3000
            });
          }
        }

        // 显示汇总结果
        message(`操作完成：成功 ${successCount} 个，失败 ${failureCount} 个`, {
          type: "success",
          duration: 3000
        });

        // 刷新流水数据
        handleBatchLoadingSummary();
        loading.value = false; // 关闭加载状态
      })
      .catch(() => {
        // 用户取消操作，回滚状态
      });
  }

  /** 一键启用方案 */
  async function handBatchEnable() {
    const response = await enable();
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
    const response = await unenable();
    if (response?.success) {
      message("一键停用成功", {
        type: "success"
      });
    } else {
      throw new Error("一键停用失败");
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
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    message(`已删除用户编号为 ${getKeyList(curSelected, "account")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    try {
      // 格式化日期为 YYYY-MM-DD
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，所以需要 +1
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      // 创建 query 对象
      // 检查 between 是否为数组
      const query = {
        ...toRaw(form),
        startDate: form.between?.[0]
          ? formatDate(new Date(form.between[0]))
          : undefined,
        endDate: form.between?.[1]
          ? formatDate(new Date(form.between[1]))
          : undefined
      };
      delete query.between; // 删除 between
      // 获取账号列表
      const { data } = await getAccountList(query);

      // 遍历 data，根据 account 匹配 loginList，添加 isTokenValid 状态
      // const enrichedData = data.map(item => {
      //   const matchingAccount = loginList.value.find(
      //     accountItem => accountItem.account === item.account
      //   );
      //   return {
      //     ...item,
      //     isTokenValid: matchingAccount?.isTokenValid ?? 0 // 默认状态为 false
      //   };
      // });

      // 更新 dataList
      dataList.value = data;
    } catch (error) {
      console.error("获取账号列表失败", error);
    } finally {
      // 假设有加载延迟的情况，设置一个小延迟
      setTimeout(() => {
        loading.value = false;
      }, 100);
    }
  }

  // onMounted(() => {
  //   onSearch();
  //   // 设置定时器，每隔10秒刷新数据
  //   timer.value = setInterval(() => {
  //     onSearch();
  //   }, 3000); // 3秒
  // });

  // onUnmounted(() => {
  //   // 清理定时器
  //   if (timer.value) {
  //     clearInterval(timer.value);
  //   }
  // });

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    form.deptId = "";
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    form.deptId = selected ? id : "";
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
      title: `${title}账号`,
      props: {
        formInline: {
          title,
          id: row?.id ?? "",
          baseUrl: row?.baseUrl ?? "", // 盘口地址
          higherDeptOptions: formatHigherDeptOptions(higherDeptOptions.value),
          account: row?.account ?? "", // 用户账号
          password: row?.password ?? "", // 用户密码
          betType: row?.betType ?? 1, // 默认投注类型为 1
          proxyType: row?.proxyType ?? 0, // 默认代理类型为 1
          proxyHost: row?.proxyHost ?? "", // 代理 IP
          proxyPort: row?.proxyPort ?? null, // 默认端口为 0
          proxyUsername: row?.proxyUsername ?? "", // 代理认证账号
          proxyPassword: row?.proxyPassword ?? "", // 代理认证密码
          closeTime: row?.closeTime ?? null // 距离时间
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (valid) {
            const payload = {
              operationType: title === "新增" ? "add" : "update",
              id: curData.id,
              baseUrl: curData.baseUrl,
              account: curData.account,
              password: curData.password,
              betType: curData.betType,
              proxyType: curData.proxyType,
              proxyHost: curData.proxyHost,
              proxyPort: curData.proxyPort,
              proxyUsername: curData.proxyUsername,
              proxyPassword: curData.proxyPassword,
              closeTime: curData.closeTime ?? null
            };
            try {
              // 调用 editAccount 方法并等待返回结果
              const response = await editAccount(payload);

              // 判断接口返回的 code 是否为 0
              if (response.code === 0) {
                message(`成功${title}用户：${curData.account}`, {
                  type: "success"
                });
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              } else {
                // 如果 code 不为 0，说明操作失败
                message(`操作失败：${response.msg || "未知错误"}`, {
                  type: "error"
                });
              }
            } catch (error) {
              // 捕获异常并提示错误
              message(`操作失败：${error.message || "未知错误"}`, {
                type: "error"
              });
            }
          }
        });
      }
    });
  }

  function openSecurityCodeDialog() {
    const securityFormRef = ref();

    addDialog({
      title: "设置安全码加密串",
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(securityCodeForm, { ref: securityFormRef }),
      beforeSure: async done => {
        const formRef = securityFormRef.value.getRef();
        const { securityCode } = securityFormRef.value.formInline;

        formRef.validate(async valid => {
          if (!valid) return;

          try {
            const res = await editSecurityCode(securityCode);
            if (res?.success || res?.code === 0) {
              message("安全码保存成功", { type: "success" });
              done();
            } else {
              message(res?.msg || "保存失败", { type: "error" });
            }
          } catch (e) {
            message("保存失败，请检查网络", { type: "error" });
          }
        });
      }
    });
  }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();

    //   // 设置定时器，每隔10秒刷新数据
    timer.value = setInterval(() => {
      onSearch();
    }, 30000); // 30秒
    // 归属部门
    const { data } = await getDeptList();
    higherDeptOptions.value = handleTree(data);
    treeData.value = handleTree(data);
    treeLoading.value = false;
  });

  onUnmounted(() => {
    // 清理定时器
    if (timer.value) {
      clearInterval(timer.value);
    }
  });

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
    deviceDetection,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    openSecurityCodeDialog,
    onTreeSelect,
    handleUpdate,
    handleDelete,
    handleSingleLoginOut,
    handleBatchLoginOut,
    handleBatchLoadingBalance,
    handleBatchLoadingSummary,
    handleSingleLogin,
    handleBatchLogin,
    handBatchEnable,
    handBatchUnEnable,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
