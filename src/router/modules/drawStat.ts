import { config } from "@/router/enums";

export default {
  path: "/stat",
  name: "ConfigDrawStat",
  redirect: "/stat",
  meta: {
    icon: "ri:bar-chart-2-line",
    title: "menus.pureDrawStat",
    rank: config
  },
  children: [
    {
      path: "/stat/index",
      name: "ConfigDrawStat",
      component: () => import("@/views/draw-stat/index.vue"),
      meta: {
        icon: "ri:bar-chart-2-line",
        title: "menus.pureDrawStat",
        roles: ["admin", "common"]
      }
    }
  ]
} satisfies RouteConfigsTable;
