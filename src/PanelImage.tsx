// Have to be stored in src folder otherwise it gets "Cannot find module..." error

import { RaceObj } from "./race-types";

export type ImageProps = {
  attribute: RaceObj["country"] | RaceObj["city"];
  type: "flag" | "circuit";
  customUrl?: string;
};

function PanelImage({ attribute, type, customUrl = "" }: ImageProps) {
  const imgSrcGenerator = (
    imageAttribute: ImageProps["attribute"],
    imageType: ImageProps["type"]
  ): string => {
    const formattedAttr = imageAttribute.replaceAll(" ", "").toLowerCase();
    const fileExt = imageType === "flag" ? "png" : "jpg";
    const imgPath = `./images/${imageType}s/${formattedAttr}-${imageType}.${fileExt}`;
    return imgPath;
  };

  const typeCase = (): string =>
    type[0].toUpperCase() + type.slice(1).toLowerCase();

  return (
    <img
      src={
        customUrl ? customUrl : require(`${imgSrcGenerator(attribute, type)}`)
      }
      alt={`${attribute} ${typeCase()}`}
      className="object-cover rounded-lg"
    />
  );
}

export default PanelImage;
