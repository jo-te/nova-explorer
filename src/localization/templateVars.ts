export const createTemplate = <T extends string>(varName: T): `{${T}}` =>
  `{${varName}}`;

export const TEMPLATE_VARS = {
  FILE_OR_DIR_NAME: createTemplate("fileOrDirName"),
  VALUE: createTemplate("value"),
} as const;
