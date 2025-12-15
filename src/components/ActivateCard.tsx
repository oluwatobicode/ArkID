import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
import { useNavigate } from "react-router-dom";

const activateSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  redirectUrl: z
    .string()
    .min(1, "Redirect link is required")
    .url("Please enter a valid URL (e.g., https://instagram.com/u)"),
});

type ActivateFormData = z.infer<typeof activateSchema>;

const ActivateCard = () => {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ActivateFormData>({
    resolver: zodResolver(activateSchema),
    mode: "onBlur",
  });

  const watchedUsername = watch("username");

  const navigate = useNavigate();

  const onSubmit = async (data: ActivateFormData) => {
    // try {
    //   const response = await axios.post("http://localhost:3000/activate", data);

    //   console.log(response);
    //   setSuccess(true);
    // } catch (error) {
    //   console.error(error);
    // }
    console.log(data);
    setSuccess(true);
    navigate("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4">
      <div className="flex w-full flex-col items-center space-y-[60px] md:space-y-[97.5px]">
        <div className="animate-fade-in">
          <img src="/arkid-logo.svg" alt="ArkID Logo" className="h-12 w-auto" />
        </div>

        <div className="w-full max-w-[400px] rounded-[24px] bg-white p-6 shadow-2xl md:p-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-[24px] font-bold leading-tight tracking-tight text-gray-900">
                Activate Your Ark<span className="text-[#d4af37]">ID</span> Card
              </h1>
              <p className="text-sm text-gray-500">
                Set up your personalized redirect link
              </p>
            </div>

            {success ? (
              <div className="rounded-lg bg-green-50 p-4 text-center text-green-800 border border-green-200">
                <p className="font-bold">Card Activated Successfully!</p>
                <p className="text-sm mt-1">Your profile is live.</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col space-y-5"
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Your Unique ArkID Username
                  </label>
                  <input
                    {...register("username")}
                    type="text"
                    id="username"
                    placeholder="e.g. john_doe"
                    className={`w-full rounded-[8px] border-2 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:bg-white
                      ${
                        errors.username
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-[#EDF0F7] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                      }`}
                  />
                  {errors.username && (
                    <p className="text-xs text-red-500 pl-1">
                      {errors.username.message}
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
                    className={`w-full rounded-[8px] border-2 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:bg-white
                      ${
                        errors.redirectUrl
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-[#EDF0F7] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                      }`}
                  />
                  {errors.redirectUrl && (
                    <p className="text-xs text-red-500 pl-1">
                      {errors.redirectUrl.message}
                    </p>
                  )}
                </div>

                <div className="">
                  <p className="text-[16px] text-black font-regular">
                    Your card will redirect to: https://
                    <span className="font-medium">
                      ark-id.com/{watchedUsername || "your-username"}
                    </span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full transform rounded-[10px] bg-[#d4af37] py-3.5 text-sm font-bold uppercase tracking-wide text-black transition-all hover:bg-[#c29f2f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      Activating...
                    </span>
                  ) : (
                    "Activate Card"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateCard;
