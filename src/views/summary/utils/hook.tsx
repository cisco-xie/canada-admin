import "./reset.css";
import { handleTree } from "@/utils/tree";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import { getDeptList } from "@/api/system";
import { getSummary } from "@/api/settled";
import {
  ref,
  computed,
  reactive,
  onMounted
  // onUnmounted
} from "vue";

export function useUser() {
  const form = reactive({
    // 左侧部门树的id
    deptId: "",
    account: "",
    phone: "",
    status: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  // const timer = ref(null);

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
    // {
    //   label: "勾选列", // 如果需要表格多选，此处label必须设置
    //   type: "selection",
    //   fixed: "left",
    //   reserveSelection: true // 数据刷新后保留选项
    // },
    {
      label: "账号",
      prop: "account",
      minWidth: 130
    },
    {
      label: "盘口",
      prop: "accountType",
      minWidth: 80,
      formatter: row => (row.accountType ? `${row.accountType}盘` : "")
    },
    {
      label: "投注类型",
      prop: "betType",
      minWidth: 100,
      formatter: row => {
        if (row.betType === null || row.betType === undefined) {
          return ""; // 返回空字符串表示不显示内容
        }
        return row.betType === 1 ? "正投" : "反投";
      }
    },
    {
      label: "余额",
      prop: "balance",
      minWidth: 130
    },
    {
      label: "未结算金额",
      prop: "betting",
      minWidth: 130
    },
    // {
    //   label: "最新注单期数",
    //   prop: "latestDrawNumber",
    //   minWidth: 130
    // },
    // {
    //   label: "最新注单金额",
    //   prop: "latestBetting",
    //   minWidth: 130
    // },
    {
      label: "今日流水",
      prop: "amount",
      minWidth: 130
    },
    {
      label: "今日盈亏",
      prop: "result",
      minWidth: 130
    },
    {
      label: "代理类型",
      prop: "proxyType",
      minWidth: 100,
      formatter: row => {
        if (row.proxyType === null || row.proxyType === undefined) {
          return ""; // 返回空字符串表示不显示内容
        }
        return row.proxyType === 1 ? "HTTP模式" : "SOCKS模式";
      }
    },
    {
      label: "代理IP",
      prop: "proxyHost",
      minWidth: 150
    },
    {
      label: "代理端口",
      prop: "proxyPort",
      minWidth: 80
    },
    {
      label: "代理账号",
      prop: "proxyUsername",
      minWidth: 120
    },
    {
      label: "代理密码",
      prop: "proxyPassword",
      minWidth: 120
      // formatter: () => "****" // 可隐藏具体密码，显示掩码
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

  async function onSearch() {
    loading.value = true;
    try {
      // 获取账号列表
      const { data } = await getSummary();

      // 更新 dataList
      dataList.value = data;
    } catch (error) {
      console.error("获取今日汇总失败", error);
    } finally {
      // 假设有加载延迟的情况，设置一个小延迟
      setTimeout(() => {
        loading.value = false;
      }, 100);
    }
  }

  // onMounted(() => {
  //   onSearch();
  //   // 设置定时器，每隔60秒刷新数据
  //   timer.value = setInterval(() => {
  //     onSearch();
  //   }, 60000); // 60秒
  // });

  // onUnmounted(() => {
  //   // 清理定时器
  //   if (timer.value) {
  //     clearInterval(timer.value);
  //   }
  // });

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();

    // 归属部门
    const { data } = await getDeptList();
    higherDeptOptions.value = handleTree(data);
    treeData.value = handleTree(data);
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
    onSearch
  };
}
