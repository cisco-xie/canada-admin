<script setup lang="ts">
import { ref, watch, computed } from "vue";
import ReCol from "@/components/ReCol";
import { getFormRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "../../hooks";
import PlanType001 from "../playtype/planType001.vue";
import PlanType002 from "../playtype/planType002.vue";
import PlanType003 from "../playtype/planType003.vue";
import PlanType005 from "../playtype/planType005.vue";
import PlanType017 from "../playtype/planType017.vue";
import PlanType025 from "../playtype/planType025.vue";

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
      winLocationNum: 0,
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

const lotteryOptions = [
  { value: "all", label: "主势盘" },
  { value: "OPN", label: "单球1-3" },
  { value: "TPD", label: "二字定位" },
  { value: "DW3", label: "三字定位" },
  { value: "n5", label: "两面盘" }
];

const planTypeOptions = [
  { value: 1, label: "001 - 号码投注" },
  { value: 2, label: "002 - 位置开号投注" },
  // { value: 3, label: "003 - 灵活开某投某" }, // 此方案翻倍不对，暂不使用
  { value: 5, label: "005 - 号码追踪" },
  { value: 17, label: "017 - 冷热号投注" },
  { value: 25, label: "025 - 开某投某" }
];

const doubleTypeOptions = [
  { value: 1, label: "翻倍老号" },
  { value: 2, label: "翻倍新号" },
  { value: 3, label: "翻老投新" }
];
const settleTypeOptions = [
  { value: 1, label: "不中翻倍" },
  { value: 2, label: "中翻倍" }
];

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

// 根据选择的方案类型返回对应的组件
const planComponent = computed(() => {
  switch (newFormInline.value.planType) {
    case 1:
      return PlanType001;
    case 2:
      return PlanType002;
    case 3:
      return PlanType003;
    case 5:
      return PlanType005;
    case 17:
      return PlanType017;
    case 25:
      return PlanType025;
    default:
      return PlanType001; // 默认返回某个方案组件
  }
});

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

      <!-- 翻倍方式 -->
      <re-col :value="12">
        <el-form-item label="翻倍方式" prop="doubleType">
          <el-tooltip
            content="<span>翻倍方式说明</br>
                      翻倍老号:倍投老号直到中或者计划金额的轮数结束</br>
                      翻倍新号:倍投的过程中将一直采取新的号码,直到中或者计划金额的轮数结束</br>
                      翻老投新:在翻倍老号的基础上,开启新一条新线进行下单</span>"
            effect="dark"
            placement="top"
            raw-content
          >
            <el-select
              v-model="newFormInline.doubleType"
              placeholder="请选择类型"
              class="w-full"
              clearable
            >
              <el-option
                v-for="(item, index) in doubleTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-tooltip>
        </el-form-item>
      </re-col>

      <!-- 结算模式 -->
      <re-col :value="12">
        <el-form-item label="结算模式" prop="settleType">
          <el-tooltip
            content="<span>结算模式说明</br>
                      不中翻倍:计划在号码【不中】的情兄下,才进行计划金额翻倍</br>
                      中翻倍:计划在号码【中】的情况下,才进行计划金颔翻倍</span>"
            effect="dark"
            placement="top"
            raw-content
          >
            <el-select
              v-model="newFormInline.settleType"
              placeholder="请选择类型"
              class="w-full"
              clearable
            >
              <el-option
                v-for="(item, index) in settleTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-tooltip>
        </el-form-item>
      </re-col>

      <!-- 监控期数 -->
      <re-col :value="12">
        <el-form-item label="监控期数" prop="monitorNum">
          <el-tooltip
            content="<span>监控期数说明</br>
                      需要翻倍几期就填入数字几,</br>
                      填5则表示翻倍5期</span>"
            effect="dark"
            placement="top"
            raw-content
          >
            <el-input-number
              v-model="newFormInline.monitorNum"
              :min="1"
              placeholder="请输入监控期数"
              class="w-full"
            />
          </el-tooltip>
        </el-form-item>
      </re-col>

      <!-- 根据选择的方案类型加载不同的页面 -->
      <component :is="planComponent" :formInline="newFormInline" />

      <!-- 投注金额 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="投注计划金额" prop="positiveAmount">
          <el-tooltip
            content="<span>投注计划金额说明</br>
                      要进行多少轮计划就填多少个金额,金额之间由英文逗号,分隔</br>
                      例如:1,2,3,4,5表示进行5轮计划金额下单,第1轮1元,第2轮2元..以此类推</span>"
            effect="dark"
            placement="top"
            raw-content
          >
            <el-input
              v-model="newFormInline.positiveAmount"
              placeholder="请输入计划金额"
              class="w-full"
            />
          </el-tooltip>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="投注账号数量" prop="positiveAccountNum">
          <el-input-number
            v-model="newFormInline.positiveAccountNum"
            :min="1"
            placeholder="投注账号数量"
            class="w-full"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
