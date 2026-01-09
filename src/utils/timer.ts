// src/utils/timer.ts

import { ref } from "vue";

const timer = ref(null);

export const startGlobalTask = (callback: () => void, interval: number) => {
  stopGlobalTask();
  timer.value = window.setInterval(callback, interval);
};

export const stopGlobalTask = () => {
  if (timer.value) {
    clearInterval(timer.value);
  }
};
