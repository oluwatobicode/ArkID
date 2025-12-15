const ProfileForm = () => {
  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-medium text-white">Profile Information</h3>

      <div className="grid gap-6 grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-[#A1A1AA]">Full Name</label>
          <input
            type="text"
            defaultValue="John Doe"
            className="w-full rounded-[12px] border border-[#2F2F32] bg-[#18181B] p-4 text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#A1A1AA]">Email</label>
          <input
            type="email"
            defaultValue="johndoe@gmail.com"
            className="w-full rounded-[12px] border border-[#2F2F32] bg-[#18181B] p-4 text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#A1A1AA]">Phone Number</label>
          <input
            type="tel"
            defaultValue="+234 (123) 456 789"
            className="w-full rounded-[12px] border border-[#2F2F32] bg-[#18181B] p-4 text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#A1A1AA]">Company Name</label>
          <input
            type="text"
            defaultValue="John Doe Inc"
            className="w-full rounded-[12px] border border-[#2F2F32] bg-[#18181B] p-4 text-white focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      <button className="w-auto rounded-[12px] bg-[#D4AF37] px-8 py-3 text-sm font-bold text-black hover:bg-[#b8952b]">
        Save Profile Info
      </button>
    </div>
  );
};

export default ProfileForm;
