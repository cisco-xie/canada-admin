<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import tree from "./tree.vue";
import { useUser } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useAccountStore } from "@/store/modules/account";

import Upload from "@iconify-icons/ri/upload-line";
import ProfileIcon from "@iconify-icons/ri/user-3-line";
import Password from "@iconify-icons/ri/lock-password-line";
import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import Outlined from "@iconify-icons/ant-design/down-circle-outlined";
import ApiOutlined from "@iconify-icons/ant-design/api-outlined";
import Money from "@iconify-icons/ant-design/money-collect-outlined";
import play from "@iconify-icons/ant-design/play-circle-outlined";
import pause from "@iconify-icons/ant-design/pause-circle-outlined";
import { getAutoBet, autoBet } from "@/api/config";

defineOptions({
  name: "Agent"
});

const size = ref("default");
const dynamicSize = ref();
const shortcuts = [
  {
    text: "今天",
    value: () => {
      const today = new Date();
      const start = new Date(today.setHours(0, 0, 0, 0)); // 今天的开始时间
      const end = new Date(today.setHours(23, 59, 59, 999)); // 今天的结束时间
      return [start, end];
    }
  },
  {
    text: "昨天",
    value: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1); // 设置为昨天
      const start = new Date(yesterday.setHours(0, 0, 0, 0)); // 昨天的开始时间
      const end = new Date(yesterday.setHours(23, 59, 59, 999)); // 昨天的结束时间
      return [start, end];
    }
  },
  {
    text: "本周",
    value: () => {
      const start = new Date();
      const end = new Date();
      const dayOfWeek = start.getDay(); // 获取今天是星期几
      const diff = start.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1); // 本周的第一天
      start.setDate(diff);
      start.setHours(0, 0, 0, 0); // 本周开始的时间
      end.setDate(diff + 6); // 本周的最后一天
      end.setHours(23, 59, 59, 999); // 本周结束的时间
      return [start, end];
    }
  },
  {
    text: "上周",
    value: () => {
      const end = new Date();
      const start = new Date();
      const dayOfWeek = start.getDay();
      const diff = start.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1); // 本周的第一天
      start.setDate(diff - 7); // 上周的第一天
      start.setHours(0, 0, 0, 0); // 上周开始的时间
      end.setDate(diff - 1); // 上周的最后一天
      end.setHours(23, 59, 59, 999); // 上周结束的时间
      return [start, end];
    }
  },
  {
    text: "本月",
    value: () => {
      const start = new Date();
      const end = new Date();
      start.setDate(1); // 设置为本月的第一天
      start.setHours(0, 0, 0, 0); // 本月开始的时间
      end.setMonth(end.getMonth() + 1); // 设置为下个月
      end.setDate(0); // 设置为本月的最后一天
      end.setHours(23, 59, 59, 999); // 本月结束的时间
      return [start, end];
    }
  },
  {
    text: "上月",
    value: () => {
      // 创建两个新的 Date 对象，确保它们不相互影响
      const start = new Date();
      const end = new Date();

      // 获取上个月的第一天
      start.setMonth(start.getMonth() - 1); // 设置为上个月
      start.setDate(1); // 设置为上个月的第一天
      start.setHours(0, 0, 0, 0); // 设置为当天的00:00:00

      // 获取上个月的最后一天
      end.setMonth(end.getMonth() - 1); // 设置为上个月
      end.setDate(0); // 设置为上个月的最后一天
      end.setHours(23, 59, 59, 999); // 设置为当天的23:59:59

      return [start, end];
    }
  }
];

watch(size, val =>
  val === "disabled"
    ? (dynamicSize.value = "default")
    : (dynamicSize.value = size.value)
);

// 统计方法
const getSummaries = ({ columns, data }) => {
  const totals = [];

  // 遍历 columns 进行总计计算
  columns.forEach((column, i) => {
    if (i === 0) {
      totals[i] = "总计"; // 第一列显示"总计"
    } else if (
      column.property === "forceAmount" ||
      column.property === "receivable"
    ) {
      const total = data.reduce((sum, row) => {
        const value = row[column.property];
        return sum + (typeof value === "number" ? value : 0);
      }, 0);

      totals[i] = total.toFixed(1); // 保留1位小数
    } else {
      totals[i] = ""; // 其他列不需要显示总计
    }
  });

  return totals;
};

const accountStore = useAccountStore(); // 获取 Pinia store

const refreshStatus = async () => {
  await accountStore.refreshAccountStatus(); // 调用 refreshAccountStatus
  console.log(accountStore.accountList); // 获取更新后的 accountList
};

const treeRef = ref();
const formRef = ref();
const tableRef = ref();
const {
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
  onTreeSelect,
  onbatchDel,
  handleUpdate,
  handleSizeChange,
  onSelectionCancel,
  handleCurrentChange,
  handleSelectionChange
} = useUser(tableRef, treeRef);
</script>

<template>
  <div :class="['flex', 'justify-between', deviceDetection() && 'flex-wrap']">
    <tree
      ref="treeRef"
      :class="['mr-2', deviceDetection() ? 'w-full' : 'min-w-[200px]']"
      :treeData="treeData"
      :treeLoading="treeLoading"
      @tree-select="onTreeSelect"
    />
    <div :class="['w-full']">
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <el-form-item label="时间范围：" prop="between">
          <el-date-picker
            v-model="form.between"
            type="daterange"
            class="!w-[240px]"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="shortcuts"
            :popper-options="{
              placement: 'bottom-start' // 下拉面板出现的位置，或 'top-start'、'bottom-end'、'top-end' 等，具体看 https://popper.js.org/docs/v2/constructors/#options
            }"
            :size="dynamicSize"
            :disabled="size === 'disabled'"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri:search-line')"
            :loading="loading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <PureTableBar title="分类报表" :columns="columns" @refresh="onSearch">
        <template v-slot="{ size, dynamicColumns }">
          <div
            v-if="selectedNum > 0"
            v-motion-fade
            class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
          >
            <div class="flex-auto">
              <span
                style="font-size: var(--el-font-size-base)"
                class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
              >
                已选 {{ selectedNum }} 项
              </span>
              <el-button type="primary" text @click="onSelectionCancel">
                取消选择
              </el-button>
            </div>
            <el-popconfirm title="是否确认删除?" @confirm="onbatchDel">
              <template #reference>
                <el-button type="danger" text class="mr-1">
                  批量删除
                </el-button>
              </template>
            </el-popconfirm>
          </div>
          <pure-table
            ref="tableRef"
            row-key="id"
            adaptive
            :adaptiveConfig="{ offsetBottom: 108 }"
            align-whole="center"
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            :default-sort="{ prop: 'username', order: 'ascending' }"
            show-summary
            :summary-method="getSummaries"
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
