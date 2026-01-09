<script setup lang="ts">
import { ref } from "vue";

const formRef = ref();

const formInline = ref({
  securityCode: ""
});

const rules = {
  securityCode: [
    { required: true, message: "请输入安全码加密串", trigger: "blur" }
  ]
};

function getRef() {
  return formRef.value;
}

defineExpose({ getRef, formInline });
</script>

<template>
  <el-form ref="formRef" :model="formInline" :rules="rules" label-width="120px">
    <el-form-item label="安全码加密串" prop="securityCode">
      <el-input
        v-model="formInline.securityCode"
        clearable
        placeholder="请输入安全码加密串"
      />
    </el-form-item>
  </el-form>
</template>
