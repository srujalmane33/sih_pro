import { User, Globe, Share2, Mail } from "lucide-react";

export default function ProfileBanner() {
  return (
    <div className="relative h-28 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shrink-0 flex items-center px-8">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/50 flex items-center justify-center overflow-hidden shrink-0">
        <User className="w-12 h-12 text-white/70" />
      </div>
      <div className="ml-5">
        <h1 className="text-xl font-bold text-white">MOIL Operations</h1>
        <p className="text-sm text-pink-100">Lead Mining Intelligence Console</p>
      </div>
      <div className="ml-auto flex items-center space-x-3">
        <Globe className="w-5 h-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
        <Share2 className="w-5 h-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
        <Mail className="w-5 h-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
        <button className="ml-3 px-4 py-1.5 text-xs font-semibold border border-white/60 text-white rounded hover:bg-white/10 transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
