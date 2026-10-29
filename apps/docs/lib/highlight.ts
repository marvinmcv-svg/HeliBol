import { codeToHtml } from "shiki";

export async function highlight(code: string, lang = "tsx") {
  return codeToHtml(code.trim(), {
    lang,
    themes: { light: "github-light", dark: "github-dark-default" },
    defaultColor: "light",
  });
}
