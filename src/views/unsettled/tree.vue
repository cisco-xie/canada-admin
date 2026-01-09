<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, computed, watch, getCurrentInstance } from "vue";

import Dept from "@iconify-icons/ri/git-branch-line";
import OnlineUser from "@iconify-icons/ant-design/user-outlined";
// import Reset from "@iconify-icons/ri/restart-line";
import More2Fill from "@iconify-icons/ri/more-2-fill";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import LocationCompany from "@iconify-icons/ep/add-location";
import ExpandIcon from "./svg/expand.svg?component";
import UnExpandIcon from "./svg/unexpand.svg?component";

interface Tree {
  id: string;
  name: string;
  account: string;
  highlight?: boolean;
  children?: Tree[];
}

defineProps({
  treeLoading: Boolean,
  treeData: Array
});

const emit = defineEmits(["tree-select"]);

const treeRef = ref();
const isExpand = ref(true);
const searchValue = ref("");
const highlightMap = ref({});
const { proxy } = getCurrentInstance();
const defaultProps = {
  children: "children",
  label: "account"
};
const buttonClass = computed(() => {
  return [
    "!h-[20px]",
    "!text-sm",
    "reset-margin",
    "!text-[var(--el-text-color-regular)]",
    "dark:!text-white",
    "dark:hover:!text-primary"
  ];
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.account.includes(value);
};

function nodeClick(value) {
  const account = value.account;
  const nodeId = value.$treeNodeId;
  console.log(account);
  highlightMap.value[account] = highlightMap.value[account]?.highlight
    ? Object.assign({ account: account }, highlightMap.value[account], {
        highlight: false
      })
    : Object.assign({ account: account }, highlightMap.value[account], {
        highlight: true
      });
  Object.values(highlightMap.value).forEach((v: Tree) => {
    if (v.account !== account) {
      v.highlight = false;
    }
  });
  emit(
    "tree-select",
    highlightMap.value[account]?.highlight
      ? Object.assign({ ...value, selected: true })
      : Object.assign({ ...value, selected: false })
  );
}

function toggleRowExpansionAll(status) {
  isExpand.value = status;
  const nodes = (proxy.$refs["treeRef"] as any).store._getAllNodes();
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].expanded = status;
  }
}

/** 重置部门树状态（选中状态、搜索框值、树初始化） */
function onTreeReset() {
  highlightMap.value = {};
  searchValue.value = "";
  toggleRowExpansionAll(true);
}

watch(searchValue, val => {
  treeRef.value!.filter(val);
});

defineExpose({ onTreeReset });
</script>

<template>
  <div
    v-loading="treeLoading"
    class="h-full bg-bg_color overflow-auto"
    :style="{ minHeight: `calc(100vh - 141px)` }"
  >
    <div class="flex items-center h-[34px]">
      <el-input
        v-model="searchValue"
        class="ml-2"
        size="small"
        placeholder="请输入账号名称"
        clearable
      >
        <template #suffix>
          <el-icon class="el-input__icon">
            <IconifyIconOffline
              v-show="searchValue.length === 0"
              icon="ri:search-line"
            />
          </el-icon>
        </template>
      </el-input>
    </div>
    <el-divider />
    <el-tree
      ref="treeRef"
      :data="treeData"
      node-key="id"
      size="large"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      @node-click="nodeClick"
    >
      <template #default="{ data }">
        <span
          :class="[
            'pl-1',
            'pr-1',
            'rounded',
            'flex',
            'items-center',
            'select-none',
            'hover:text-primary',
            searchValue.trim().length > 0 &&
              data.account.includes(searchValue) &&
              'text-red-500',
            highlightMap[data.account]?.highlight ? 'dark:text-primary' : ''
          ]"
          :style="{
            color: highlightMap[data.account]?.highlight
              ? 'var(--el-color-primary)'
              : '',
            background: highlightMap[data.account]?.highlight
              ? 'var(--el-color-primary-light-7)'
              : 'transparent'
          }"
        >
          <IconifyIconOffline :icon="OnlineUser" />
          {{ data.account }} {{ data.betType === 1 ? "(正)" : "(反)" }}
        </span>
      </template>
    </el-tree>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-divider) {
  margin: 0;
}

:deep(.el-tree) {
  --el-tree-node-hover-bg-color: transparent;
}
</style>
