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
    name: "",
    positions: [],
    twoSidedDxPositions: [],
    twoSidedDsPositions: [],
    twoSidedLhPositions: [],
    enable: 1,
    positiveNum: 0,
    reverseNum: 0,
    positionsNum: 10,
    twoSidedDxNum: 10,
    twoSidedDsNum: 10,
    twoSidedLhNum: 5,
    positiveAccountNum: 0,
    positiveAmount: 0
  })
});

const lotteryOptions = [
  { value: "PK10JSC", label: "极速赛车" },
  { value: "LUCKYSB", label: "极速飞艇" }
  // { value: "11X5JSC", label: "极速11选5" },
  // { value: "KLSFJSC", label: "极速快乐十分" },
  // { value: "SSCJSC", label: "极速时时彩" }
  // { value: "HK6JSC", label: "极速六合彩" },
  // { value: "K3JSC", label: "极速快3" },
  // { value: "KL8JSC", label: "极速快乐8" },
  // { value: "PK10JSCNN", label: "极速牛牛" },
  // { value: "FTJSC", label: "极速番摊" }
];

const planTypeOptions = [
  { value: 1, label: "自定义" },
  { value: 2, label: "完全随机" },
  { value: 3, label: "指定位置数量随机" }
];

const positionOptions = [
  { value: "1", label: "第1名" },
  { value: "2", label: "第2名" },
  { value: "3", label: "第3名" },
  { value: "4", label: "第4名" },
  { value: "5", label: "第5名" },
  { value: "6", label: "第6名" },
  { value: "7", label: "第7名" },
  { value: "8", label: "第8名" },
  { value: "9", label: "第9名" },
  { value: "10", label: "第10名" }
];

const twoSidedPositionOptions = [
  { value: "DXD", label: "大" },
  { value: "DXX", label: "小" },
  { value: "DSD", label: "单" },
  { value: "DSS", label: "双" },
  { value: "LHL", label: "龙" },
  { value: "LHH", label: "虎" }
];

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);
const formRules = computed(() => getFormRules(newFormInline.value));

newFormInline.value.positions = newFormInline.value.positions.map(pos =>
  String(pos)
);
newFormInline.value.twoSidedDxPositions =
  newFormInline.value.twoSidedDxPositions.map(pos => String(pos));
newFormInline.value.twoSidedDsPositions =
  newFormInline.value.twoSidedDsPositions.map(pos => String(pos));
newFormInline.value.twoSidedLhPositions =
  newFormInline.value.twoSidedLhPositions.map(pos => String(pos));

// 监听 planType，当选择随机方案时，修改相应字段并禁用
watch(
  () => newFormInline.value.planType,
  newVal => {
    if (newVal === 2 || newVal === 3) {
      // 随机方案
      // 设置字段的值并禁用
      newFormInline.value.positions = positionOptions.map(item =>
        String(item.value)
      );
      newFormInline.value.twoSidedDxPositions = positionOptions.map(item =>
        String(item.value)
      ); // 大小
      newFormInline.value.twoSidedDsPositions = positionOptions.map(item =>
        String(item.value)
      ); // 单双
      newFormInline.value.twoSidedLhPositions = positionOptions
        .slice(0, 5)
        .map(item => String(item.value)); // 龙虎
    } else {
      // 自定义方案
      // 清空并恢复为可选
      newFormInline.value.positions = [];
      newFormInline.value.twoSidedDxPositions = [];
      newFormInline.value.twoSidedDsPositions = [];
      newFormInline.value.twoSidedLhPositions = [];
    }
  }
);

