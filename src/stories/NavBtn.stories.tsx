import NavBtn, { NavBtnProps } from "../components/NavBtn";
import { ComponentMeta } from "@storybook/react";
import PanelCard from "../components/PanelCard";

type NavBtnStory = NavBtnProps & {
  backgroundColor: string;
};

const bgColor = "#100636";

export default {
  title: "Race Details Panel/Navigation Buttons",
  component: NavBtn,
  argTypes: {
    onClickHandler: { action: "clicked" },
    backgroundColor: {
      control: {
        type: "color",
      },
    },
    mode: {
      control: false,
    },
  },
} as ComponentMeta<typeof NavBtn>;

const Template = ({ backgroundColor, ...args }: NavBtnStory) => {
  return (
    <PanelCard backgroundColor={backgroundColor}>
      <div className="m-2 p-2">
        <NavBtn {...args} />
      </div>
    </PanelCard>
  );
};

export const Back = Template.bind({}) as any;
Back.args = {
  mode: "back",
  disabled: false,
  onClickHandler: (event: Event, mode: any) => [event, mode],
  backgroundColor: bgColor,
  basicColor: "red",
  size: 40,
};

export const Next = Template.bind({}) as any;
Next.args = {
  mode: "next",
  disabled: false,
  onClickHandler: (event: Event, mode: any) => [event, mode],
  backgroundColor: bgColor,
  basicColor: "red",
  size: 40,
};
