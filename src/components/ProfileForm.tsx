interface UserCard {
  card_id: string;
  user_id: string;
  username: string;
  email: string;
  isActivated: boolean;
  redirect_url: string | null;
  taps_count: number;
  valid_redirects_count: number;
  createdAt: string;
  updatedAt: string;
}

interface ProfileFormProps {
  userCard?: UserCard | null;
}

const ProfileForm = ({ userCard }: ProfileFormProps) => {
  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-medium text-white">Profile Information</h3>

      <div className="grid gap-6 grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-[#A1A1AA]">Username</label>
          <input
            type="text"
            value={userCard?.username || ""}
            readOnly
            className="w-full rounded-[12px] border border-[#2F2F32] bg-[#18181B] p-4 text-gray-400 focus:border-[#D4AF37] focus:outline-none cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#A1A1AA]">Email</label>
          <input
            type="email"
            value={userCard?.email || ""}
            readOnly
            className="w-full rounded-[12px] border border-[#2F2F32] bg-[#18181B] p-4 text-gray-400 focus:border-[#D4AF37] focus:outline-none cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#A1A1AA]">Card ID</label>
          <input
            type="text"
            value={userCard?.card_id || ""}
            readOnly
            className="w-full rounded-[12px] border border-[#2F2F32] bg-[#18181B] p-4 text-gray-400 focus:border-[#D4AF37] focus:outline-none cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#A1A1AA]">Status</label>
          <input
            type="text"
            value={userCard?.isActivated ? "Activated" : "Not Activated"}
            readOnly
            className={`w-full rounded-[12px] border border-[#2F2F32] bg-[#18181B] p-4 focus:border-[#D4AF37] focus:outline-none cursor-not-allowed ${
              userCard?.isActivated ? "text-green-400" : "text-red-400"
            }`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-[#A1A1AA]">Created Date</label>
        <input
          type="text"
          value={userCard?.createdAt ? new Date(userCard.createdAt).toLocaleDateString() : ""}
          readOnly
          className="w-full rounded-[12px] border border-[#2F2F32] bg-[#18181B] p-4 text-gray-400 focus:border-[#D4AF37] focus:outline-none cursor-not-allowed"
        />
      </div>

      {!userCard && (
        <div className="text-center text-gray-400 py-8">
          <p>No card data available</p>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
