"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { serverFetch, serverMutation } from "@/lib/core/server";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import {
  FaSpinner,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaHeartbeat,
} from "react-icons/fa";
import { toast } from "react-toastify";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

// ── Stripe Checkout Form ──
const CheckoutForm = ({ userId, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/dashboard/funding`,
          },
          redirect: "if_required",
        },
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === "succeeded") {
        await serverMutation(
          "/api/funding",
          {
            userId: userId,
            amount: amount,
            paymentId: paymentIntent.id,
          },
          "POST",
        );

        toast.success("🎉 Donation successful. Thank you for saving lives!");
        onSuccess();
      }
    } catch (error) {
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ⚠️ Added 'w-full' to ensure the form fills the container */}
      <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50">
        {/* 🔥 Stripe's PaymentElement automatically becomes responsive inside the Div */}
        <PaymentElement />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            `Donate $${amount}`
          )}
        </button>
      </div>
    </form>
  );
};

// ── Main Component ──
export default function FundingClient({ currentUserId }) {
  const router = useRouter();

  const [funding, setFunding] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(10);
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoadingSecret, setIsLoadingSecret] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchFunding = async () => {
    try {
      setLoading(true);
      const response = await serverFetch("/api/funding");
      if (response.success) {
        setFunding(response.data);
      }
    } catch (error) {
      toast.error("Failed to load funding history");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFunding();
  }, []);

  // ── Fetch Client Secret ONLY after modal opens ──
  useEffect(() => {
    if (isModalOpen && donationAmount > 0) {
      const getClientSecret = async () => {
        try {
          setIsLoadingSecret(true);
          const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL;
          const res = await fetch(
            `${apiUrl}/api/funding/create-payment-intent`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: donationAmount * 100 }),
            },
          );
          const data = await res.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error("Failed to get client secret", error);
          toast.error("Failed to initialize payment. Try again.");
        } finally {
          setIsLoadingSecret(false);
        }
      };
      getClientSecret();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientSecret(null);
    }
  }, [isModalOpen, donationAmount]);

  // Pagination Logic
  const totalFunding = funding.length;
  const totalPages = Math.ceil(totalFunding / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFunding = funding.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePaymentSuccess = () => {
    setIsModalOpen(false);
    setClientSecret(null);
    fetchFunding();
  };

  if (loading && funding.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-red-600 text-4xl" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mx-auto w-full max-w-7xl">
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
              Funding History
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Support BloodSync with a small donation. Every drop counts!
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <FaMoneyBillWave size={14} /> Give Fund
          </button>
        </div>

        {totalFunding === 0 && !loading && (
          <div className="p-10 text-center">
            <p className="text-gray-500">
              No funding records yet. Be the first to give!
            </p>
          </div>
        )}

        {totalFunding > 0 && (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block w-full overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600 table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    {/* CHANGED: fixed widths so columns don't stretch */}
                    <th className="px-4 py-3 w-[40%]">Donor Name</th>
                    <th className="px-4 py-3 w-[20%]">Amount</th>
                    <th className="px-4 py-3 w-[40%]">Funding Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentFunding.map((fund) => (
                    <tr
                      key={fund._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 lg:px-4 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-gray-400" size={14} />
                          {fund.donorName || "Anonymous"}
                        </div>
                      </td>
                      <td className="px-3 lg:px-4 py-4 text-green-600 font-semibold">
                        ${fund.amount.toFixed(2)}
                      </td>
                      <td className="px-3 lg:px-4 py-4 text-gray-500">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt size={14} />
                          {new Date(
                            fund.createdAt,
                          ).toLocaleDateString()} at{" "}
                          {new Date(fund.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {currentFunding.map((fund) => (
                <div
                  key={fund._id}
                  className="p-4 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                      <FaUser className="text-gray-400" size={12} />
                      {fund.donorName || "Anonymous"}
                    </h3>
                    <span className="text-green-600 font-bold text-sm">
                      ${fund.amount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                    <FaCalendarAlt size={12} />
                    {new Date(fund.createdAt).toLocaleDateString()} at{" "}
                    {new Date(fund.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-3 sm:p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50">
                <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Showing {indexOfFirstItem + 1}–
                  {Math.min(indexOfLastItem, totalFunding)} of {totalFunding}{" "}
                  donations
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronLeft size={13} />
                  </button>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap px-1">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── RESPONSIVE FUNDING MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-1 inline-flex items-center gap-2">
              <FaHeartbeat className="text-red-600 text-2xl" />
              <span className="text-xl font-bold text-gray-800">
                <span className="text-red-600">Blood</span>Sync
              </span>
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter the amount you wish to donate securely.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donation Amount ($)
              </label>
              <input
                type="number"
                min="1"
                value={donationAmount}
                onChange={(e) =>
                  setDonationAmount(parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {isLoadingSecret ? (
              <div className="flex justify-center py-4">
                <FaSpinner className="animate-spin text-red-600 text-2xl" />
              </div>
            ) : (
              clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    userId={currentUserId}
                    amount={donationAmount}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setIsModalOpen(false)}
                  />
                </Elements>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
