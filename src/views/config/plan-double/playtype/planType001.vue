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
      enable: 1,
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

// 监听props.formInline的变化，更新newFormInline
watch(
  () => props.formInline,
  newValue => {
    newFormInline.value = { ...newValue };
    // 确保数组类型的属性也被正确处理
    newFormInline.value.twoSidedDxPositions =
      newFormInline.value.twoSidedDxPositions.map(pos => String(pos));
    newFormInline.value.twoSidedDsPositions =
      newFormInline.value.twoSidedDsPositions.map(pos => String(pos));
    newFormInline.value.twoSidedLhPositions =
      newFormInline.value.twoSidedLhPositions.map(pos => String(pos));

    // 如果是二字定位，自动设置positionNum
    if (newFormInline.value.lottery) {
      const lottery = newFormInline.value.lottery;
      if (
        lottery.includes("TPD") ||
        lottery.includes("TPC") ||
        lottery.includes("TPB")
      ) {
        if (newFormInline.value.positions) {
          newFormInline.value.positions.forEach(position => {
            if (
              !position.positionNum ||
              (position.positionNum !== "TPD" &&
                position.positionNum !== "TPC" &&
                position.positionNum !== "TPB")
            ) {
              if (lottery.includes("TPD")) {
                position.positionNum = "TPD";
              } else if (lottery.includes("TPC")) {
                position.positionNum = "TPC";
              } else if (lottery.includes("TPB")) {
                position.positionNum = "TPB";
              }
            }
          });
        }
      }
    }
  },
  { deep: true }
);

// 判断是否为单球1-3游戏种类
const isSingleBall = computed(() => {
  const result = newFormInline.value.lottery.includes("OPN");
  console.log(
    "isSingleBall计算结果:",
    result,
    "lottery值:",
    newFormInline.value.lottery
  );
  return result;
});

// 判断是否为二字定位游戏种类
const isTwoPosition = computed(() => {
  const result =
    newFormInline.value.lottery.includes("TPD") ||
    newFormInline.value.lottery.includes("TPC") ||
    newFormInline.value.lottery.includes("TPB");
  console.log(
    "isTwoPosition计算结果:",
    result,
    "lottery值:",
    newFormInline.value.lottery
  );
  return result;
});

// 判断是否为三字定位游戏种类
const isThreePosition = computed(() => {
  const result = newFormInline.value.lottery.includes("DW3");
  console.log(
    "isThreePosition计算结果:",
    result,
    "lottery值:",
    newFormInline.value.lottery
  );
  return result;
});

// 判断是否为两面盘游戏种类
const isTwoSided = computed(() => {
  const result = newFormInline.value.lottery.includes("n5");
  console.log(
    "isTwoSided计算结果:",
    result,
    "lottery值:",
    newFormInline.value.lottery
  );
  return result;
});

newFormInline.value.twoSidedDxPositions =
  newFormInline.value.twoSidedDxPositions.map(pos => String(pos));
newFormInline.value.twoSidedDsPositions =
  newFormInline.value.twoSidedDsPositions.map(pos => String(pos));
newFormInline.value.twoSidedLhPositions =
  newFormInline.value.twoSidedLhPositions.map(pos => String(pos));

function getRef() {
  return ruleFormRef.value;
}

// 两面盘：获取指定分组的已选值
function getN5SelectedValues(
  positionNum: string | number,
  group: string
): string[] {
  if (!positionNum || typeof positionNum !== "string") {
    return [];
  }

  const allValues = positionNum
    .split(",")
    .map(v => v.trim())
    .filter(v => v);

  const groupMap: Record<string, string[]> = {
    sum: ["总和大", "总和小", "总和单", "总和双"],
    dragon: ["龙", "虎", "和"],
    ball1: ["第一球-大", "第一球-小", "第一球-单", "第一球-双"],
    ball2: ["第二球-大", "第二球-小", "第二球-单", "第二球-双"],
    ball3: ["第三球-大", "第三球-小", "第三球-单", "第三球-双"]
  };

  const groupValues = groupMap[group] || [];
  return allValues.filter(v => groupValues.includes(v));
}

