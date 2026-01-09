import { $t } from "@/plugins/i18n";
import { history } from "@/router/enums";

export default {
  path: "/history",
  name: "History",
  redirect: "/history",
  meta: {
    icon: "ri:history-fill",
    title: $t("menus.pureWeekHistory"),
    rank: history
  },
  children: [
    {
      path: "/history",
      name: "History",
      component: () => import("@/views/history/index.vue"),
      meta: {
        icon: "ri:history-fill",
        title: $t("menus.pureWeekHistory"),
        roles: ["common", "admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
