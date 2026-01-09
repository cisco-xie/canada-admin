<script setup lang="ts">
import { ref, reactive } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormGroupProps } from "../utils/types";

const props = withDefaults(defineProps<FormGroupProps>(), {
  formInline: () => ({
    title: "新增",
    group: ""
  })
});

const ruleFormRef = ref();
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
      <re-col :value="30" :xs="24" :sm="24">
        <el-form-item label="小组" prop="group">
          <el-input
            v-model="newFormInline.group"
            clearable
            placeholder="请输入小组名"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
