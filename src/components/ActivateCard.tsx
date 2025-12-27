/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { activateCard } from "../services/api/activateCard";

interface CardData {
  username: string;
  isActivated: boolean;
  redirect_url: string | null;
  taps_count: number;
}

const activateSchema = z.object({
  cardId: z
    .string()
    .min(3, "Card ID must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  redirectUrl: z
    .string()
    .min(1, "Redirect link is required")
    .url("Please enter a valid URL (e.g., https://instagram.com/u)"),
});

type ActivateFormData = z.infer<typeof activateSchema>;

const ActivateCard = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  // No longer need authentication check since we removed redirect
  // const { authenticated, ready } = usePrivy();
  const cardData: CardData | null = location.state?.cardData || null;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ActivateFormData>({
    resolver: zodResolver(activateSchema),
    mode: "onBlur",
  });

  useEffect(() => {    
    if (cardData && cardData.redirect_url) {
      setValue("redirectUrl", cardData.redirect_url);
    }
  }, [cardData, setValue]);

  const onSubmit = async (data: ActivateFormData) => {
    try {
      setError(null);
      const response = await activateCard(data.cardId, data.redirectUrl);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(response.message || "Failed to activate card");
      }
    } catch (err) {
      console.error("Activation error:", err);
      setError("Failed to activate card. Please try again.");
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4">
      <div className="flex w-full flex-col items-center space-y-15 md:space-y-[97.5px]">
        <div className="animate-fade-in">
          <img src="/Logo (2).png" alt="ArkID Logo" className="h-12 w-auto" />
        </div>

        <div className="w-full max-w-100 rounded-3xl bg-white p-6 shadow-2xl md:p-8">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-[24px] font-bold leading-tight tracking-tight text-gray-900">
                Activate Your Ark<span className="text-[#d4af37]">ID</span> Card
              </h1>
              <p className="text-sm text-gray-500">
                Set up your personalized redirect link
              </p>
              {cardData && (
                <p className="text-xs text-gray-400">
                  Username: @{cardData.username}
                </p>
              )}
            </div>

            {success ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-green-800">
                <p className="font-bold">Card Activated Successfully!</p>
                <p className="mt-1 text-sm">Your profile is live. Redirecting to dashboard...</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-800">
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col space-y-5"
                >
                  <div className="space-y-1.5">
                    <label
                      htmlFor="cardId"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Card ID
                    </label>
                    <input
                      {...register("cardId")}
                      type="text"
                      id="cardId"
                      placeholder="e.g. ark000"
                      className={`w-full rounded-lg border-2 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:bg-white ${
                        errors.cardId
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-[#EDF0F7] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                      }`}
                    />
                    {errors.cardId && (
                      <p className="pl-1 text-xs text-red-500">
                        {errors.cardId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="redirectUrl"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Enter your Redirect Link
                    </label>
                    <input
                      {...register("redirectUrl")}
                      type="url"
                      id="redirectUrl"
                      placeholder="https://website.com"
                      className={`w-full rounded-lg border-2 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:bg-white ${
                        errors.redirectUrl
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-[#EDF0F7] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                      }`}
                    />
                    {errors.redirectUrl && (
                      <p className="pl-1 text-xs text-red-500">
                        {errors.redirectUrl.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-[16px] font-regular text-black">
                      Card ID was sent to your email during purchase
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full transform rounded-[10px] bg-[#d4af37] py-3.5 text-sm font-bold uppercase tracking-wide text-black transition-all hover:bg-[#c29f2f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Activating..." : "Activate Card"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateCard;
