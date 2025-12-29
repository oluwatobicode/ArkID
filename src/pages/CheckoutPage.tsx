import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateDiscount } from "../services/api/validateDiscount";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your address"),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please enter your state"),
  deliveryOption: z.enum(["within-lagos", "outside-lagos"]),
  discountCode: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{code: string; amount: number} | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
  });

  const deliveryOption = watch("deliveryOption");
  const discountCode = watch("discountCode");
  const basePrice = 25000;
  const deliveryFee = deliveryOption === "within-lagos" ? 4500 : deliveryOption === "outside-lagos" ? 7000 : 0;
  const discountAmount = appliedDiscount?.amount || 0;
  const totalPrice = Math.max(0, basePrice + deliveryFee - discountAmount); // Ensure price doesn't go negative

  const handleApplyDiscount = async () => {
    const code = getValues("discountCode");

    if (!code || code.trim() === "") {
      setDiscountError("Please enter a discount code");
      return;
    }

    setApplyingDiscount(true);
    setDiscountError(null);

    try {
      console.log('Applying discount code:', code);

      // Call API to verify discount code
      const response = await validateDiscount(code);
      console.log('Discount API response:', response);

      if (response && response.success) {
        // Calculate the full discount (base price + delivery fee = free order)
        const currentDeliveryFee = deliveryOption === "within-lagos" ? 4500 : 7000;
        const fullDiscountAmount = basePrice + currentDeliveryFee;

        setAppliedDiscount({
          code: code,
          amount: fullDiscountAmount
        });
        setDiscountError(null);
        console.log('Discount applied successfully:', fullDiscountAmount);
      } else {
        const errorMessage = response?.message || "Invalid discount code";
        setDiscountError(errorMessage);
        setAppliedDiscount(null);
        console.log('Discount code invalid:', errorMessage);
      }
    } catch (error) {
      console.error("Discount verification failed:", error);

      // More detailed error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      setDiscountError("Failed to verify discount code. Please try again.");
      setAppliedDiscount(null);
    } finally {
      setApplyingDiscount(false);
      console.log('Discount application finished');
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountError(null);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    try {
      const deliveryFee = data.deliveryOption === "within-lagos" ? 4500 : 7000;
      const discountAmount = appliedDiscount?.amount || 0;
      const totalAmount = Math.max(0, 25000 + deliveryFee - discountAmount); // Ensure amount doesn't go negative

      console.log('Order submission:', {
        basePrice: 25000,
        deliveryFee,
        discountAmount,
        totalAmount,
        discountCode: appliedDiscount?.code
      });

      const orderData = {
        ...data,
        currency: "NGN",
        amount: totalAmount,
        deliveryFee: deliveryFee,
        discountCode: appliedDiscount?.code || "",
        discountAmount: discountAmount,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        orderData
      );

      if (response.data.paymentUrl) {
        // Has payment URL, redirect to payment gateway
        window.location.href = response.data.paymentUrl;
      } else {
        // No payment URL (free order with discount), redirect to payment callback
        console.log('Order is free, redirecting to payment callback');
        navigate("/payment/callback", {
          state: {
            success: true,
            orderData: response.data,
            isFreeOrder: true
          }
        });
      }
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <img 
            src="/Logo (1).png" 
            alt="ArkID Logo" 
            className="h-8 w-auto md:h-10 cursor-pointer" 
            onClick={() => navigate("/")}
          />
          
          <nav className="hidden items-center gap-8 md:flex">
            <a href="/" className="text-sm font-medium text-gray-900 transition-colors hover:text-[#d4af37]">
              Home
            </a>
            <a href="/#how-it-works" className="text-sm font-medium text-gray-900 transition-colors hover:text-[#d4af37]">
              How It Works
            </a>
            <a href="/checkout" className="text-sm font-medium text-gray-900 transition-colors hover:text-[#d4af37]">
              Pricing/Shop
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => navigate("/activate")}
              className="rounded-md border-2 border-[#d4af37] px-5 py-2 text-sm font-semibold text-[#d4af37] transition-all hover:bg-[#d4af37] hover:text-black"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className="rounded-md bg-[#d4af37] px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-[#c29f2f]"
            >
              Buy Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-16 z-50 bg-white shadow-lg md:hidden">
            <nav className="flex flex-col border-t border-gray-100">
              <a 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="border-b border-gray-100 px-4 py-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
              >
                Home
              </a>
              <a 
                href="/#how-it-works" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="border-b border-gray-100 px-4 py-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
              >
                How it Works
              </a>
              <a 
                href="/checkout" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="border-b border-gray-100 px-4 py-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
              >
                Pricing/Shop
              </a>
              <a 
                onClick={() => { navigate("/activate"); setIsMobileMenuOpen(false); }} 
                className="border-b border-gray-100 px-4 py-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50 cursor-pointer"
              >
                Sign Up/Log In
              </a>
              <a 
                href="#contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
              >
                Contact Us
              </a>
            </nav>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-2xl px-4 py-12 md:px-8 md:py-16">
        <div className="mb-12 overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">Standard</h2>
          
          <div className="mb-8 flex justify-center">
            <div className="w-full max-w-sm">
              <img
                src="/Ark Identity.png"
                alt="ArkID Card"
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
          </div>

          <div className="mb-6 text-center">
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="text-xl font-bold text-gray-400 line-through md:text-2xl">₦30,000.00</div>
              <div className="text-4xl font-bold text-gray-900 md:text-5xl">₦25,000.00</div>
            </div>
          </div>

          <ul className="mb-8 space-y-3 text-center">
            <li className="flex items-center justify-center gap-2 text-gray-700">
              <span className="text-lg">•</span>
              <span>Durable plastic</span>
            </li>
            <li className="flex items-center justify-center gap-2 text-gray-700">
              <span className="text-lg">•</span>
              <span>Matte finish</span>
            </li>
          </ul>

          <button
            onClick={() => window.scrollTo({ top: document.getElementById('checkout-form')?.offsetTop || 0, behavior: 'smooth' })}
            className="w-full rounded-lg bg-[#d4af37] py-3 text-base font-semibold text-black transition-all hover:bg-[#c29f2f]"
          >
            Buy
          </button>
        </div>

        <div id="checkout-form">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
              Complete Your Order
            </h1>
            <p className="text-gray-600">Fill in your details to proceed</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Personal Information</h2>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 ${
                      errors.name
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-[#d4af37]"
                    }`}
                  />
                  {errors.name && (
                    <p className="pl-1 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                    Preferred Username
                  </label>
                  <input
                    {...register("username")}
                    type="text"
                    id="username"
                    placeholder="john_doe"
                    className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 ${
                      errors.username
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-[#d4af37]"
                    }`}
                  />
                  {errors.username && (
                    <p className="pl-1 text-xs text-red-500">{errors.username.message}</p>
                  )}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      id="email"
                      placeholder="john@example.com"
                      className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-[#d4af37]"
                      }`}
                    />
                    {errors.email && (
                      <p className="pl-1 text-xs text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      id="phone"
                      placeholder="+234 123 456 7890"
                      className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 ${
                        errors.phone
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-[#d4af37]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="pl-1 text-xs text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                    Delivery Address
                  </label>
                  <input
                    {...register("address")}
                    type="text"
                    id="address"
                    placeholder="123 Main Street"
                    className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 ${
                      errors.address
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-[#d4af37]"
                    }`}
                  />
                  {errors.address && (
                    <p className="pl-1 text-xs text-red-500">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
                      City
                    </label>
                    <input
                      {...register("city")}
                      type="text"
                      id="city"
                      placeholder="Lagos"
                      className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 ${
                        errors.city
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-[#d4af37]"
                      }`}
                    />
                    {errors.city && (
                      <p className="pl-1 text-xs text-red-500">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="state" className="block text-sm font-semibold text-gray-700">
                      State
                    </label>
                    <input
                      {...register("state")}
                      type="text"
                      id="state"
                      placeholder="Lagos"
                      className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 ${
                        errors.state
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-[#d4af37]"
                      }`}
                    />
                    {errors.state && (
                      <p className="pl-1 text-xs text-red-500">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Delivery Option
                  </label>
                  <div className="space-y-3">
                    <label className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-all ${
                      errors.deliveryOption
                        ? "border-red-500"
                        : deliveryOption === "within-lagos"
                        ? "border-[#d4af37] bg-[#d4af37]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          {...register("deliveryOption")}
                          type="radio"
                          value="within-lagos"
                          className="h-4 w-4 text-[#d4af37] focus:ring-[#d4af37]"
                        />
                        <span className="text-sm font-medium text-gray-900">Within Lagos</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">₦4,500</span>
                    </label>

                    <label className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-all ${
                      errors.deliveryOption
                        ? "border-red-500"
                        : deliveryOption === "outside-lagos"
                        ? "border-[#d4af37] bg-[#d4af37]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          {...register("deliveryOption")}
                          type="radio"
                          value="outside-lagos"
                          className="h-4 w-4 text-[#d4af37] focus:ring-[#d4af37]"
                        />
                        <span className="text-sm font-medium text-gray-900">Outside Lagos</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">₦7,000</span>
                    </label>
                  </div>
                  {errors.deliveryOption && (
                    <p className="pl-1 text-xs text-red-500">{errors.deliveryOption.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="discountCode" className="block text-sm font-semibold text-gray-700">
                    Discount Code (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      {...register("discountCode")}
                      type="text"
                      id="discountCode"
                      placeholder="Enter discount code"
                      disabled={!!appliedDiscount}
                      className={`flex-1 rounded-lg border-2 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#d4af37] ${
                        appliedDiscount ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    />
                    {!appliedDiscount ? (
                      <button
                        type="button"
                        onClick={handleApplyDiscount}
                        disabled={applyingDiscount || !discountCode}
                        className="rounded-lg bg-[#d4af37] px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-[#c29f2f] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {applyingDiscount ? "Applying..." : "Apply"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRemoveDiscount}
                        className="rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {discountError && (
                    <p className="pl-1 text-xs text-red-500">{discountError}</p>
                  )}
                  {appliedDiscount && (
                    <p className="pl-1 text-xs text-green-600">
                      Discount applied: ₦{appliedDiscount.amount.toLocaleString()} off
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            {deliveryOption && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Card Price</span>
                    <span className="font-semibold">₦25,000.00</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Delivery Fee ({deliveryOption === "within-lagos" ? "Within Lagos" : "Outside Lagos"})</span>
                    <span className="font-semibold">₦{deliveryFee.toLocaleString()}.00</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>Discount ({appliedDiscount.code})</span>
                      <span className="font-semibold">-₦{discountAmount.toLocaleString()}.00</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₦{totalPrice.toLocaleString()}.00</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full transform rounded-lg bg-[#d4af37] py-4 text-base font-bold uppercase tracking-wide text-black transition-all hover:bg-[#c29f2f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isProcessing ? (
                "Processing..."
              ) : deliveryOption && appliedDiscount ? (
                <span className="flex items-center justify-center gap-2">
                  <span>Complete Order & Pay</span>
                  <span className="line-through opacity-70">₦{(basePrice + deliveryFee).toLocaleString()}</span>
                  <span className="text-lg">₦{totalPrice.toLocaleString()}</span>
                </span>
              ) : deliveryOption ? (
                `Complete Order & Pay ₦${totalPrice.toLocaleString()}`
              ) : (
                "Complete Order & Pay"
              )}
            </button>
          </form>
        </div>
      </div>

      <footer className="bg-black px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <img src="/ArkID logo-1.png" alt="ArkID Logo" className="mb-4 h-10 w-auto" />
              <p className="text-base text-white">
                Share your contact info, social media, and portfolio with just one tap
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-base font-semibold text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/#how-it-works" className="text-base text-white hover:text-[#d4af37]">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="/checkout" className="text-base text-white hover:text-[#d4af37]">
                    Pricing/Shop
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-base font-semibold text-white">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#terms" className="text-base text-white hover:text-[#d4af37]">
                    Terms of use
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="text-base text-white hover:text-[#d4af37]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#help" className="text-base text-white hover:text-[#d4af37]">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-base font-semibold text-white">Social</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#twitter" className="flex items-center gap-2 text-base text-white hover:text-[#d4af37]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#instagram" className="flex items-center gap-2 text-base text-white hover:text-[#d4af37]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">&copy; 2025 ArkID</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutPage;
