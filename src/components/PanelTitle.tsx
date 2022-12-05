type PanelTitleProps = {
  title: string;
};

function PanelTitle({ title }: PanelTitleProps) {
  return (
    <div className="h-20 flex justify-center items-center">
      <p className="text-white font-bold text-3xl text-center">{title}</p>
    </div>
  );
}

export default PanelTitle;
