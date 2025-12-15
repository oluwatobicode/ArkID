import { useState } from "react";

const RedirectSection = () => {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="mt-6 border-b border-[#2F2F32] pb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Card Status</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#A1A1AA]">Enable Card</span>

          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              enabled ? "bg-[#D4AF37]" : "bg-gray-600"
            }`}
          >
            <span
              className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform ${
                enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-white">Redirect Link</label>
        <p className="text-xs text-[#A1A1AA]">Your Redirect URL</p>

        <input
          type="text"
          defaultValue="https://ark-id.com/john_doe-24"
          className="w-full rounded-[12px] border border-[#2F2F32] bg-[#18181B] p-4 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
        />

        <button className="mt-2 rounded-[12px] bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black hover:bg-[#b8952b]">
          Save Redirect Link
        </button>
      </div>
    </div>
  );
};

export default RedirectSection;
