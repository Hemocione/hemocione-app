import { defineEventHandler, setResponseHeaders } from "h3";

export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    "content-type": "application/json",
  });

  return {
    applinks: {
      apps: [],
      details: [
        {
          appID: "JGY96PPKZK.br.com.hemocione.app",
          paths: ["*"],
        },
      ],
    },
  };
});
