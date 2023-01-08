import CircuitLayoutBtn from "../components/CircuitLayoutBtn";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import PanelCard from "../components/PanelCard";

export default {
  title: "Race Details Panel/Circuit Details Button",
  component: CircuitLayoutBtn,
} as ComponentMeta<typeof CircuitLayoutBtn>;

const Template: ComponentStory<typeof CircuitLayoutBtn> = () => (
  <PanelCard backgroundColor="#100636">{/* <CircuitLayoutBtn /> */}</PanelCard>
);

export const DISABLED = Template.bind({});
