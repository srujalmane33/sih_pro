import { Search } from "lucide-react";

export default function Navbar({ activeTab = "home", onTabChange }) {
  const tabs = [
    { id: "home", label: "Home" },
    { id: "dashboard", label: "Dashboard" },
    { id: "reports", label: "Reports" },
    { id: "about", label: "About" },
  ];

  return (
    <nav className="h-12 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-30">
      <span
        onClick={() => onTabChange && onTabChange("home")}
        className="text-xl font-extrabold italic bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent cursor-pointer"
      >
        MANGANAI
      </span>
      <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange && onTabChange(tab.id)}
              className={`transition-colors py-1 ${
                isActive
                  ? "text-pink-600 border-b-2 border-pink-500 font-semibold"
                  : "text-gray-500 hover:text-pink-500"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="relative"></div>
    </nav>
  );
}

