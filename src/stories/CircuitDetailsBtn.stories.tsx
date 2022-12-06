import CircuitDetailsBtn from "../components/CircuitDetailsBtn";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import PanelCard from "../components/PanelCard";

export default {
  title: "Race Details Panel/Circuit Details Button",
  component: CircuitDetailsBtn,
} as ComponentMeta<typeof CircuitDetailsBtn>;

const Template: ComponentStory<typeof CircuitDetailsBtn> = () => (
  <PanelCard backgroundColor="#100636">
    <CircuitDetailsBtn />
  </PanelCard>
);

export const DISABLED = Template.bind({});
