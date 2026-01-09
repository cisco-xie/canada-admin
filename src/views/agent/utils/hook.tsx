import "./reset.css";
import { message } from "@/utils/message";
import { handleTree } from "@/utils/tree";
import type { PaginationProps } from "@pureadmin/table";
import { getKeyList, deviceDetection } from "@pureadmin/utils";
import { getAgent } from "@/api/settled";
import { getAccountList } from "@/api/config";
import {
  type Ref,
  ref,
  computed,
  reactive,
  toRaw,
  onMounted
  // watch
  // onUnmounted
} from "vue";

export function useUser(tableRef: Ref, treeRef: Ref) {
  // const today = new Date();
  // const start = new Date(today.setHours(0, 0, 0, 0)); // 今天的开始时间
  // const end = new Date(today.setHours(23, 59, 59, 999)); // 今天的结束时间
  // 确保 form 的类型是 Date[]，并正确初始化
  // const form = ref<{ between: Date[] }>({
  //   between: [start, end] // 默认日期范围为今天
  // });
  const form = reactive({
    id: "",
    between: ""
  });
  const dataList = ref([]);
  const groupList = ref([]);
  const loading = ref(true);
  // const timer = ref(null);

  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 15,
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
  const columns: TableColumnList = [
    // {
    //   label: "勾选列", // 如果需要表格多选，此处label必须设置
    //   type: "selection",
    //   fixed: "left",
    //   reserveSelection: true // 数据刷新后保留选项
    // },

    {
      label: "彩种",
      prop: "lottery",
      width: 200
    },
    {
      label: "玩法",
      prop: "play",
      minWidth: 130
    },
    {
      label: "有效金额",
      prop: "forceAmount",
      minWidth: 100
    },
    {
      label: "应收下线",
      prop: "receivable",
      width: 200
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
      const response = await getAgent(query);

      if (response.success) {
        // 更新 dataList
        dataList.value = response.data;
      } else {
        message(`${response?.msg || "未知错误"}`, {
          customClass: "el",
          duration: 3000,
          type: "error"
        });
      }
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

  function onTreeSelect({ id, selected }) {
    form.id = selected ? id : "";
    onSearch();
  }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();

    // 归属账号
    const { data } = await getAccountList();
    const processedData = data.map(item => ({
      ...item,
      parentId: 0 // 添加或覆盖 parentId 属性
    }));
    higherDeptOptions.value = handleTree(processedData);
    treeData.value = handleTree(processedData);
    treeLoading.value = false;
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
    deviceDetection,
    onSearch,
    resetForm,
    onbatchDel,
    handleUpdate,
    onTreeSelect,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
