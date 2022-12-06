import RaceLocation, { RaceLocationProps } from "../components/RaceLocation";
import { ComponentMeta } from "@storybook/react";
import PanelCard from "../components/PanelCard";

type RaceLocationStory = RaceLocationProps & {
  backgroundColor: string;
};

const bgColor = "#100636";

export default {
  title: "Race Details Panel/Race Location",
  component: RaceLocation,
  argTypes: {
    backgroundColor: {
      control: {
        type: "color",
      },
    },
  },
} as ComponentMeta<typeof RaceLocation>;

const Template = ({ backgroundColor, ...args }: RaceLocationStory) => {
  return (
    <PanelCard backgroundColor={backgroundColor}>
      <RaceLocation {...args} />
    </PanelCard>
  );
};

export const CityAndCountry = Template.bind({}) as any;
CityAndCountry.args = {
  city: "Jeddah",
  country: "Bahrain",
  backgroundColor: bgColor,
};
