<script setup lang="ts">
import { ref, watch, computed } from "vue";
import ReCol from "@/components/ReCol";
import { getFormRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "../../hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    higherDeptOptions: [],
    account: "",
    lottery: "",
    planType: 1,
    doubleType: 1,
    settleType: 1,
    reverseType: "1",
    name: "",
    positions: Array.from({ length: 10 }, () => ({
      enable: 0,
      trackPositionNum: 0,
      shiftPositionNum: 0,
      winLocationNum: 1,
      winPositionNum: 0,
      coolHotPositionNum: 1,
      coolHotRank: 1,
      positionNum: 0,
      locationNum: 0
    })),
    winPositions: [],
    locations: [],
    twoSidedDxPositions: [],
    twoSidedDsPositions: [],
    twoSidedLhPositions: [],
    enable: 1,
    winNum: 1,
    monitorNum: 1,
    positionsNum: 10,
    twoSidedDxNum: 10,
    twoSidedDsNum: 10,
    twoSidedLhNum: 5,
    positiveAccountNum: 0,
    positiveAmount: 0
  })
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);
const formRules = computed(() => getFormRules());

newFormInline.value.twoSidedDxPositions =
  newFormInline.value.twoSidedDxPositions.map(pos => String(pos));
newFormInline.value.twoSidedDsPositions =
  newFormInline.value.twoSidedDsPositions.map(pos => String(pos));
newFormInline.value.twoSidedLhPositions =
  newFormInline.value.twoSidedLhPositions.map(pos => String(pos));

function getRef() {
  return ruleFormRef.value;
}

// 默认动态设置10行数据 适合001计划使用
if (
  !newFormInline.value.positions ||
  newFormInline.value.positions.length === 0
) {
  newFormInline.value.positions = Array.from({ length: 1 }, (_, index) => ({
    enable: 0,
    trackPositionNum: (index % 10) + 1,
    shiftPositionNum: "*",
    winLocationNum: 1,
    winPositionNum: (index % 10) + 1,
    coolHotPositionNum: 1,
    coolHotRank: 1,
    positionNum: (index % 10) + 1, // 递增值，最大为10，超过后重置为1
    locationNum: (index % 10) + 1 // 同样处理
  }));
}

// 新增一行
const addRows = () => {
  const newRows = Array.from({ length: 1 }, () => ({
    enable: 0,
    trackPositionNum: 1,
    shiftPositionNum: 1,
    winLocationNum: 1,
    winPositionNum: 1,
    coolHotPositionNum: 1,
    coolHotRank: 1,
    positionNum: 1,
    locationNum: 1
  }));
  newFormInline.value.positions.push(...newRows);
};

// 删除最后十行
const removeRows = () => {
  if (newFormInline.value.positions.length > 1) {
    newFormInline.value.positions.splice(-1, 1);
  }
};
defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="120px"
  >
    <el-row :gutter="30">
      <!-- 动态生成的行 -->
      <template
        v-for="(position, index) in newFormInline.positions"
        :key="index"
      >
        <re-col :value="4">
          <el-form-item :label="'开关'" :prop="`positions.${index}.enable`">
            <el-switch
              v-model="position.enable"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
              active-text="开"
              inactive-text="关"
              :style="switchStyle"
            />
          </el-form-item>
        </re-col>

        <re-col :value="8">
          <el-form-item
            :label="'开号位置'"
            :prop="`positions.${index}.locationNum`"
          >
            <el-tooltip
              content="<span>开号位置说明</br>
                      号码投注-多个号码可由英文逗号,分隔，例如:1,2,3</br>
                    </span>"
              effect="dark"
              placement="top"
              raw-content
            >
              <el-input
                v-model="position.locationNum"
                placeholder="请输入开号位置"
                class="w-full"
              />
            </el-tooltip>
          </el-form-item>
        </re-col>

        <re-col :value="9">
          <el-form-item
            :label="'投注位置'"
            :prop="`positions.${index}.positionNum`"
          >
            <el-tooltip
              content="<span>投注位置说明</br>
                      多个位置可由英文逗号,分隔，例如:1,2,3</br>
                    </span>"
              effect="dark"
              placement="top"
              raw-content
            >
              <el-input
                v-model="position.positionNum"
                placeholder="请输入投注位置"
                class="w-full"
              />
            </el-tooltip>
          </el-form-item>
        </re-col>
      </template>

      <!-- 新增/删除按钮 -->
      <re-col :value="24" class="mt-4">
        <el-button type="primary" @click="addRows">新增一行</el-button>
        <el-button
          v-if="newFormInline.positions.length > 1"
          type="danger"
          @click="removeRows"
        >
          删除最后一行
        </el-button>
      </re-col>
    </el-row>
  </el-form>
</template>
