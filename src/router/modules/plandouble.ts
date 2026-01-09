import { $t } from "@/plugins/i18n";
import { configdouble } from "@/router/enums";

export default {
  path: "/plan-double",
  name: "ConfigPlanDouble",
  redirect: "/plan-double",
  meta: {
    icon: "ri:history-fill",
    title: $t("menus.pureConfigPlanDouble"),
    rank: configdouble
  },
  children: [
    {
      path: "/plan-double",
      name: "ConfigPlanDouble",
      component: () => import("@/views/config/plan-double/index.vue"),
      meta: {
        icon: "ri:git-branch-line",
        title: $t("menus.pureConfigPlanDouble"),
        roles: ["common", "admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
