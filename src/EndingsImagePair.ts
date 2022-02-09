export class EndingsImagePair {
  endings: string[];
  image: string;

  constructor(endings: string[], image: string) {
    this.endings = endings;
    this.image = image;
  }
}

export const create = (endingsOrEnding: string[] | string, image: string) => {
  const castedEndings =
    typeof endingsOrEnding === "string" ? [endingsOrEnding] : endingsOrEnding;
  return new EndingsImagePair(castedEndings, image);
};
