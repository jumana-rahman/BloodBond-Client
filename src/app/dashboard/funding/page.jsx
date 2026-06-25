"use client";

import { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input } from "@heroui/react";
import { Coins, Calendar, Person, CreditCard, ShieldCheck } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { protectedFetch, serverMutation } from "@/lib/core/server";
import { loadStripe } from "@stripe/stripe-js";

// Initialize your system Stripe public key safely from client environment wrappers
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

export default function FundingManagementLedger() {
  const { data: session } = authClient.useSession();
  
  // Funding Ledger Core Data Pipelines
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form submission management parameters
  const [donationAmount, setDonationAmount] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchFundingHistory();
  }, []);

  const fetchFundingHistory = async () => {
    setLoading(true);
    try {
      const data = await protectedFetch("/api/funding/history");
      setFunds(data.funds || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to extract systemic organization funding ledger records.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutInitiation = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(donationAmount);
    
    if (!parsedAmount || parsedAmount <= 0) {
      toast.warning("Please input a valid operational contribution dollar amount.");
      return;
    }

    setActionLoading(true);
    try {
      // 1. Fire parameters to backend stripe session engine configuration point
      const sessionData = await serverMutation("/api/funding/checkout-session", {
        amount: parsedAmount,
        userName: session?.user?.name,
        userEmail: session?.user?.email,
      }, "POST");

      // 2. Safely initialize client stripe wrapper components
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe context pipeline initiation failed.");

      // 3. Route user to secure external hosted payment routing block safely
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionData.id,
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Stripe secure gateway validation request sequence rejected.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Panel Controls Layer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Organization Funding Ledger
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor contribution indices or initiate secure checkout allocations for platform network stability.
          </p>
        </div>

        {/* Give Fund Initialization Action Trigger */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 self-start sm:self-center"
        >
          <Coins className="w-4 h-4" />
          Give Fund
        </button>
      </div>

      {/* Primary Historical Spreadsheet Records Block View */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-[45vh] flex flex-col justify-center items-center gap-2">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Compiling Transaction Ledgers...</span>
          </div>
        ) : funds.length === 0 ? (
          <div className="h-[45vh] flex flex-col justify-center items-center text-center p-6 space-y-1">
            <div className="text-sm font-bold text-gray-700">No Funding Records Active</div>
            <p className="text-xs text-gray-400">Be the first to create systemic liquidity backing for the network.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table aria-label="System funding transaction ledger" removeWrapper shadow="none" className="min-w-full">
              <TableHeader>
                <TableColumn className="font-bold text-xs">DONOR SYSTEM IDENTITY</TableColumn>
                <TableColumn className="font-bold text-xs">TRANSACTION EMAIL LINK</TableColumn>
                <TableColumn className="font-bold text-xs">CONTRIBUTED QUANTUM AMOUNT</TableColumn>
                <TableColumn className="font-bold text-xs text-center">SETTLEATION TIMEFRAME DATE</TableColumn>
              </TableHeader>
              <TableBody>
                {funds.map((fund) => (
                  <TableRow key={fund._id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                    
                    {/* Contributor Identity Block */}
                    <TableCell className="font-bold text-gray-950 text-sm flex items-center gap-2">
                      <Person className="w-4 h-4 text-gray-400" />
                      {fund.userName}
                    </TableCell>

                    {/* Email Verification Mapping Point */}
                    <TableCell className="text-sm font-semibold text-gray-500">
                      {fund.userEmail}
                    </TableCell>

                    {/* Contributed Currency Formatting */}
                    <TableCell className="font-black text-emerald-600 text-sm">
                      ${parseFloat(fund.amount).toFixed(2)}
                    </TableCell>

                    {/* Settleation Timestamp */}
                    <TableCell className="text-xs font-bold text-gray-400 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-300" />
                        {fund.fundingDate}
                      </div>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Stripe Interactive Secure Checkout Panel Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-gray-100 space-y-4 animate-scale-up">
            
            <div className="space-y-1">
              <h4 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                <CreditCard className="text-emerald-600 w-5 h-5" />
                Secure Portal Gateway
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your payment parameters will compile directly onto encrypted Stripe processing cloud networks safely.
              </p>
            </div>

            <form onSubmit={handleCheckoutInitiation} className="space-y-4 pt-1">
              
              {/* Contribution Input Metric Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Contribution Quantum Amount ($USD)
                </label>
                <Input
                  type="number"
                  min="1"
                  step="any"
                  placeholder="Enter funding amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  required
                  radius="xl"
                  variant="bordered"
                  className="font-bold text-gray-800 text-sm"
                  startContent={<span className="text-gray-400 font-bold text-sm">$</span>}
                />
              </div>

              {/* Secure Transaction Layout Indicator Banner */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-3 rounded-2xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[10px] font-bold text-gray-500 leading-tight">
                  PCI-DSS Encrypted Pipeline Validation Layer Active.
                </span>
              </div>

              {/* Modal Control Operational Action Blocks */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => {
                    setIsModalOpen(false);
                    setDonationAmount("");
                  }}
                  className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  Proceed to Checkout
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}