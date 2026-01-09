import "./reset.css";
import editForm from "../form/index.vue";
import groupForm from "../form/group.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemGroupProps, FormProps } from "./types";
import { getKeyList, deviceDetection } from "@pureadmin/utils";
import {
  getUsers,
  editUser,
  delUser,
  editGroup,
  getGroups
} from "@/api/adminusers";
import {
  type Ref,
  h,
  ref,
  toRaw,
  computed,
  reactive,
  onMounted
  // watch
  // onUnmounted
} from "vue";

export function useUser(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    group: ""
  });
  const formRef = ref();
  const dataList = ref([]);
  const groupList = ref([]);
  const loading = ref(true);
  // const timer = ref(null);

  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 15,
    currentPage: 1,
    layout: "total",
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
  const columns: TableColumnList = [
    // {
    //   label: "勾选列", // 如果需要表格多选，此处label必须设置
    //   type: "selection",
    //   fixed: "left",
    //   reserveSelection: true // 数据刷新后保留选项
    // },

    {
      label: "账号",
      prop: "username",
      width: 200,
      sortable: true,
      // 自定义表头，tsx用法
      headerRenderer: () => (
        <el-input
          v-model={search.value}
          size="large"
          clearable
          placeholder="搜索用户"
        />
      )
    },
    {
      label: "密码",
      prop: "password",
      minWidth: 130
    },
    {
      label: "小组",
      prop: "group",
      minWidth: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
      slot: "operation"
    }
  ];
  const search = ref("");
  const filterTableData = computed(() =>
    dataList.value.filter(
      data =>
        !search.value ||
        data.username.toLowerCase().includes(search.value.toLowerCase())
    )
  );

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
    delUser(row.username)
      .then(response => {
        const success = response?.success;
        success
          ? message(`您删除了${row.username}的这个用户`, {
              type: "success"
            })
          : message("删除失败", { type: "error" });
      })
      .catch(error => {
        console.error("删除失败", error);
      });
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
      // 获取账号列表
      const { data } = await getUsers(toRaw(form));
      const groups = (await getGroups()).data ?? [];
      // 更新 dataList
      dataList.value = data;
      pagination.total = dataList.value.length;
      groupList.value = groups;
    } catch (error) {
      console.error("获取账号列表失败", error);
    } finally {
      // 假设有加载延迟的情况，设置一个小延迟
      setTimeout(() => {
        loading.value = false;
      }, 100);
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    treeRef.value.onTreeReset();
    onSearch();
  };

  function openDialogGroup(title = "新增", row?: FormItemGroupProps) {
    addDialog({
      title: `${title}小组`,
      props: {
        formInline: {
          title,
          group: row?.group ?? ""
        }
      },
      width: "400px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(groupForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemGroupProps;
        FormRef.validate(async valid => {
          if (valid) {
            const payload = {
              operationType: title === "新增" ? "add" : "update",
              group: curData.group
            };
            try {
              // 调用 editAccount 方法
              await editGroup(payload);
              message(`成功${title}小组：${curData.group}`, {
                type: "success"
              });
              done(); // 关闭弹框
              onSearch(); // 刷新表格数据
            } catch (error) {
              message(`操作失败：${error.message}`, { type: "error" });
            }
          }
        });
      }
    });
  }

  async function openDialog(title = "新增", row?: FormProps) {
    const groups = (await getGroups()).data ?? [];
    addDialog({
      title: `${title}账号`,
      props: {
        formInline: {
          title,
          // 如果传入了 row，使用 row 初始化，否则使用空的用户数组
          users: row
            ? [{ ...row }]
            : [{ username: "", password: "", group: "", roles: "" }],
          groups
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
        const curData = options.props.formInline as FormProps; // 确保 curData 是 FormProps 类型
        console.log(curData.users);
        FormRef.validate(async valid => {
          if (valid) {
            // 如果是新增，curData.users 会是一个包含多个用户的数组
            const payload = {
              operationType: title === "新增" ? "add" : "update",
              users: curData.users.map(user => ({
                username: user.username,
                password: user.password,
                group: user.group,
                roles: Array.isArray(user.roles) ? user.roles[0] : user.roles // 判断 user.roles 是否是数组
              }))
            };

            try {
              // 调用 editUser 方法
              await editUser(payload);
              message(
                `成功${title}用户：${curData.users.map(user => user.username).join(", ")}`,
                {
                  type: "success"
                }
              );
              done(); // 关闭弹框
              onSearch(); // 刷新表格数据
            } catch (error) {
              message(`操作失败：${error.message}`, { type: "error" });
            }
          }
        });
      }
    });
  }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    groupList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    filterTableData,
    deviceDetection,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    openDialogGroup,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
