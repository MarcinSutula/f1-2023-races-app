type DetailInfoProps = {
  label: string;
  info: string;
  measure?: string;
  separatorIndex?: number;
  main?: boolean;
};

function DetailInfo({
  label,
  info,
  measure = "",
  separatorIndex = 0,
  main = false,
}: DetailInfoProps) {
  let styleP1 = "text-white text-l text-left";
  let styleP2 = "text-white text-l text-right";

  if (main) {
    styleP1 = "text-[red] font-bold text-2xl text-center";
    styleP2 = "text-white text-2xl text-center";
  }

  if (separatorIndex) {
    info = info.slice(0, separatorIndex) + "." + info.slice(separatorIndex);
  }

  return (
    <div className="mt-2 mx-5">
      <p className={styleP1}>{label}</p>
      <p className={styleP2}>{info + measure}</p>
    </div>
  );
}

export default DetailInfo;
