import { $t } from "@/plugins/i18n";
import { accounts } from "@/router/enums";

export default {
  path: "/account",
  name: "ConfigAccount",
  redirect: "/account",
  meta: {
    icon: "ri:user-3-line",
    title: $t("menus.pureConfigAccount"),
    rank: accounts
  },
  children: [
    {
      path: "/account",
      name: "ConfigAccount",
      component: () => import("@/views/config/account/index.vue"),
      meta: {
        icon: "ri:user-3-line",
        title: $t("menus.pureConfigAccount")
      }
    }
  ]
} satisfies RouteConfigsTable;
