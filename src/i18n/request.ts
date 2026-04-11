import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
  const headersList = await headers();
  const locale = headersList.get("x-next-intl-locale") || "en";
  const pathname = headersList.get("x-pathname") || "/";

  let path = pathname === "/" ? "home" : pathname.replace(/^\//, "");
  path = path.replace(/\/$/, "");

  let common = {};
  try {
    common = (await import(`../locales/${locale}/common.json`)).default;
  } catch (e) {}

  let page = {};
  try {
    page = (await import(`../locales/${locale}/${path}/page.json`)).default;
  } catch (e) {}

  return {
    locale,
    messages: {
      ...common,
      ...page,
    },
  };
});
