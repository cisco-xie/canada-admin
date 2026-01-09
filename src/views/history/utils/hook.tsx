import "./reset.css";
import { handleTree } from "@/utils/tree";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import { getAccountList } from "@/api/config";
import { getHistory } from "@/api/settled";
import { type Ref, ref, computed, reactive, onMounted } from "vue";

export function useUser(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    // 左侧部门树的id
    id: "",
    account: "",
    phone: "",
    status: ""
  });
  const dataList = ref([]);
  const loading = ref(true);

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

  const columns: TableColumnList = [
    {
      label: "日期",
      prop: "date",
      minWidth: 130
    },
    {
      label: "注数",
      prop: "count",
      minWidth: 130
    },
    {
      label: "下注金额",
      prop: "betAmount",
      minWidth: 130
    },
    {
      label: "有效金额",
      prop: "forceAmount",
      minWidth: 100
    },
    {
      label: "佣金",
      prop: "cm",
      minWidth: 120
    },
    {
      label: "盈亏",
      prop: "dividend",
      minWidth: 80
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

  async function onSearch() {
    loading.value = true;
    try {
      const params = {
        id: form.id || "",
        account: form.account || "", // 从表单获取 account
        lottery: "PK10JSC"
      };
      // 获取账号列表
      const { data } = await getHistory(params);

      // 更新 dataList
      dataList.value = data.thisWeek;
      pagination.total = 10;
      pagination.pageSize = 10;
      pagination.currentPage = 1;
    } catch (error) {
      console.error("获取本周报表失败", error);
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
    form.id = "";
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
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    deviceDetection,
    onSearch,
    resetForm,
    onTreeSelect,
    handleUpdate,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
