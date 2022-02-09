import { writeFile } from "fs";
import { join, relative } from "path";
import { EndingsImagePair } from "../../src/EndingsImagePair";
import { FILE_ENDINGS_IMAGE_PAIRS } from "../../src/config/fileEndingsImagePairs";
import { DIR_ENDINGS_IMAGE_PAIRS } from "../../src/config/dirEndingsImagePairs";

const IMAGES_DIR = join(__dirname, "../../Explorer.novaextension/Images");

const TARGET_DIR = join(__dirname, "../../Explorer.novaextension/Docs");
const FILE_NAME = "endings-icon-references.md";

const FILE_IS_GENERATED_PROGRAMMATICALLY_NOTE = `<!--
  This file is generated programmatically. Manual changes to this file will be overwritten by next file generation.
-->`;
const HEADING = "# Endings icon reference";
const DESCRIPTION = `See both tables below to see current available file and folder icons and its assigned file endings and folder names.`;

const generateEndingsTableRow = (endingsImagePairs: EndingsImagePair[]) => {
  return endingsImagePairs.map((pair) => {
    return [
      pair.endings.map((ending) => `\`${ending}\``).join(", "),
      `![File icon](${relative(TARGET_DIR, IMAGES_DIR)}/${pair.image}/${
        pair.image
      }@2x.png)`,
    ];
  });
};

const FILE_ENDINGS_SUBHEADING = "## File icons";
const FILE_ENDINGS_HEADING_ROW = ["File ending(s)", "Icon image"];
const fileEndingsTableRows = generateEndingsTableRow(FILE_ENDINGS_IMAGE_PAIRS);

const DIR_ENDINGS_SUBHEADING = "## Folder icons";
const DIR_ENDINGS_HEADING_ROW = ["Folder name(s)", "Icon image"];
const dirEndingsTableRows = generateEndingsTableRow(DIR_ENDINGS_IMAGE_PAIRS);

const fileContent = `
${FILE_IS_GENERATED_PROGRAMMATICALLY_NOTE}

${HEADING}
${DESCRIPTION}

${FILE_ENDINGS_SUBHEADING}
${FILE_ENDINGS_HEADING_ROW.join(" | ")}
${FILE_ENDINGS_HEADING_ROW.map(() => "---").join("|")}
${fileEndingsTableRows.map((row) => row.join(" | ")).join("\n")}

${DIR_ENDINGS_SUBHEADING}
${DIR_ENDINGS_HEADING_ROW.join(" | ")}
${DIR_ENDINGS_HEADING_ROW.map(() => "---").join("|")}
${dirEndingsTableRows.map((row) => row.join(" | ")).join("\n")}
`;

writeFile(join(TARGET_DIR, FILE_NAME), fileContent, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  // File was written successfully
});
