import { $t } from "@/plugins/i18n";
import { home } from "@/router/enums";
const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  // path: "/",
  // name: "HistoryPage",
  // component: Layout,
  // redirect: "/history",
  // meta: {
  //   icon: "ri:history-fill",
  //   title: $t("menus.pureHistory"),
  //   rank: home
  // },
  // children: [
  //   {
  //     path: "/history",
  //     name: "HistoryPage",
  //     component: () => import("@/views/history/index.vue"),
  //     meta: {
  //       title: $t("menus.pureHistory"),
  //       showLink: true
  //     }
  //   }
  // ]
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "ep:home-filled",
    title: $t("menus.pureHome"),
    rank: home
  },
  children: [
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: $t("menus.pureHome"),
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} satisfies RouteConfigsTable;
