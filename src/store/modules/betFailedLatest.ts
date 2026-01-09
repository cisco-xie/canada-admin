import { defineStore } from "pinia";
import { ElMessageBox } from "element-plus";
import { getFailedBetLatest, confirm } from "@/api/settled";
import { router } from "../utils";

// 提示音文件路径，可以是本地的或远程的音频文件
const { VITE_PUBLIC_PATH } = import.meta.env;
const alertSound = `${VITE_PUBLIC_PATH}audio/叮叮音效.mp3`;

export const useBetFailedLatestStore = defineStore("betFailed", {
  state: () => ({
    isMessageBoxVisible: false, // 控制是否显示弹窗
    lastKey: null, // 存储上一次弹窗显示的数据的 key
    originalTitle: document.title, // 存储原始标题
    audio: new Audio(alertSound) // 创建音频对象
  }),

  actions: {
    async refreshBetFailedLatest() {
      try {
        // 获取失败投注最新信息
        const response = await getFailedBetLatest();
        if (response && response.success && response.data) {
          // 解析 data 字段的字符串为 JSON 对象
          const parsedData = JSON.parse(response.data);
          const value = parsedData;
          console.log(parsedData);
          if (value && Object.keys(value).length > 0) {
            // 如果弹窗已经显示，则不再弹出
            if (this.isMessageBoxVisible || this.lastKey === value?.key) {
              return; // 直接返回，不做任何操作
            }

            // 弹出新弹窗
            await this.handleMessageBox(value);
          }
        }
      } catch (error) {
        console.error("获取失败投注最新信息", error);
      }
    },

    // 处理 ElMessageBox 确认框
    async handleMessageBox(value: any) {
      try {
        // 设置弹窗显示状态为 true
        this.isMessageBoxVisible = true;

        // 更新 lastKey 为当前弹窗的 key，防止重复弹窗
        this.lastKey = value?.key;

        // 改变标题栏为闪烁提示
        this.startTitleBlink();

        // 播放提示音
        this.playAlertSound();

        // 弹出确认框
        await ElMessageBox.confirm(
          `账号[${value.value?.account}]期数[${value.value?.drawNumber}]投注失败，原因：${value.value?.message}，是否进入【失败投注】页面查看详情？`,
          "投注失败",
          {
            confirmButtonText: "进入页面",
            cancelButtonText: "确认",
            type: "error",
            closeOnClickModal: false
          }
        );

        // 用户点击确认按钮时，跳转到失败投注页面，并执行 confirm 请求
        await confirm({ key: value?.key });
        router.push("/failed");
      } catch (error) {
        // 用户点击取消按钮时，执行确认请求
        console.log("用户取消了查看失败投注");
        if (this.isMessageBoxVisible) {
          await confirm({ key: value?.key });
        }
      } finally {
        // 清除弹窗状态，允许下一次弹窗显示
        this.isMessageBoxVisible = false;
        // 恢复标题栏
        this.restoreOriginalTitle();
        // 停止提示音
        this.stopAlertSound();
      }
    },

    // 改变标签栏标题，闪烁提示
    startTitleBlink() {
      let blinkCount = 0;
      const interval = setInterval(() => {
        document.title =
          blinkCount % 2 === 0
            ? "❗❗❗投注失败 - 请查看" // 提示的闪烁标题
            : this.originalTitle; // 恢复原始标题

        blinkCount++;

        // 停止闪烁，一旦用户处理完弹窗
        if (blinkCount >= 30) {
          clearInterval(interval);
        }
      }, 1000); // 每秒钟闪烁一次
    },

    // 播放提示音
    playAlertSound() {
      this.audio.loop = true; // 设置音频循环播放
      this.audio.play().catch(error => {
        console.error("提示音播放失败", error);
      });
    },

    // 停止提示音
    stopAlertSound() {
      this.audio.pause();
      this.audio.currentTime = 0; // 重置音频播放位置
    },

    // 恢复原始标题
    restoreOriginalTitle() {
      document.title = this.originalTitle;
    }
  }
});
