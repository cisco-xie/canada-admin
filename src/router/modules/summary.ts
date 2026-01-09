import { $t } from "@/plugins/i18n";
import { unsettled } from "@/router/enums";

export default {
  path: "/summary",
  name: "TodaySummary",
  redirect: "/collect",
  meta: {
    icon: "ant-design:dashboard-outlined",
    title: $t("menus.pureTodayCollect"),
    rank: unsettled
  },
  children: [
    {
      path: "/summary",
      name: "TodaySummary",
      component: () => import("@/views/summary/index.vue"),
      meta: {
        icon: "ant-design:dashboard-outlined",
        title: $t("menus.pureTodayCollect"),
        roles: ["common", "admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
