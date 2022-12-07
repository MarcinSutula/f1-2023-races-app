import { ComponentMeta } from "@storybook/react";
import PanelCard from "../components/PanelCard";

type RaceCounterToStoryProps = {
  raceOrderNumber: string;
  numberOfRaces: string;
  borderColor: string;
};

const RaceCounterToStory = ({
  raceOrderNumber,
  numberOfRaces,
  borderColor,
}: RaceCounterToStoryProps) => {
  return (
    <div className="flex justify-between align-middle mb-2">
      <p
        className="text-[white] text-3xl text-center my-2 ml-4 p-2 border-2 border-solid border-[grey]"
        style={{ borderColor }}
      >
        {`${raceOrderNumber}/${numberOfRaces}`}
      </p>
    </div>
  );
};

type RaceCounterStory = RaceCounterToStoryProps & {
  backgroundColor: string;
};

const bgColor = "#100636";

export default {
  title: "Race Details Panel/Race Counter",
  component: RaceCounterToStory,
  argTypes: {
    backgroundColor: {
      control: {
        type: "color",
      },
    },
  },
} as ComponentMeta<typeof RaceCounterToStory>;

const Template = ({ backgroundColor, ...args }: RaceCounterStory) => {
  return (
    <PanelCard backgroundColor={backgroundColor}>
      <RaceCounterToStory {...args} />
    </PanelCard>
  );
};

export const RaceCounter = Template.bind({}) as any;
RaceCounter.args = {
  raceOrderNumber: "05",
  numberOfRaces: "24",
  backgroundColor: bgColor,
  borderColor: "grey",
};
