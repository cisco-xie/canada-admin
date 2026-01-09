import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  // 账号管理
  {
    url: "/account",
    method: "post",
    response: ({}) => {
      let list = [
        {
          account: "aaa",
          password: "123"
        },
        {
          account: "bbb",
          password: "123"
        }
      ];
      return {
        success: true,
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  }
]);