// 两面盘：更新投注类型（合并所有分组的选择）
function updateN5PositionNum(
  position: any,
  newValues: (string | number | boolean)[],
  group: string
) {
  // 将 CheckboxValueType[] 转换为 string[]（过滤掉 boolean 类型的值，只保留 string 和 number）
  const stringValues = newValues
    .filter(
      (v): v is string | number =>
        typeof v === "string" || typeof v === "number"
    )
    .map(v => String(v));

  // 获取其他分组的已选值
  const sumValues =
    group === "sum"
      ? stringValues
      : getN5SelectedValues(position.positionNum, "sum");
  const dragonValues =
    group === "dragon"
      ? stringValues
      : getN5SelectedValues(position.positionNum, "dragon");
  const ball1Values =
    group === "ball1"
      ? stringValues
      : getN5SelectedValues(position.positionNum, "ball1");
  const ball2Values =
    group === "ball2"
      ? stringValues
      : getN5SelectedValues(position.positionNum, "ball2");
  const ball3Values =
    group === "ball3"
      ? stringValues
      : getN5SelectedValues(position.positionNum, "ball3");

  // 合并所有选中的值，用逗号分隔
  const allSelected = [
    ...sumValues,
    ...dragonValues,
    ...ball1Values,
    ...ball2Values,
    ...ball3Values
  ];
  position.positionNum = allSelected.join(",");
}

// 默认动态设置数据 适合001计划使用
if (
  !newFormInline.value.positions ||
  newFormInline.value.positions.length === 0
) {
  // 根据游戏类型设置默认值
  let defaultPositionNum: string | number = 1; // 默认值（非二字定位时）
  if (newFormInline.value.lottery) {
    const lottery = newFormInline.value.lottery;
    if (
      lottery.includes("TPD") ||
      lottery.includes("TPC") ||
      lottery.includes("TPB")
    ) {
      // 二字定位：根据lottery设置默认定位类型
      if (lottery.includes("TPD")) {
        defaultPositionNum = "TPD";
      } else if (lottery.includes("TPC")) {
        defaultPositionNum = "TPC";
      } else if (lottery.includes("TPB")) {
        defaultPositionNum = "TPB";
      } else {
        defaultPositionNum = "TPD"; // 默认佰拾定位
      }
    } else if (lottery.includes("n5")) {
      // 两面盘：默认总和大
      defaultPositionNum = "总和大";
    }
  }

  newFormInline.value.positions = Array.from({ length: 1 }, (_, index) => {
    return {
      enable: 0,
      trackPositionNum: (index % 10) + 1,
      shiftPositionNum: "*",
      winLocationNum: 1,
      winPositionNum: (index % 10) + 1,
      coolHotPositionNum: 1,
      coolHotRank: 1,
      positionNum: defaultPositionNum, // 根据游戏类型设置默认值
      locationNum: "" // 默认空投注值
    };
  });
}

