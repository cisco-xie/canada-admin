import { $t } from "@/plugins/i18n";
import { failed } from "@/router/enums";

export default {
  path: "/failed",
  name: "BetFailed",
  redirect: "/failed",
  meta: {
    icon: "ant-design:alert-filled",
    title: $t("menus.pureBetFailed"),
    rank: failed
  },
  children: [
    {
      path: "/failed",
      name: "BetFailed",
      component: () => import("@/views/bet-failed/index.vue"),
      meta: {
        icon: "ant-design:alert-filled",
        title: $t("menus.pureBetFailed"),
        roles: ["common", "admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
