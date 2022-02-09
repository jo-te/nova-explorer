import { DIR_ENDINGS_IMAGE_PAIRS } from "./config/dirEndingsImagePairs";
import { DIR_IMAGE, FILE_IMAGE } from "./config/fallbackImages";
import { FILE_ENDINGS_IMAGE_PAIRS } from "./config/fileEndingsImagePairs";
import { EndingsImagePair } from "./EndingsImagePair";
import { splitStringAtFirst } from "./utils/helpers";

const createEndingImageDict = (endingsImagePairs: EndingsImagePair[]) => {
  const result: { [key: string]: string } = {};

  endingsImagePairs.forEach((pair) => {
    pair.endings.forEach((ending) => {
      result[ending] = pair.image;
    });
  });

  return result;
};

const fileEndingImageDict = createEndingImageDict(FILE_ENDINGS_IMAGE_PAIRS);
const dirEndingImageDict = createEndingImageDict(DIR_ENDINGS_IMAGE_PAIRS);

const discoverEndingImage = (
  name: string,
  endingImageDict: ReturnType<typeof createEndingImageDict>,
  nameIsExtension = false,
  noExtensionFallbackImage?: string
): string | null => {
  const nameToLookup = nameIsExtension ? "." + name : name;
  const image = endingImageDict[nameToLookup];
  if (image !== undefined) {
    // Checking for undefined such that on a later development stage users can enable fallthrough (undefined) or completly deactivate (null) custom icon handling for specific file types
    return image;
  }
  const [, extension] = splitStringAtFirst(name, ".");
  if (extension && extension.length > 0) {
    return discoverEndingImage(extension, endingImageDict, true);
  } else if (!nameIsExtension && !extension && noExtensionFallbackImage) {
    return noExtensionFallbackImage;
  }
  return null;
};

export const resolveBasenameImage = (name: string, isDir = false) => {
  if (isDir) {
    return discoverEndingImage(name, dirEndingImageDict) || DIR_IMAGE;
  } else {
    // files starting with "." don't have proper default image handled by Nova
    // therefore we provide for these fallback image
    const fallbackImage = name.startsWith(".") ? FILE_IMAGE : null;
    return (
      discoverEndingImage(name, fileEndingImageDict, false, FILE_IMAGE) ||
      fallbackImage
    );
  }
};

export const resolvePathImage = (path: string, isDir = false) => {
  const basename = nova.path.basename(path);
  return resolveBasenameImage(basename, isDir);
};