// 新增一行
const addRows = () => {
  // 根据游戏类型设置默认值
  let defaultPositionNum: string | number = 1; // 默认值（非二字定位时）
  if (newFormInline.value.lottery) {
    const lottery = newFormInline.value.lottery;
    if (
      lottery.includes("TPD") ||
      lottery.includes("TPC") ||
      lottery.includes("TPB")
    ) {
      // 二字定位：根据lottery设置默认定位类型
      if (lottery.includes("TPD")) {
        defaultPositionNum = "TPD";
      } else if (lottery.includes("TPC")) {
        defaultPositionNum = "TPC";
      } else if (lottery.includes("TPB")) {
        defaultPositionNum = "TPB";
      } else {
        defaultPositionNum = "TPD"; // 默认佰拾定位
      }
    } else if (lottery.includes("n5")) {
      // 两面盘：默认空（用户需要手动选择）
      defaultPositionNum = "";
    }
  }

  const newRows = Array.from({ length: 1 }, () => ({
    enable: 0,
    trackPositionNum: 1,
    shiftPositionNum: "*",
    winLocationNum: 1,
    winPositionNum: 1,
    coolHotPositionNum: 1,
    coolHotRank: 1,
    positionNum: defaultPositionNum, // 根据游戏类型设置默认值
    locationNum: "" // 默认空投注值
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
    <el-row :gutter="120">
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

        <!-- 单球1-3游戏种类的布局 -->
        <template v-if="isSingleBall">
          <re-col :value="8">
            <el-form-item
              :label="'第几球'"
              :prop="`positions.${index}.positionNum`"
            >
              <el-select
                v-model="position.positionNum"
                placeholder="请选择第几球"
                class="w-full"
              >
                <el-option
                  v-for="num in 3"
                  :key="num"
                  :label="'第' + num + '球'"
                  :value="String(num)"
                />
              </el-select>
            </el-form-item>
          </re-col>

          <re-col :value="10">
            <el-form-item
              :label="'投注值'"
              :prop="`positions.${index}.locationNum`"
            >
              <el-tooltip
                content="<span>投注值说明</br>
                        值可以填写大，小，单，双，数字是从0到9-多个和值可由英文逗号,分隔，例如:1,2,3</br>
                      </span>"
                effect="dark"
                placement="top"
                raw-content
              >
                <el-input
                  v-model="position.locationNum"
                  placeholder="请输入投注值"
                  class="w-full"
                />
              </el-tooltip>
            </el-form-item>
          </re-col>
        </template>

        <!-- 二字定位游戏种类的布局 -->
        <template v-else-if="isTwoPosition">
          <re-col :value="8">
            <el-form-item
              :label="'定位类型'"
              :prop="`positions.${index}.positionNum`"
            >
              <el-select
                v-model="position.positionNum"
                placeholder="请选择定位类型"
                class="w-full"
              >
                <el-option label="佰拾定位" value="TPD" />
                <el-option label="佰个定位" value="TPC" />
                <el-option label="拾个定位" value="TPB" />
              </el-select>
            </el-form-item>
          </re-col>

          <re-col :value="10">
            <el-form-item
              :label="'投注位置'"
              :prop="`positions.${index}.locationNum`"
            >
              <el-tooltip
                content="<span>投注位置说明</br>
                        位置范围：0到99</br>
                        多个位置可由英文逗号,分隔，例如:88,84,77</br>
                      </span>"
                effect="dark"
                placement="top"
                raw-content
              >
                <el-input
                  v-model="position.locationNum"
                  placeholder="请输入投注位置（0-99）"
                  class="w-full"
                />
              </el-tooltip>
            </el-form-item>
          </re-col>
        </template>

        <!-- 三字定位游戏种类的布局 -->
        <template v-else-if="isThreePosition">
          <re-col :value="18">
            <el-form-item
              :label="'投注位置'"
              :prop="`positions.${index}.locationNum`"
            >
              <el-tooltip
                content="<span>投注位置说明</br>
                        位置范围：0到999</br>
                        多个位置可由英文逗号,分隔，例如:884,123,001</br>
                        例如：8+8+4=20就是884位置中</br>
                      </span>"
                effect="dark"
                placement="top"
                raw-content
              >
                <el-input
                  v-model="position.locationNum"
                  placeholder="请输入投注位置（0-999）"
                  class="w-full"
                />
              </el-tooltip>
            </el-form-item>
          </re-col>
        </template>

        <!-- 两面盘游戏种类的布局 -->
        <template v-else-if="isTwoSided">
          <re-col :value="24">
            <el-form-item
              :label="'投注类型'"
              :prop="`positions.${index}.positionNum`"
            >
              <div class="n5-bet-type-container">
                <!-- 总和 -->
                <div class="n5-bet-group">
                  <div class="n5-bet-group-title">总和</div>
                  <el-checkbox-group
                    :model-value="
                      getN5SelectedValues(position.positionNum, 'sum')
                    "
                    class="n5-checkbox-group"
                    @change="vals => updateN5PositionNum(position, vals, 'sum')"
                  >
                    <el-checkbox label="总和大" value="总和大" border />
                    <el-checkbox label="总和小" value="总和小" border />
                    <el-checkbox label="总和单" value="总和单" border />
                    <el-checkbox label="总和双" value="总和双" border />
                  </el-checkbox-group>
                </div>

                <!-- 龙虎和 -->
                <div class="n5-bet-group">
                  <div class="n5-bet-group-title">龙虎和</div>
                  <el-checkbox-group
                    :model-value="
                      getN5SelectedValues(position.positionNum, 'dragon')
                    "
                    class="n5-checkbox-group"
                    @change="
                      vals => updateN5PositionNum(position, vals, 'dragon')
                    "
                  >
                    <el-checkbox label="龙" value="龙" border />
                    <el-checkbox label="虎" value="虎" border />
                    <el-checkbox label="和" value="和" border />
                  </el-checkbox-group>
                </div>

                <!-- 第一球 -->
                <div class="n5-bet-group">
                  <div class="n5-bet-group-title">第一球</div>
                  <el-checkbox-group
                    :model-value="
                      getN5SelectedValues(position.positionNum, 'ball1')
                    "
                    class="n5-checkbox-group"
                    @change="
                      vals => updateN5PositionNum(position, vals, 'ball1')
                    "
                  >
                    <el-checkbox label="第一球-大" value="第一球-大" border />
                    <el-checkbox label="第一球-小" value="第一球-小" border />
                    <el-checkbox label="第一球-单" value="第一球-单" border />
                    <el-checkbox label="第一球-双" value="第一球-双" border />
                  </el-checkbox-group>
                </div>

                <!-- 第二球 -->
                <div class="n5-bet-group">
                  <div class="n5-bet-group-title">第二球</div>
                  <el-checkbox-group
                    :model-value="
                      getN5SelectedValues(position.positionNum, 'ball2')
                    "
                    class="n5-checkbox-group"
                    @change="
                      vals => updateN5PositionNum(position, vals, 'ball2')
                    "
                  >
                    <el-checkbox label="第二球-大" value="第二球-大" border />
                    <el-checkbox label="第二球-小" value="第二球-小" border />
                    <el-checkbox label="第二球-单" value="第二球-单" border />
                    <el-checkbox label="第二球-双" value="第二球-双" border />
                  </el-checkbox-group>
                </div>

                <!-- 第三球 -->
                <div class="n5-bet-group">
                  <div class="n5-bet-group-title">第三球</div>
                  <el-checkbox-group
                    :model-value="
                      getN5SelectedValues(position.positionNum, 'ball3')
                    "
                    class="n5-checkbox-group"
                    @change="
                      vals => updateN5PositionNum(position, vals, 'ball3')
                    "
                  >
                    <el-checkbox label="第三球-大" value="第三球-大" border />
                    <el-checkbox label="第三球-小" value="第三球-小" border />
                    <el-checkbox label="第三球-单" value="第三球-单" border />
                    <el-checkbox label="第三球-双" value="第三球-双" border />
                  </el-checkbox-group>
                </div>
              </div>
            </el-form-item>
          </re-col>
        </template>

        <!-- 其他游戏种类的布局 -->
        <template v-else>
          <re-col :value="18">
            <el-form-item
              :label="'投注和值'"
              :prop="`positions.${index}.locationNum`"
            >
              <el-tooltip
                content="<span>投注号码说明</br>
                        主势盘和值0到27-多个和值可由英文逗号,分隔，例如:1,2,3</br>
                      </span>"
                effect="dark"
                placement="top"
                raw-content
              >
                <el-input
                  v-model="position.locationNum"
                  placeholder="请输入投注和值"
                  class="w-full"
                />
              </el-tooltip>
            </el-form-item>
          </re-col>
        </template>
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

<style lang="scss" scoped>
.n5-bet-type-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 12px;
  background-color: var(--el-fill-color-lighter);
  border-radius: 6px;
}

.n5-bet-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
  padding: 12px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--el-color-primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.n5-bet-group-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.n5-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  :deep(.el-checkbox) {
    margin: 0;
    margin-right: 0;

    .el-checkbox__label {
      padding-left: 8px;
      font-size: 13px;
    }
  }

  :deep(.el-checkbox.is-bordered) {
    padding: 8px 12px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }

    &.is-checked {
      border-color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }
  }
}
</style>
