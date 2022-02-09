import { L10N_DICT } from "./l10nDict";
import { TEMPLATE_VARS } from "./templateVars";

export const localize = <L10nKey extends keyof typeof L10N_DICT>(
  key: L10nKey,
  templateVarKeyValueDict?: {
    [key in typeof L10N_DICT[L10nKey]["usedVars"][number]]: string;
  },
  tableName?: string
) => {
  const templateVarDict: { [templateVar: string]: string } = {};
  let isTemplateVarDictEmpty = true;
  if (templateVarKeyValueDict) {
    L10N_DICT[key].usedVars.forEach((item) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const providedValue = (templateVarKeyValueDict as any)[item];
      if (providedValue) {
        isTemplateVarDictEmpty = false;
        templateVarDict[TEMPLATE_VARS[item]] = providedValue;
      }
    });
  }
  return _localize(
    key,
    L10N_DICT[key].value,
    isTemplateVarDictEmpty ? undefined : templateVarDict,
    tableName
  );
};

export const _localize = (
  key: string,
  value: string,
  templateVarDict?: { [templateVar: string]: string },
  tableName?: string
) => {
  const rawLocalizedValue = nova.localize(key, value, tableName);
  let result = rawLocalizedValue;
  if (templateVarDict) {
    // We match "{\w+}", but also with escape character "\\{\w+}"
    // Only after matching we check for potential escape character which prevents replacement
    // We do this because of missing availability of negative lookbehind
    const templateRegex = /(\\*)({\w+})/g;
    result = rawLocalizedValue.replace(
      templateRegex,
      (match, escapeChars, templateVar) => {
        let newValue = match;
        if (escapeChars.length % 2 === 0) {
          // No escape char exists or escape char is also escaped
          const varValue = templateVarDict[templateVar];
          if (varValue) {
            newValue = escapeChars + varValue;
          }
        }
        return newValue;
      }
    );
  }
  const usedEscapeCharsCleanupRegex = /\\{2}|\\{/g;
  // Cleanup escape character by deleting every used escape character ("\")
  return result.replace(usedEscapeCharsCleanupRegex, (match) =>
    match.substring(1)
  );
};
