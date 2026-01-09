import { $t } from "@/plugins/i18n";
import { adminuser } from "@/router/enums";

export default {
  path: "/user",
  name: "AdminUser",
  redirect: "/user",
  meta: {
    icon: "ri:user-3-line",
    title: $t("menus.pureAdminUser"),
    rank: adminuser
  },
  children: [
    {
      path: "/user",
      name: "AdminUser",
      component: () => import("@/views/users/index.vue"),
      meta: {
        icon: "ri:user-3-line",
        title: $t("menus.pureAdminUser"),
        roles: ["admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
