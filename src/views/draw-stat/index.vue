<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getDrawStat, type DrawStatData, type DrawStatItem } from "@/api/draw";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";

defineOptions({
  name: "ConfigDrawStat"
});

const loading = ref(false);
const stat = ref<DrawStatData | null>(null);
const errorMsg = ref("");

function toSortedEntries(
  obj: Record<string, DrawStatItem>
): [string, DrawStatItem][] {
  if (!obj) return [];
  return Object.entries(obj).sort((a, b) => Number(a[0]) - Number(b[0]));
}

async function fetchStat() {
  loading.value = true;
  errorMsg.value = "";
  try {
    const res = await getDrawStat();
    if (res?.data) {
      stat.value = res.data;
    } else {
      errorMsg.value = res?.msg || "获取失败";
    }
  } catch (e: any) {
    errorMsg.value = e?.message || "请求异常";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchStat();
});
</script>

<template>
  <div class="p-4">
    <div class="mb-4 flex items-center gap-2">
      <span class="text-lg font-medium">历史开奖统计</span>
      <el-button
        :icon="useRenderIcon(Refresh)"
        :loading="loading"
        @click="fetchStat"
      >
        刷新
      </el-button>
      <span v-if="errorMsg" class="text-danger text-sm">{{ errorMsg }}</span>
    </div>

    <template v-if="stat">
      <el-row :gutter="16" class="mb-4">
        <el-col :xs="24" :sm="24" :md="8">
          <el-card shadow="hover" class="mb-4">
            <template #header>
              <span>第一球</span>
            </template>
            <el-table
              :data="toSortedEntries(stat.ball1)"
              size="small"
              border
              max-height="320"
            >
              <el-table-column prop="0" label="号码" width="70">
                <template #default="{ row }">{{ row[0] }}</template>
              </el-table-column>
              <el-table-column prop="1.count" label="中奖次数" width="100">
                <template #default="{ row }">{{ row[1].count }}</template>
              </el-table-column>
              <el-table-column prop="1.prob" label="中奖概率(%)">
                <template #default="{ row }">{{ row[1].prob }}%</template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-card shadow="hover" class="mb-4">
            <template #header>
              <span>第二球</span>
            </template>
            <el-table
              :data="toSortedEntries(stat.ball2)"
              size="small"
              border
              max-height="320"
            >
              <el-table-column prop="0" label="号码" width="70">
                <template #default="{ row }">{{ row[0] }}</template>
              </el-table-column>
              <el-table-column prop="1.count" label="中奖次数" width="100">
                <template #default="{ row }">{{ row[1].count }}</template>
              </el-table-column>
              <el-table-column prop="1.prob" label="中奖概率(%)">
                <template #default="{ row }">{{ row[1].prob }}%</template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-card shadow="hover" class="mb-4">
            <template #header>
              <span>第三球</span>
            </template>
            <el-table
              :data="toSortedEntries(stat.ball3)"
              size="small"
              border
              max-height="320"
            >
              <el-table-column prop="0" label="号码" width="70">
                <template #default="{ row }">{{ row[0] }}</template>
              </el-table-column>
              <el-table-column prop="1.count" label="中奖次数" width="100">
                <template #default="{ row }">{{ row[1].count }}</template>
              </el-table-column>
              <el-table-column prop="1.prob" label="中奖概率(%)">
                <template #default="{ row }">{{ row[1].prob }}%</template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="hover">
        <template #header>
          <span>和值 0～27</span>
        </template>
        <el-table
          :data="toSortedEntries(stat.sum)"
          size="small"
          border
          max-height="400"
        >
          <el-table-column prop="0" label="和值" width="80">
            <template #default="{ row }">{{ row[0] }}</template>
          </el-table-column>
          <el-table-column prop="1.count" label="中奖次数" width="100">
            <template #default="{ row }">{{ row[1].count }}</template>
          </el-table-column>
          <el-table-column prop="1.prob" label="中奖概率(%)">
            <template #default="{ row }">{{ row[1].prob }}%</template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>

    <el-empty v-else-if="!loading && !errorMsg" description="暂无数据" />
  </div>
</template>
