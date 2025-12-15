import ProfileForm from "../components/ProfileForm";
import RedirectSection from "../components/RedirectSection";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-[8px] bg-[#202022] p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">@john_doe_24</h1>
          <div className="rounded-full bg-[#B4FFE6] px-4 py-1.5 text-sm font-bold text-[#10B981]">
            <span className="mr-2 inline-block  h-2 w-2 rounded-full bg-[#10B981]"></span>
            Active
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <StatCard icon="/tap-one.svg" label="TOTAL TAPS" value="1,568" />
          <StatCard
            icon="/tick-one.svg"
            label="VALID REDIRECTS"
            value="1,540"
          />
        </div>

        <div className="rounded-[8px] bg-[#202022] p-6 md:p-8">
          <RedirectSection />
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
