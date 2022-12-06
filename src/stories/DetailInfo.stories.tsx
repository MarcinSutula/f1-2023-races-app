import DetailInfo, { DetailInfoProps } from "../components/DetailInfo";
import { ComponentMeta } from "@storybook/react";
import PanelCard from "../components/PanelCard";

type DetailInfoStory = DetailInfoProps & {
  backgroundColor: string;
};

const bgColor = "#100636";

export default {
  title: "Race Details Panel/Detail Info",
  component: DetailInfo,
  argTypes: {
    backgroundColor: {
      control: {
        type: "color",
      },
    },
  },
} as ComponentMeta<typeof DetailInfo>;

const Template = ({ backgroundColor, ...args }: DetailInfoStory) => {
  return (
    <PanelCard backgroundColor={backgroundColor}>
      <DetailInfo {...args} />
    </PanelCard>
  );
};

export const RaceDistance = Template.bind({}) as any;
RaceDistance.args = {
  label: "Race Distance",
  info: "306630",
  main: false,
  backgroundColor: bgColor,
  measure: "km",
  separatorIndex: 3,
};

export const CircuitLength = Template.bind({}) as any;
CircuitLength.args = {
  label: "Circuit Length",
  info: "4381",
  main: false,
  backgroundColor: bgColor,
  measure: "km",
  separatorIndex: 1,
};

export const NumberOfLaps = Template.bind({}) as any;
NumberOfLaps.args = {
  label: "Number Of Laps",
  info: "70",
  main: false,
  backgroundColor: bgColor,
};

export const NumberOfDRSZones = Template.bind({}) as any;
NumberOfDRSZones.args = {
  label: "Number Of DRS Zones",
  info: "1",
  main: false,
  backgroundColor: bgColor,
};

export const MainLapRecord = Template.bind({}) as any;
MainLapRecord.args = {
  label: "Lap Record",
  info: `Lewis Hamilton (2020) 1:16.627`,
  main: true,
  backgroundColor: bgColor,
};
