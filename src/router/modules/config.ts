import { config } from "@/router/enums";

export default {
  path: "/config",
  meta: {
    icon: "ri:settings-3-line",
    title: "menus.pureConfigManagement",
    rank: config
  },
  children: [
    {
      path: "/config/account/index",
      name: "ConfigAccount",
      component: () => import("@/views/config/account/index.vue"),
      meta: {
        icon: "ri:admin-line",
        title: "menus.pureConfigAccount",
        roles: ["admin"]
      }
    },
    {
      path: "/config/plan/index",
      name: "ConfigDept",
      component: () => import("@/views/config/plan/index.vue"),
      meta: {
        icon: "ri:git-branch-line",
        title: "menus.pureConfigPlan",
        roles: ["admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
