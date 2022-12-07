import PanelImage, { ImageProps } from "../PanelImage";
import PanelCard from "../components/PanelCard";
import { ComponentMeta } from "@storybook/react";

type PanelImageStory = ImageProps & {
  backgroundColor: string;
};

const bgColor = "#100636";

export default {
  title: "Race Details Panel/Panel Image",
  component: PanelImage,
  argTypes: {
    backgroundColor: {
      control: {
        type: "color",
      },
    },
    type: {
      control: false,
    },
    attribute: {
      control: false,
    },
  },
} as ComponentMeta<typeof PanelImage>;

const Template = ({ backgroundColor, ...args }: PanelImageStory) => (
  <PanelCard backgroundColor={backgroundColor}>
    {args.type === "circuit" ? (
      <div className="w-5/6 h-36 m-auto">
        <PanelImage {...args} />
      </div>
    ) : (
      <div className="flex h-8 justify-between mx-7">
        <PanelImage {...args} />
      </div>
    )}
  </PanelCard>
);

export const Flag = Template.bind({}) as any;
Flag.args = {
  attribute: "Netherlands",
  type: "flag",
  backgroundColor: bgColor,
};

export const Circuit = Template.bind({}) as any;
Circuit.args = {
  attribute: "Zandvoort",
  type: "circuit",
  backgroundColor: bgColor,
};
