"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Avatar, Chip } from "@heroui/react";
import { At, Flame, ShieldCheck, Heart, HeartFill, Persons, MapPin, ArrowRight } from "@gravity-ui/icons";
import { motion } from "framer-motion";
import { publicFetch  } from "@/lib/core/client";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function FeaturedSection() {
  const [pulseData, setPulseData] = useState({
    activeUrgentRequests: [],
    recentDonors: [],
    impactMetrics: { lifeSavedEstimate: 1420, criticalMatchesToday: 18 }
  });

  useEffect(() => {
    async function loadPulseMetrics() {
      try {
        const data = await protectedFetch("/api/public/landing-pulse");
        if (data) setPulseData(data);
      } catch (err) {
        setPulseData({
          activeUrgentRequests: [
            { _id: "1", recipientName: "Rahat Karim", bloodGroup: "O-", hospitalName: "Dhaka Medical College", urgency: "Critical" },
            { _id: "2", recipientName: "Sultana Razia", bloodGroup: "A+", hospitalName: "Apollo Hospital", urgency: "Urgent" }
          ],
          recentDonors: [
            { id: 1, name: "Tanvir A.", bloodGroup: "B+", location: "Gulshan" },
            { id: 2, name: "Nisha K.", bloodGroup: "AB-", location: "Uttara" }
          ],
          impactMetrics: { lifeSavedEstimate: 1420, criticalMatchesToday: 18 }
        });
      }
    }
    loadPulseMetrics();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-red-500/5 blur-[140px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1 rounded-full text-red-700 text-xs font-black uppercase tracking-widest">
            <At className="w-3.5 h-3.5 animate-pulse text-red-600" />
            Live Network Pulse
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none">
            Minutes Matter. <br/><span className="text-red-700">Bridging the Gap Instantly.</span>
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* PANEL 1: Active Bulletins */}
          <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col justify-between space-y-4 bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <Flame className="text-amber-500 w-5 h-5" />
                  Active Emergency Bulletins
                </h3>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </div>

            <div className="space-y-4 my-4 flex-1 justify-center flex flex-col">
              {pulseData.activeUrgentRequests.map((req) => (
                <motion.div 
                  key={req._id}
                  whileHover={{ scale: 1.015, x: 4 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 border border-gray-100 hover:border-red-100 hover:bg-red-50/10 rounded-2xl transition-all duration-200 gap-4 group"
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
                  <Link href={`/donation-requests/${req._id}`} className="h-9 px-4 bg-gray-900 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm">
                    Respond <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* PANEL 2 & 3: Statistics Dashboard Stack */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Upper Metrics: Card.Content Implementation */}
            <motion.div variants={itemVariants} className="flex-1 flex flex-col">
              <Card className="bg-gray-900 border border-gray-800 rounded-[32px] p-6 text-white relative overflow-hidden flex-1 flex flex-col justify-center shadow-none group">
                <div className="absolute top-0 right-0 p-6 text-gray-800 opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-110">
                  <HeartFill className="w-36 h-36" />
                </div>
                {/* --- LATEST V3 HEROUI COMPONENT STRUCTURE --- */}
                <Card.Content className="p-0 space-y-4 relative z-10">
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
                </Card.Content>
              </Card>
            </motion.div>

            {/* Lower Contributors Stream */}
            <motion.div variants={itemVariants} className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                  <Persons className="text-gray-400 w-4 h-4" />
                  Recent Active Contributors
                </h4>
              </div>

              <div className="flex flex-col gap-3">
                {pulseData.recentDonors.map((donor) => (
                  <div key={donor.id} className="flex items-center justify-between text-xs border-b border-gray-50 pb-2.5 last:border-none last:pb-0">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={donor.name} className="w-7 h-7 text-[10px] font-bold bg-gray-100 text-gray-700 rounded-lg border border-gray-200" />
                      <div>
                        <div className="font-bold text-gray-800">{donor.name}</div>
                        <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-gray-300" /> {donor.location}
                        </div>
                      </div>
                    </div>
                    <Chip size="sm" variant="flat" color="danger" className="font-black text-[10px] h-5 rounded-md px-1.5">
                      Group {donor.bloodGroup}
                    </Chip>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}