import DetailInfo from "../components/DetailInfo";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Detail Info",
  component: DetailInfo,
} as ComponentMeta<typeof DetailInfo>;

const Template: ComponentStory<typeof DetailInfo> = (args) => (
  <DetailInfo {...args} />
);

export const Main = Template.bind({});
Main.args = {
  label: "aaaaaaaa",
  info: "bbbbbbbb",
  measure: "",
  separatorIndex: 0,
  main: true,
};

// export const NotMain = () => <DetailInfo label="aaaaaaaa" info="bbbbbbb" />;
