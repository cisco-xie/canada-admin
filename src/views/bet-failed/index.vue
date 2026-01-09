<script setup lang="ts">
import { ref } from "vue";
import tree from "./tree.vue";
import { useUser } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useAccountStore } from "@/store/modules/account";

import Upload from "@iconify-icons/ri/upload-line";
import Role from "@iconify-icons/ri/admin-line";
import Password from "@iconify-icons/ri/lock-password-line";
import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import Outlined from "@iconify-icons/ant-design/down-circle-outlined";
import ApiOutlined from "@iconify-icons/ant-design/api-outlined";

defineOptions({
  name: "BetFailed"
});

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
  treeData,
  treeLoading,
  selectedNum,
  pagination,
  buttonClass,
  deviceDetection,
  onSearch
} = useUser();
</script>

<template>
  <div :class="['flex', 'justify-between', deviceDetection() && 'flex-wrap']">
    <div :class="['mr-2', 'w-full']">
      <PureTableBar title="今日失败" :columns="columns" @refresh="onSearch">
        <template v-slot="{ size, dynamicColumns }">
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
            :default-sort="{ prop: 'createTime', order: 'descending' }"
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
