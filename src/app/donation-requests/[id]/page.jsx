"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Chip, Card, CardBody, Input } from "@heroui/react";
import { ArrowLeft, Calendar, Clock, MapPin, Person, Heart, FileText, Mail } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { protectedFetch, serverMutation } from "@/lib/core/server";

export default function PrivateDonationRequestDetails({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      toast.warning("Authorization matrix unverified. Routing to login gateway node.");
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      fetchRequestDetails();
    }
  }, [session, unwrappedParams.id]);

  const fetchRequestDetails = async () => {
    setLoading(true);
    try {
      const data = await protectedFetch(`/api/donation-requests/${unwrappedParams.id}`);
      setRequest(data.request);
    } catch (err) {
      console.error(err);
      toast.error("Failed to extract target requisition metadata matrix details.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDonation = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      // Fires the server allocation protocol to move the request from pending to inprogress
      await serverMutation(`/api/donation-requests/${unwrappedParams.id}/accept`, {
        donorName: session?.user?.name,
        donorEmail: session?.user?.email
      }, "POST");
      
      toast.success("Donation confirmed successfully! Requisition changed to In Progress.");
      setIsModalOpen(false);
      router.push("/dashboard/my-donation-requests");
    } catch (err) {
      toast.error("Donation allocation protocol rejected by server clusters.");
    } finally {
      setActionLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="h-[80vh] flex flex-col justify-center items-center gap-2">
        <div className="w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Decrypting Secure Node Data...</span>
      </div>
    );
  }

  if (!request) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 min-h-screen animate-fade-in">
      
      {/* Back Navigation Bar Action Anchor */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Request Ledger
      </button>

      {/* Primary Structural Presentation Sheet */}
      <Card shadow="none" className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <CardBody className="p-6 sm:p-8 space-y-6">
          
          {/* Header Block Row Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-50 pb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase tracking-wider inline-block">
                Status: {request.status}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Emergency Blood Requisition Details
              </h2>
            </div>
            <Chip size="lg" variant="flat" color="danger" className="font-black text-sm px-4 py-1.5 h-9 rounded-xl self-start sm:self-center">
              Group {request.bloodGroup}
            </Chip>
          </div>

          {/* Core Structured Field Information Block containing all request form variables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Person className="w-3.5 h-3.5" /> Recipient Full Name
              </span>
              <p className="text-sm font-bold text-gray-800">{request.recipientName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Full Medical Facility Address
              </span>
              <p className="text-sm font-semibold text-gray-700">
                {request.hospitalName}, {request.fullAddress}, {request.recipientUpazila}, {request.recipientDistrict}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Target Timeline Date
              </span>
              <p className="text-sm font-bold text-gray-800">{request.donationDate}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Required Specific Time
              </span>
              <p className="text-sm font-bold text-gray-800">{request.donationTime}</p>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Requisition Context Notes
              </span>
              <p className="text-sm text-gray-500 font-medium leading-relaxed bg-gray-50 rounded-2xl p-4 border border-gray-100">
                {request.explanationMessage || "No explanatory documentation provided with this tracking ledger instance."}
              </p>
            </div>

          </div>

          {/* Secure Interactive Action Blocks */}
          {request.status === "pending" && (
            <div className="pt-4 border-t border-gray-50 flex flex-col sm:flex-row gap-3">
              <button
                disabled={actionLoading}
                onClick={() => setIsModalOpen(true)}
                className="flex-1 h-12 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Heart className="w-4 h-4" />
                Donate
              </button>
            </div>
          )}

        </CardBody>
      </Card>

      {/* Confirmation Donation Form Modal Backdrop Box Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-100 space-y-4 animate-scale-up">
            
            <div>
              <h4 className="text-lg font-black text-gray-900 tracking-tight">Confirm Donation Assignment</h4>
              <p className="text-xs text-gray-400 mt-0.5">Please review your verification metrics credentials below before committing to this requisition workflow.</p>
            </div>

            <form onSubmit={handleConfirmDonation} className="space-y-4 pt-2">
              
              {/* Donor Name (Read-Only) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Donor Name Identity</label>
                <Input
                  type="text"
                  value={session?.user?.name || ""}
                  readOnly
                  disabled
                  radius="xl"
                  variant="flat"
                  startContent={<Person className="text-gray-400 w-4 h-4 mr-1" />}
                  className="font-bold text-gray-700 text-sm"
                />
              </div>

              {/* Donor Email (Read-Only) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Donor Email Address</label>
                <Input
                  type="email"
                  value={session?.user?.email || ""}
                  readOnly
                  disabled
                  radius="xl"
                  variant="flat"
                  startContent={<Mail className="text-gray-400 w-4 h-4 mr-1" />}
                  className="font-bold text-gray-700 text-sm"
                />
              </div>

              {/* Form Actions Buttons Grid */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  Confirm Donation
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}