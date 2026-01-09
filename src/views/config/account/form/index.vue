<script setup lang="ts">
import { ref, reactive } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "../../hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    title: "新增",
    baseUrl: "",
    account: "",
    password: "",
    betType: 1,
    proxyType: null, // 默认值为空
    proxyHost: "",
    proxyPort: null,
    proxyUsername: "",
    proxyPassword: "",
    closeTime: 0
  })
});

const betTypeOptions = [
  { value: 1, label: "正投" },
  { value: 2, label: "反投" }
];

const proxyTypeOptions = [
  { value: 0, label: "不代理" },
  { value: 1, label: "HTTP" },
  { value: 2, label: "SOCKS" }
];

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

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
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="盘口地址" prop="baseUrl">
          <el-input
            v-model="newFormInline.baseUrl"
            clearable
            placeholder="请输入盘口地址"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="newFormInline.account"
            clearable
            placeholder="请输入账号"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="newFormInline.password"
            clearable
            placeholder="请输入密码"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="投注类型" prop="betType">
          <el-select
            v-model="newFormInline.betType"
            clearable
            placeholder="请选择投注类型"
            class="w-full"
          >
            <el-option
              v-for="(item, index) in betTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="代理类型" prop="proxyType">
          <el-select
            v-model="newFormInline.proxyType"
            clearable
            placeholder="请选择代理类型"
            class="w-full"
          >
            <el-option
              v-for="(item, index) in proxyTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="代理IP" prop="proxyHost">
          <el-input
            v-model="newFormInline.proxyHost"
            clearable
            placeholder="请输入代理IP"
            :disabled="newFormInline.proxyType === 0"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="代理端口" prop="proxyPort">
          <el-input
            v-model="newFormInline.proxyPort"
            type="number"
            clearable
            placeholder="请输入代理端口"
            :disabled="newFormInline.proxyType === 0"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="代理认证账号" prop="proxyUsername">
          <el-input
            v-model="newFormInline.proxyUsername"
            clearable
            placeholder="请输入代理认证账号"
            :disabled="newFormInline.proxyType === 0"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="代理认证密码" prop="proxyPassword">
          <el-input
            v-model="newFormInline.proxyPassword"
            clearable
            placeholder="请输入代理认证密码"
            :disabled="newFormInline.proxyType === 0"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="距离封盘" prop="closeTime">
          <el-input-number
            v-model="newFormInline.closeTime"
            :min="10"
            :max="50"
            :step="10"
            placeholder="秒"
            class="w-full"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
