import EventDate, { EventDateProps } from "../components/EventDate";
import { ComponentMeta } from "@storybook/react";
import PanelCard from "../components/PanelCard";

type EventDateStory = EventDateProps & {
  backgroundColor: string;
};

const bgColor = "#100636";

export default {
  title: "Race Details Panel/Event Date",
  component: EventDate,
  argTypes: {
    backgroundColor: {
      control: {
        type: "color",
      },
    },
  },
} as ComponentMeta<typeof EventDate>;

const Template = ({ backgroundColor, ...args }: EventDateStory) => {
  return (
    <PanelCard backgroundColor={backgroundColor}>
      <EventDate {...args} />
    </PanelCard>
  );
};

export const DayAndMonth = Template.bind({}) as any;
DayAndMonth.args = {
  startTimestamp: 1688083200000,
  endTimestamp: 1688256000000,
  backgroundColor: bgColor,
};
