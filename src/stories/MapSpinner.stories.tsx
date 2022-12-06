import { ThreeCircles } from "react-loader-spinner";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "General/Map Loading Spinner",
  component: ThreeCircles,
} as ComponentMeta<typeof ThreeCircles>;

const Template: ComponentStory<typeof ThreeCircles> = ({ ...args }) => (
  <ThreeCircles {...args} />
);

export const MapLoadingSpinner = Template.bind({}) as any;
MapLoadingSpinner.args = {
  height: "100",
  width: "100",
  color: "#1e90ff",
  visible: true,
  ariaLabel: "three-circles-rotating",
  outerCircleColor: "#00008b",
  innerCircleColor: "",
  middleCircleColor: "red",
};
