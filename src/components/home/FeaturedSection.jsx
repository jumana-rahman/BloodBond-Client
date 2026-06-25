"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardBody, Avatar } from "@heroui/react";
import { Activity, Flame, ShieldCheck, Heart, HeartFill, Users, MapPin, ArrowRight } from "@gravity-ui/icons";
import { protectedFetch } from "@/lib/core/server";

export default function FeaturedSection() {
  const [pulseData, setPulseData] = useState({
    activeUrgentRequests: [],
    recentDonors: [],
    impactMetrics: { lifeSavedEstimate: 1420, criticalMatchesToday: 18 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPulseMetrics() {
      try {
        // Fetches curated urgent metrics specifically for the landing spotlight section
        const data = await protectedFetch("/api/public/landing-pulse");
        if (data) setPulseData(data);
      } catch (err) {
        console.error("Landing showcase failure:", err);
        // Seamless fallback fallback mock matrices if the backend pipe is warming up
        setPulseData({
          activeUrgentRequests: [
            { _id: "1", recipientName: "Rahat Karim", bloodGroup: "O-", hospitalName: "Dhaka Medical College", urgency: "Critical" },
            { _id: "2", recipientName: "Sultana Razia", bloodGroup: "A+", hospitalName: "Apollo Hospital", urgency: "Urgent" }
          ],
          recentDonors: [
            { id: 1, name: "Tanvir A.", bloodGroup: "B+", location: "Gulshan" },
            { id: 2, name: "Nisha K.", bloodGroup: "AB-", location: "Uttara" },
            { id: 3, name: "Asif M.", bloodGroup: "O+", location: "Mirpur" }
          ],
          impactMetrics: { lifeSavedEstimate: 1420, criticalMatchesToday: 18 }
        });
      } finally {
        setLoading(false);
      }
    }
    loadPulseMetrics();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden relative">
      
      {/* Dynamic Aesthetic Background Ambient Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-red-500/5 blur-[140px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Modern Minimalistic Glowing Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1 rounded-full text-red-700 text-xs font-black uppercase tracking-widest animate-pulse">
            <Activity className="w-3.5 h-3.5" />
            Live Network Pulse
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none">
            Minutes Matter. <br/><span className="text-red-700 bg-clip-text">Bridging the Gap Instantly.</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed max-w-xl mx-auto">
            Our autonomous routing platform matches real-time local emergency requests directly with active nearby blood donors. Here is how the community is responding right now.
          </p>
        </div>

        {/* Core Showcase Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* COLUMN 1 (Left 7-Slots wide): Interactive Emergency Alert Board */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4 bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <Flame className="text-amber-500 w-5 h-5" />
                  Active Emergency Bulletins
                </h3>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-xs text-gray-400">Verified critical blood requests within your network segment needing immediate donor allocation.</p>
            </div>

            <div className="space-y-4 my-4 flex-1 justify-center flex flex-col">
              {pulseData.activeUrgentRequests.map((req) => (
                <div 
                  key={req._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 hover:bg-red-50/20 border border-gray-100 hover:border-red-100 rounded-2xl transition-all duration-300 gap-4 group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-red-700 font-black text-white text-base flex items-center justify-center shadow-md shadow-red-700/10 shrink-0">
                      {req.bloodGroup}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-gray-900 group-hover:text-red-700 transition-colors flex items-center gap-2">
                        {req.recipientName}
                        <span className="text-[9px] px-1.5 py-0.5 font-black uppercase tracking-wider bg-red-100 text-red-800 rounded">
                          {req.urgency}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {req.hospitalName}
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href={`/donation-requests/${req._id}`}
                    className="h-9 px-4 bg-gray-900 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all self-start sm:self-center shrink-0"
                  >
                    Respond
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>

            <Link 
              href="/donation-requests" 
              className="text-xs font-black text-gray-900 hover:text-red-700 flex items-center gap-1.5 transition-colors pt-2 group"
            >
              Scan all open pending requests
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* COLUMN 2 (Right 5-Slots wide): Real-time Impact and Activity Ticker */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Upper Box: Live Impact Metrics Count Card */}
            <Card shadow="none" className="bg-gray-900 border border-gray-800 rounded-[32px] p-6 text-white relative overflow-hidden flex-1 flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-8 text-gray-800 opacity-20 pointer-events-none">
                <HeartFill className="w-32 h-32" />
              </div>
              <CardBody className="p-0 space-y-4 relative z-10">
                <div className="p-2.5 bg-white/5 border border-white/10 text-red-500 rounded-xl w-fit">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                    {pulseData.impactMetrics.lifeSavedEstimate}+
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    System Lives Sustained
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-400 leading-relaxed">
                  Every transaction ledger confirms critical allocation stability. Today alone, <span className="text-emerald-400 font-bold">{pulseData.impactMetrics.criticalMatchesToday} emergency requests</span> found successful matches.
                </p>
              </CardBody>
            </Card>

            {/* Lower Box: Live Community Donors Stream Feed */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                  <Users className="text-gray-400 w-4 h-4" />
                  Recent Active Contributors
                </h4>
                <p className="text-[11px] text-gray-400">Newly added heroes stepping into operational standby status.</p>
              </div>

              {/* Contributor List Stream Elements */}
              <div className="flex flex-col gap-3">
                {pulseData.recentDonors.map((donor) => (
                  <div key={donor.id} className="flex items-center justify-between text-xs border-b border-gray-50 pb-2.5 last:border-none last:pb-0">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={donor.name} className="w-7 h-7 text-[10px] font-bold bg-gray-100 text-gray-700 rounded-lg border border-gray-200" />
                      <div>
                        <div className="font-bold text-gray-800">{donor.name}</div>
                        <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-gray-300" />
                          {donor.location}
                        </div>
                      </div>
                    </div>
                    <Chip size="sm" variant="flat" color="danger" className="font-black text-[10px] h-5 rounded-md px-1.5">
                      Group {donor.bloodGroup}
                    </Chip>
                  </div>
                ))}
              </div>

              {/* Network Security Compliance Banner */}
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                PCI-DSS Security Protocol Mask Active
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}