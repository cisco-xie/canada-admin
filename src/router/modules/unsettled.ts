import { $t } from "@/plugins/i18n";
import { unsettled } from "@/router/enums";

export default {
  path: "/unsettled",
  name: "Unsettled",
  redirect: "/unsettled",
  meta: {
    icon: "ri:history-fill",
    title: $t("menus.pureUnSettled"),
    rank: unsettled
  },
  children: [
    {
      path: "/unsettled",
      name: "Unsettled",
      component: () => import("@/views/unsettled/index.vue"),
      meta: {
        icon: "ri:history-fill",
        title: $t("menus.pureUnSettled"),
        roles: ["common", "admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
