import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="h-12 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-30">
      <span className="text-xl font-extrabold italic bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        MANGANAI
      </span>
      <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <a href="#" className="text-pink-600 border-b-2 border-pink-500 pb-0.5">
          Home
        </a>
        <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
          Dashboard
        </a>
        <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
          Reports
        </a>
        <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
          About
        </a>
      </div>
      <div className="relative">
        <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent w-40"
        />
      </div>
    </nav>
  );
}
