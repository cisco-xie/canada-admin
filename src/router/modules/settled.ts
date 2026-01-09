import { $t } from "@/plugins/i18n";
import { settled } from "@/router/enums";

export default {
  path: "/settled",
  name: "Settled",
  redirect: "/settled",
  meta: {
    icon: "ri:history-fill",
    title: $t("menus.pureSettled"),
    rank: settled
  },
  children: [
    {
      path: "/settled",
      name: "Settled",
      component: () => import("@/views/settled/index.vue"),
      meta: {
        icon: "ri:history-fill",
        title: $t("menus.pureSettled"),
        roles: ["common", "admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
