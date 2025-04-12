import React, { useState } from "react";
import { Book, History, Bookmark, Moon, Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ darkMode, toggleDarkMode, toggleHistory, toggleBookmarks }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={`sticky top-0 z-50 border-b ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"} transition-colors duration-300`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Book 
              size={36} 
              className={`transition-colors ${darkMode ? "text-purple-500" : "text-purple-600"}`} 
            />
            <h3 className="text-2xl font-semibold">
              Lexi<span className={`font-bold ${darkMode ? "text-purple-500" : "text-purple-600"}`}>AI</span>
            </h3>
          </motion.div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleHistory}
              className={`p-2 rounded-full transition-all ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              aria-label="Search history"
            >
              <History 
                size={28} 
                className={darkMode ? "text-gray-300" : "text-gray-600"} 
              />
            </button>
            
            <button
              onClick={toggleBookmarks}
              className={`p-2 rounded-full transition-all ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              aria-label="Saved bookmarks"
            >
              <Bookmark 
                size={28} 
                className={darkMode ? "text-gray-300" : "text-gray-600"} 
              />
            </button>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={28} className="text-yellow-300" />
              ) : (
                <Moon size={28} className="text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="space-y-2 px-4 pb-4 pt-2">
              <button
                onClick={() => {
                  toggleHistory();
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-base font-medium ${darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <History size={24} />
                Search History
              </button>
              
              <button
                onClick={() => {
                  toggleBookmarks();
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-base font-medium ${darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <Bookmark size={24} />
                Saved Bookmarks
              </button>
              
              <button
                onClick={() => {
                  toggleDarkMode();
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-base font-medium ${darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}
              >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;