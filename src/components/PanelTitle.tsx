export type PanelTitleProps = {
  title: string;
};

function PanelTitle({ title }: PanelTitleProps) {
  return (
    <div className="h-20 flex">
      <div className="flex align-middle justify-center w-full h-full mx-2 px-2 py-2 rounded-lg bg-[darkred] border-2 border-solid border-[red]">
        <p className="text-white font-bold text-center text-2xl my-auto">
          {title}
        </p>
      </div>
    </div>
  );
}

export default PanelTitle;
