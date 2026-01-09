<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { geNotices } from "@/api/adminusers";
import NoticeList from "./components/NoticeList.vue";
import BellIcon from "@iconify-icons/ep/bell";

// i18n
const { t } = useI18n();

// 通知数量和列表
const noticesNum = ref(0);
const notices = ref<any[]>([]); // 用 any[] 来保持通知数据的类型
const activeKey = ref<string | null>(null);

// 获取通知标签的计算属性
const getLabel = computed(() => (item: any) => {
  const label = item.name || ""; // 确保 item.name 有值，避免传递无效参数
  return t(label) + (item.list?.length ? `(${item.list.length})` : "");
});

// 获取通知数据
const fetchNotices = async () => {
  try {
    const response = await geNotices(); // 调用 API 获取数据
    const data = response.data || []; // 确保返回数据不为空

    // 设置通知数据
    notices.value = data;
    console.log(data);
    // 计算通知总数量
    noticesNum.value = data.reduce(
      (sum, item) => sum + (item.list?.length || 0),
      0
    );

    // 设置默认选中的标签
    activeKey.value = data[0]?.key || null;
  } catch (error) {
    console.error("获取通知失败", error);
  }
};

// 声明定时器变量
let refreshTimer = null;

// 在组件挂载时调用 fetchNotices 方法
onMounted(() => {
  fetchNotices();
  // 每30秒刷新一次（30000毫秒）
  refreshTimer = setInterval(fetchNotices, 30000);
});
// 在组件卸载时清除定时器（避免内存泄漏）
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
});
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end">
    <span
      :class="[
        'dropdown-badge',
        'navbar-bg-hover',
        'select-none',
        Number(noticesNum) !== 0 && 'mr-[10px]'
      ]"
    >
      <el-badge :value="Number(noticesNum) === 0 ? '' : noticesNum" :max="99">
        <span class="header-notice-icon">
          <IconifyIconOffline :icon="BellIcon" />
        </span>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-tabs
          v-model="activeKey"
          :stretch="true"
          class="dropdown-tabs"
          :style="{ width: notices.length === 0 ? '200px' : '330px' }"
        >
          <el-empty
            v-if="notices.length === 0"
            :description="t('status.pureNoMessage')"
            :image-size="60"
          />
          <span v-else>
            <template v-for="item in notices" :key="item.key">
              <el-tab-pane :label="getLabel(item)" :name="`${item.key}`">
                <el-scrollbar max-height="330px">
                  <div class="noticeList-container">
                    <NoticeList :list="item.list" :emptyText="item.emptyText" />
                  </div>
                </el-scrollbar>
              </el-tab-pane>
            </template>
          </span>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  .noticeList-container {
    padding: 15px 24px 0;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 36px;
  }
}
</style>
