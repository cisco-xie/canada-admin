import { $t } from "@/plugins/i18n";
import { agent } from "@/router/enums";

export default {
  path: "/agent",
  name: "Agent",
  redirect: "/agent",
  meta: {
    icon: "ri:user-3-line",
    title: $t("menus.pureAgent"),
    rank: agent
  },
  children: [
    {
      path: "/agent",
      name: "Agent",
      component: () => import("@/views/agent/index.vue"),
      meta: {
        icon: "ri:user-3-line",
        title: $t("menus.pureAgent"),
        roles: ["agent"]
      }
    }
  ]
} satisfies RouteConfigsTable;
