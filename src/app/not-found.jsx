import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 gap-8">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes drip {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-drip { animation: drip 2s ease-in-out infinite; }
        .animate-drip-delay { animation: drip 2s ease-in-out 0.6s infinite; }
        .animate-drip-delay-2 { animation: drip 2s ease-in-out 1.2s infinite; }
      `}</style>

      {/* Top accent line */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-red-600 to-red-400" />

      {/* 404 with blood drops */}
      <div className="flex items-center justify-center gap-2 select-none">
        {/* 4 */}
        <span className="text-8xl md:text-9xl font-black text-gray-800 leading-none">
          4
        </span>

        {/* Blood drop O */}
        <div className="relative flex items-center justify-center animate-float">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 100"
            className="w-20 h-24 md:w-24 md:h-28 drop-shadow-lg"
          >
            {/* Big blood drop as the 0 */}
            <path
              d="M40 5 C40 5 8 45 8 65 a32 32 0 0 0 64 0 C72 45 40 5 40 5z"
              fill="#dc2626"
            />
            {/* Shine */}
            <ellipse
              cx="30"
              cy="55"
              rx="6"
              ry="10"
              fill="white"
              opacity="0.2"
            />
          </svg>

          {/* Dripping drops */}
          <span className="absolute -bottom-3 left-6">
            <svg viewBox="0 0 10 14" className="w-2 h-3 animate-drip">
              <path
                d="M5 0 C5 0 1 6 1 9 a4 4 0 008 0 C9 6 5 0 5 0z"
                fill="#dc2626"
                opacity="0.5"
              />
            </svg>
          </span>
          <span className="absolute -bottom-3 left-1/2">
            <svg viewBox="0 0 10 14" className="w-1.5 h-2.5 animate-drip-delay">
              <path
                d="M5 0 C5 0 1 6 1 9 a4 4 0 008 0 C9 6 5 0 5 0z"
                fill="#dc2626"
                opacity="0.4"
              />
            </svg>
          </span>
          <span className="absolute -bottom-3 right-6">
            <svg viewBox="0 0 10 14" className="w-2 h-3 animate-drip-delay-2">
              <path
                d="M5 0 C5 0 1 6 1 9 a4 4 0 008 0 C9 6 5 0 5 0z"
                fill="#dc2626"
                opacity="0.5"
              />
            </svg>
          </span>
        </div>

        {/* 4 */}
        <span className="text-8xl md:text-9xl font-black text-gray-800 leading-none">
          4
        </span>
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-2 text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-800">Page Not Found</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist or may have
          been moved. But every drop counts —{" "}
          <span className="text-red-600 font-semibold">BloodSync</span> is still
          here to help you save lives.
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px bg-red-100" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#fca5a5"
          className="w-4 h-4"
        >
          <path d="M12 2C12 2 4 10.5 4 15.5a8 8 0 0016 0C20 10.5 12 2 12 2z" />
        </svg>
        <div className="flex-1 h-px bg-red-100" />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm text-center"
        >
          Back to Home
        </Link>
        <Link
          href="/donation-requests"
          className="w-full sm:w-auto px-6 py-2.5 border border-red-200 hover:border-red-400 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg transition-colors duration-200 text-center"
        >
          View Donation Requests
        </Link>
      </div>

      {/* Bottom tagline */}
      <p className="text-xs text-gray-300 tracking-widest uppercase">
        BloodSync · Saving Lives Together
      </p>

      {/* Fixed bottom accent */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-red-600 to-red-400" />
    </div>
  );
}
