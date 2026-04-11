import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

export default getRequestConfig(async () => {
  const headersList = await headers();

  let locale = headersList.get("x-next-intl-locale");
  if (!locale) {
    const acceptLang = headersList.get("accept-language") || "en";
    locale = acceptLang.startsWith("fr") ? "fr" : "en";
  }

  const pathname = headersList.get("x-pathname") || "/";
  const routePath =
    pathname === "/" ? "home" : pathname.replace(/^\//, "").replace(/\/$/, "");

  const localesDir = path.join(process.cwd(), "src", "locales", locale);

  const allMessages: any = {};

  const deepMerge = (target: any, source: any) => {
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  };

  const loadAndWrap = (filePath: string, relativePath: string) => {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const json = JSON.parse(content);

      if (relativePath === "common.json") {
        deepMerge(allMessages, json);
        return;
      }

      if (relativePath.endsWith("page.json")) {
        const parts = relativePath.split("/");
        parts.pop();
        const pathKey = parts.join("/");

        if (pathKey) {
          const wrapped: any = {};
          let current = wrapped;
          const routeParts = pathKey.split("/");
          for (let i = 0; i < routeParts.length; i++) {
            const part = routeParts[i];
            if (i === routeParts.length - 1) {
              current[part] = json;
            } else {
              current[part] = {};
              current = current[part];
            }
          }
          deepMerge(allMessages, wrapped);

          if (
            pathKey === routePath ||
            (pathKey === "home" && routePath === "home")
          ) {
            deepMerge(allMessages, json);
          }
        } else {
          deepMerge(allMessages, json);
        }
      }
    } catch (e) {
      console.error(`[i18n] Failed to load ${filePath}:`, e);
    }
  };

  const scan = (dir: string, base: string = "") => {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relPath = base ? `${base}/${item}` : item;
      if (fs.statSync(fullPath).isDirectory()) {
        scan(fullPath, relPath);
      } else if (item.endsWith(".json")) {
        loadAndWrap(fullPath, relPath);
      }
    }
  };

  scan(localesDir);

  return {
    locale,
    messages: allMessages,
  };
});
