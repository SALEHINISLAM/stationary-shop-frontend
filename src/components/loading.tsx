import { CircularProgress } from '@mui/material';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] text-gray-800 animate-fade-in px-4">
      {/* Stylized Logo Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide mb-4 text-indigo-600 font-serif">
        Boi Khata
      </h1>

      {/* Tagline */}
      <p className="text-center text-sm sm:text-base text-gray-600 mb-10 max-w-md">
        Crafting your perfect stationery experience...
      </p>

      {/* Animated Spinner */}
      <CircularProgress size={48} thickness={4} color="primary" />

      {/* Subtle Footer Note */}
      <p className="mt-10 text-xs text-gray-400 italic">
        Please wait a moment ⏳
      </p>
    </div>
  );
};

export default LoadingScreen;
