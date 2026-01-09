import "./reset.css";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import type { PaginationProps } from "@pureadmin/table";
import { getKeyList, deviceDetection } from "@pureadmin/utils";
import { getAccountList } from "@/api/config";
import { getSettled } from "@/api/settled";
import {
  type Ref,
  ref,
  // toRaw,
  computed,
  reactive,
  onMounted
} from "vue";

export function useUser(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    // 左侧部门树的id
    id: "",
    account: "",
    betType: "",
    settled: true,
    name: "",
    lottery: "",
    enable: "",
    positions: "",
    positiveNum: "",
    reverseNum: "",
    positiveAmount: "",
    reverseAmount: ""
  });
  const dataList = ref([]);
  const loading = ref(true);

  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 15,
    currentPage: 1,
    layout: "total, prev, pager, next, jumper",
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "账号",
      prop: "account",
      minWidth: 130
    },
    {
      label: "注单号",
      prop: "orderNo",
      minWidth: 130
    },
    {
      label: "期号",
      prop: "drawNumber",
      minWidth: 130
    },
    {
      label: "时间",
      prop: "time",
      minWidth: 130
    },
    {
      label: "类型",
      prop: "type",
      minWidth: 100
    },
    {
      label: "玩法",
      prop: "play",
      minWidth: 120
    },
    {
      label: "盘口",
      prop: "range",
      minWidth: 120
    },
    {
      label: "投注金额",
      prop: "amount",
      minWidth: 120
    },
    {
      label: "退水(%)",
      prop: "rebate",
      minWidth: 120
    },
    {
      label: "盈亏",
      prop: "result",
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
    console.log(pagination.currentPage);
    console.log(val);
    pagination.currentPage = val;
    onSearch();
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
      const params = {
        id: form.id || "", // 从表单获取 id
        account: form.account || "", // 从表单获取 account
        settled: true, // 获取 settled 状态
        pageNo: pagination.currentPage
      };
      // 获取今日已结列表
      const respone = await getSettled(params);
      // 校验返回的 success 字段
      if (respone.success) {
        // 如果请求成功，更新 dataList 和分页数据
        dataList.value = respone.data.list;
        pagination.total = respone.data.total;
        pagination.pageSize = respone.data.pageSize;
      } else {
        // 如果 success 为 false，提示错误消息
        message(`刷新明细失败:${respone.msg}`, { type: "error" });
        dataList.value = [];
        pagination.total = null;
        pagination.pageSize = null;
      }
    } catch (error) {
      dataList.value = [];
      pagination.total = null;
      pagination.pageSize = null;
      console.error("获取已结列表失败", error);
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
    onbatchDel,
    onTreeSelect,
    handleUpdate,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
