export type PanelTitleProps = {
  title: string;
};

function PanelTitle({ title }: PanelTitleProps) {
  return (
    <div className="h-20 flex justify-center items-center">
      <p className="text-white font-bold text-2xl text-center mx-2 px-2 py-2 rounded-lg bg-[darkred] border-2 border-solid border-[red]">
        {title}
      </p>
    </div>
  );
}

export default PanelTitle;