function getRef() {
  return ruleFormRef.value;
}

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
      <!-- 游戏 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="游戏种类" prop="lottery">
          <el-select
            v-model="newFormInline.lottery"
            placeholder="请选择游戏"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in lotteryOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <!-- 是否启用 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="是否启用" prop="enable">
          <el-switch
            v-model="newFormInline.enable"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>

      <!-- 方案类型 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="方案类型" prop="planType">
          <el-tooltip
            content="选择【完全随机】后，每一期下注后台都会自动在【单面】与【双面(大小单双龙虎)】中二选一,并且对应的位置和正反投数量都将完全随机投放"
            effect="dark"
            placement="top"
          >
            <el-select
              v-model="newFormInline.planType"
              placeholder="请选择类型"
              class="w-full"
              clearable
            >
              <el-option
                v-for="(item, index) in planTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-tooltip>
        </el-form-item>
      </re-col>

      <!-- 方案名称 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="方案名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入方案名称"
          />
        </el-form-item>
      </re-col>

      <!-- 单面-号码 -->
      <re-col :value="24">
        <el-form-item
          label="号码"
          prop="positions"
          :rules="formRules.atLeastOnePosition"
        >
          <el-input-number
            v-if="newFormInline.planType === 3"
            v-model="newFormInline.positionsNum"
            prop="positionsNum"
            :min="0"
            :max="10"
            placeholder=""
            class="w-full"
          />
          <el-checkbox-group
            v-model="newFormInline.positions"
            :disabled="
              newFormInline.planType === 2 || newFormInline.planType === 3
            "
          >
            <el-checkbox
              v-for="(item, index) in positionOptions"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </re-col>

      <!-- 双面-大小 -->
      <re-col :value="24">
        <el-form-item
          label="大小"
          prop="twoSidedDxPositions"
          :rules="formRules.atLeastOnePosition"
        >
          <el-input-number
            v-if="newFormInline.planType === 3"
            v-model="newFormInline.twoSidedDxNum"
            prop="twoSidedDxNum"
            :min="0"
            :max="10"
            placeholder=""
            class="w-full"
          />
          <el-checkbox-group
            v-model="newFormInline.twoSidedDxPositions"
            :disabled="
              newFormInline.planType === 2 || newFormInline.planType === 3
            "
          >
            <el-checkbox
              v-for="(item, index) in positionOptions"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </re-col>

      <!-- 双面-单双 -->
      <re-col :value="24">
        <el-form-item
          label="单双"
          prop="twoSidedDsPositions"
          :rules="formRules.atLeastOnePosition"
        >
          <el-input-number
            v-if="newFormInline.planType === 3"
            v-model="newFormInline.twoSidedDsNum"
            prop="twoSidedDsNum"
            :min="0"
            :max="10"
            placeholder=""
            class="w-full"
          />
          <el-checkbox-group
            v-model="newFormInline.twoSidedDsPositions"
            :disabled="
              newFormInline.planType === 2 || newFormInline.planType === 3
            "
          >
            <el-checkbox
              v-for="(item, index) in positionOptions"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </re-col>

      <!-- 双面-龙虎 -->
      <re-col :value="24">
        <el-form-item
          label="龙虎"
          prop="twoSidedLhPositions"
          :rules="formRules.atLeastOnePosition"
        >
          <el-input-number
            v-if="newFormInline.planType === 3"
            v-model="newFormInline.twoSidedLhNum"
            prop="twoSidedLhNum"
            :min="0"
            :max="5"
            placeholder=""
            class="w-full"
          />
          <el-checkbox-group
            v-model="newFormInline.twoSidedLhPositions"
            :disabled="
              newFormInline.planType === 2 || newFormInline.planType === 3
            "
          >
            <el-checkbox
              v-for="(item, index) in positionOptions.slice(0, 5)"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </re-col>

      <!-- 正投数量 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="正投数量" prop="positiveNum">
          <el-input-number
            v-model="newFormInline.positiveNum"
            :min="1"
            :max="9"
            placeholder="请输入正投数量"
            class="w-full"
            :disabled="
              newFormInline.planType === 2 || newFormInline.planType === 3
            "
          />
        </el-form-item>
      </re-col>

      <!-- 反投数量 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="反投数量" prop="reverseNum">
          <el-input-number
            v-model="newFormInline.reverseNum"
            :min="0"
            placeholder="请输入反投数量"
            class="w-full"
            disabled
          />
        </el-form-item>
      </re-col>

      <!-- 正投金额 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="正投金额" prop="positiveAmount">
          <el-input-number
            v-model="newFormInline.positiveAmount"
            :min="1"
            :step="1"
            placeholder="请输入正投金额"
            class="w-full"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="正投账号数量" prop="positiveAccountNum">
          <el-input-number
            v-model="newFormInline.positiveAccountNum"
            :min="1"
            placeholder="正投账号数量"
            class="w-full"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
