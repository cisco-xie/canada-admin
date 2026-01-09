import { defineStore } from "pinia";
import { message } from "@/utils/message";
import { getAccountList, getAccountToken } from "@/api/config";

export const useAccountStore = defineStore("account", {
  state: () => ({
    accountList: [] as Array<{ account: string; isTokenValid: number }> // 定义类型
  }),
  actions: {
    async refreshAccountStatus() {
      try {
        const { data } = await getAccountList();
        if (data) {
          const promises = data.map(async (item: { id: string }) => {
            let isTokenValid = 0;
            try {
              // 判断 token 是否有效
              const response = await getAccountToken(item.id);
              isTokenValid = response.data ? 1 : 0;
              console.log(`获取账号 ${item.id} token=`, response.data);
              if (!response.success) {
                message("自动登录失败，" + response.msg, {
                  customClass: "el",
                  type: "error"
                });
              }
            } catch (error) {
              console.error(`获取账号id ${item.id} 状态失败`, error);
            }
            return { ...item, isTokenValid }; // 创建新的对象并添加属性
          });
          // 等待所有请求完成
          this.accountList = await Promise.all(promises); // 更新状态
        }
      } catch (error) {
        console.error("获取账号列表失败", error);
      }
    }
  }
});
