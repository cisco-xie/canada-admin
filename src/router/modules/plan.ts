import { $t } from "@/plugins/i18n";
import { config } from "@/router/enums";

export default {
  path: "/plan",
  name: "ConfigPlan",
  redirect: "/plan",
  meta: {
    icon: "ri:history-fill",
    title: $t("menus.pureConfigPlan"),
    rank: config
  },
  children: [
    {
      path: "/plan",
      name: "ConfigPlan",
      component: () => import("@/views/config/plan/index.vue"),
      meta: {
        icon: "ri:git-branch-line",
        title: $t("menus.pureConfigPlan"),
        roles: ["common", "admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
