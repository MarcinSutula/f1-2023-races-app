type PanelTitleProps = {
  title: string;
};

function PanelTitle({ title }: PanelTitleProps) {
  return <p className="text-white text-center font-bold text-3xl">{title}</p>;
}

export default PanelTitle;
