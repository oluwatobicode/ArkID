interface StatCard {
  icon: string;
  label: string;
  value: string;
}

const StatCard = ({ icon, label, value }: StatCard) => {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-[8px] bg-[#202022] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#D4AF37]">
          <img src={icon} alt="icon" className="h-5 w-5" />
        </div>

        <p className="text-[12px] font-bold uppercase tracking-wider text-[#A1A1AA]">
          {label}
        </p>
      </div>

      <h2 className="text-[40px] font-bold leading-none text-white">{value}</h2>
    </div>
  );
};

export default StatCard;
