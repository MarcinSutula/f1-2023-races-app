import PanelTitle, { PanelTitleProps } from "../components/PanelTitle";
import { ComponentMeta } from "@storybook/react";
import PanelCard from "../components/PanelCard";

type PanelTitleStory = PanelTitleProps & {
  backgroundColor: string;
};

const bgColor = "#100636";

export default {
  title: "Race Details Panel/Panel Title",
  component: PanelTitle,
  argTypes: {
    backgroundColor: {
      control: {
        type: "color",
      },
    },
  },
} as ComponentMeta<typeof PanelTitle>;

const Template = ({ backgroundColor, ...args }: PanelTitleStory) => {
  return (
    <PanelCard backgroundColor={backgroundColor}>
      <PanelTitle {...args} />
    </PanelCard>
  );
};

export const CircuitName = Template.bind({}) as any;
CircuitName.args = {
  title: "Circuit de Barcelona-Catalunya",
  backgroundColor: bgColor,
};
