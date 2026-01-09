import "./reset.css";
import { handleTree } from "@/utils/tree";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import { getDeptList } from "@/api/system";
import { getFailedBet } from "@/api/settled";
import {
  ref,
  computed,
  reactive,
  onMounted
  // watch
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

  const lotterys = {
    PK10JSC: "极速赛车",
    LUCKYSB: "极速飞艇"
    // "11X5JSC": "极速11选5",
    // KLSFJSC: "极速快乐十分",
    // SSCJSC: "极速时时彩"
    // HK6JSC: "极速六合彩",
    // K3JSC: "极速快3",
    // KL8JSC: "极速快乐8",
    // PK10JSCNN: "极速牛牛",
    // FTJSC: "极速番摊",
  };

  const columns: TableColumnList = [
    // {
    //   label: "勾选列", // 如果需要表格多选，此处label必须设置
    //   type: "selection",
    //   fixed: "left",
    //   reserveSelection: true // 数据刷新后保留选项
    // },
    {
      label: "时间",
      prop: "createTime",
      minWidth: 130,
      sortable: true
    },
    {
      label: "种类",
      prop: "lottery",
      minWidth: 130,
      formatter: row => lotterys[row.lottery] || "未知游戏"
    },
    {
      label: "期数",
      prop: "drawNumber",
      minWidth: 130
    },
    {
      label: "失败账号",
      prop: "account",
      minWidth: 130
    },
    {
      label: "失败原因",
      prop: "message",
      minWidth: 80
    },
    {
      label: "是否为补单",
      prop: "isRepair",
      minWidth: 130,
      formatter: row => {
        if (row.isRepair === null || row.isRepair === undefined) {
          return "否";
        }
        return row.isRepair === 1 ? "是" : "否";
      }
    },
    {
      label: "补单情况",
      prop: "repair",
      minWidth: 130,
      formatter: row => {
        if (row.repair === null || row.repair === undefined) {
          return "";
        }
        return row.repair === 1 ? "补单成功" : "补单失败";
      }
    },
    {
      label: "补单账号",
      prop: "repairAccount",
      minWidth: 130
    },
    {
      label: "方案类型",
      prop: "type",
      minWidth: 130,
      formatter: row => {
        if (row.type === null || row.type === undefined) {
          return "";
        }
        return row.type === 1 ? "随机方案" : "计划方案";
      }
    },
    {
      label: "方案名称",
      prop: "planName",
      minWidth: 130
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
      const { data } = await getFailedBet();
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
