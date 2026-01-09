<script setup lang="ts">
import { ref, reactive } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";

const roleOptions = [
  { value: "common", label: "普通" },
  { value: "agent", label: "代理" },
  { value: "admin", label: "管理员" }
];
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    users: [{ username: "", password: "", group: "", roles: [] }],
    groups: []
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

function addUser() {
  // 确保 users 数组已经初始化
  if (!newFormInline.value.users) {
    newFormInline.value.users = []; // 如果 users 是 undefined，初始化为空数组
  }

  // 添加一个新的用户输入项
  newFormInline.value.users.push({
    username: "",
    password: "",
    group: "",
    roles: []
  });
}
function removeUser(index: number) {
  // 删除指定的用户输入项，确保至少有一个表单项
  if (newFormInline.value.users.length > 1) {
    newFormInline.value.users.splice(index, 1);
  }
}
defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="formRules">
    <el-row :gutter="10">
      <!-- 遍历 users，给每个用户的表单项加上一个容器 -->
      <div
        v-for="(user, index) in newFormInline.users"
        :key="index"
        class="user-form-group"
      >
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="账号" prop="username">
              <el-input
                v-model="user.username"
                clearable
                placeholder="请输入账号"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="user.password"
                clearable
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="小组" prop="group">
              <el-select
                v-model="user.group"
                clearable
                placeholder="请选择小组"
                class="w-full"
              >
                <el-option
                  v-for="(item, index) in props.formInline.groups"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型" prop="roles">
              <el-select
                v-model="user.roles"
                clearable
                placeholder="请选择"
                class="w-full"
              >
                <el-option
                  v-for="(item, index) in roleOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 删除按钮仅在用户数量大于1时显示 -->
            <el-button
              v-if="newFormInline.users.length > 1"
              type="danger"
              @click="removeUser(index)"
            >
              删除账号
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 添加账号按钮 -->
      <el-col :span="24">
        <el-button type="primary" @click="addUser">添加账号</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>
