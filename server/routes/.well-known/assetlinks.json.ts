import { defineEventHandler, setResponseHeaders } from "h3";

export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    "content-type": "application/json",
  });

  return [
    {
      relation: [
        "delegate_permission/common.handle_all_urls",
        "delegate_permission/common.get_login_creds",
      ],
      target: {
        namespace: "android_app",
        package_name: "br.com.hemocione.app",
        sha256_cert_fingerprints: [
          "14:05:77:CA:7C:70:36:FA:58:45:05:80:7D:C7:87:AC:C7:C4:49:B3:CB:79:C6:BC:56:6E:97:42:9D:D1:2C:4D",
          "5D:9A:87:BF:EE:BF:D5:CF:71:CA:F8:3F:52:34:12:7C:68:53:AA:7A:E7:07:24:33:CD:9C:24:BF:0D:34:8B:D4",
        ],
      },
    },
  ];
});
