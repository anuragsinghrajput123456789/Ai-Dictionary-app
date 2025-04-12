// import "./App.css";
// import Navbar from "./components/Navbar";
// import { Search } from "lucide-react";
// import { GoogleGenAI } from "@google/genai";
// import { useState } from "react";
// import RiseLoader from "react-spinners/ClipLoader";
// import Markdown from "react-markdown";
// import remarkGfm from "https://esm.sh/remark-gfm@4";
// import Footer from "./components/Footer";
// // const apiKey = import.meta.env.VITE_API_KEY;

// function App() {
//   const [word, setWord] = useState(""); // Initialize with an empty string
//   const [result, setResult] = useState("");
//   const [loading, setLoading] = useState(false);

//   const ai = new GoogleGenAI({
//     apiKey: import.meta.env.VITE_API_KEY,
//   });

//   const changeBgColor = () => {
//     let inputBox = document.querySelector(".inputBox");
//     inputBox.style.borderColor = "#9333ea";
//   };

//   const resetColor = () => {
//     let inputBox = document.querySelector(".inputBox");
//     inputBox.style.borderColor = "#374151";
//   };

//   async function run() {
//     setLoading(true);
//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: `Considered you are a dictionary AI. We will give you a word, and you need to give all the dictionary details in a good form, including examples, meanings, definitions, synonyms, phonetics, etc. The word is ${word}`,
//     });

//     // Filter the response (remove HTML tags or unwanted content)
//     let filteredResult = filterResponse(response.text);
//     setResult(filteredResult);  // Update the state with the filtered result
//     setLoading(false);
//   }

//   // Function to filter and clean the response
//   const filterResponse = (responseText) => {
//     // Example: Remove any HTML tags from the response
//     let cleanedText = responseText.replace(/<\/?[^>]+(>|$)/g, ""); // Regex to remove HTML tags

//     // Example: Remove any specific unwanted text, e.g., specific phrases or words
//     cleanedText = cleanedText.replace(/(Example|Synonyms|Phonetics)/g, "");

//     // You can add more custom filtering here based on your requirements
//     return cleanedText.trim();  // Trim to remove extra spaces
//   };

//   return (
//     <>
//       <Navbar/>
//       <div className="searchContainer mt-3 px-[250px]">
//         <div className="inputBox">
//           <Search color="gray" className="ml-3 cursor-pointer" />
//           <input
//             onKeyUp={(e) => {
//               if (e.key === "Enter") {
//                 run();
//               }
//             }}
//             onBlur={resetColor}
//             onFocus={changeBgColor}
//             onChange={(e) => {
//               setWord(e.target.value); // Update the state when user types
//             }}
//             type="text"
//             placeholder="Enter your word"
//             value={word} // The value should be controlled by the `word` state
//           />
//         </div>
//       </div>
//       <div
//         className="resultContainer py-[20px] mt-5 min-h-[40vh] mx-[250px]"
//         style={{
//           borderTop: "1px solid #374151",
//           borderBottom: "1px solid #374151",
//         }}
//       >
//         <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
//         {loading && <RiseLoader color="#9333ea" className="mt-5" />}
//       </div>
//       <Footer/>
//     </>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import {
  Search,
  X,
  History,
  Moon,
  Sun,
  Volume2,
  Bookmark,
  Copy,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import RiseLoader from "react-spinners/ClipLoader";
import Markdown from "react-markdown";
import remarkGfm from "https://esm.sh/remark-gfm@4";
import Footer from "./components/Footer";
import { AnimatePresence } from "framer-motion";
import { motion } from "motion/react";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [word, setWord] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_API_KEY,
  });

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("dictionaryHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("dictionaryHistory", JSON.stringify(history));
  }, [history]);

  const changeBgColor = () => {
    document.querySelector(".inputBox").style.borderColor = "#9333ea";
  };

  const resetColor = () => {
    document.querySelector(".inputBox").style.borderColor = darkMode
      ? "#374151"
      : "#e5e7eb";
  };

  const clearSearch = () => {
    setWord("");
    setResult("");
  };

  const speakWord = () => {
    if (word) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
    }
  };

  const saveToHistory = (word) => {
    if (!history.includes(word)) {
      setHistory([word, ...history].slice(0, 10));
    }
  };

  const getSuggestions = async (partialWord) => {
    if (partialWord.length > 2) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: `Give me 5 word suggestions that start with "${partialWord}" for a dictionary app. Return only a comma-separated list.`,
        });
        const suggestionsList = response.text.split(",").map((s) => s.trim());
        setSuggestions(suggestionsList);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  async function run() {
    if (!word.trim()) return;

    setLoading(true);
    saveToHistory(word);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Act as a comprehensive dictionary. For the word "${word}", provide:
        1. Phonetic pronunciation (with IPA if possible)
        2. Part of speech
        3. All definitions with clear numbering
        4. 2-3 examples per definition
        5. Synonyms (5-10)
        6. Antonyms (5-10)
        7. Etymology (brief)
        
        Format the response in clean Markdown with proper headings (## for sections).`,
      });

      setResult(response.text);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      setSuggestions([]);
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        toggleHistory={() => setShowHistory(!showHistory)}
        toggleBookmarks={() => setShowBookmarks(!showBookmarks)}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="searchContainer mb-8"
        >
          <div
            className={`inputBox flex items-center p-3 rounded-lg border-2 transition-all duration-300 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <Search className="ml-2 mr-3 text-gray-500" />
            <input
              onKeyUp={(e) => {
                if (e.key === "Enter") run();
                else getSuggestions(e.target.value);
              }}
              onBlur={resetColor}
              onFocus={changeBgColor}
              onChange={(e) => setWord(e.target.value)}
              type="text"
              placeholder="Enter a word..."
              value={word}
              className={`flex-1 bg-transparent outline-none ${
                darkMode ? "placeholder-gray-500" : "placeholder-gray-400"
              }`}
            />
            {word && (
              <button
                onClick={clearSearch}
                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={speakWord}
              disabled={!word}
              className="p-2 ml-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Volume2 size={18} />
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 ml-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <History size={18} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 ml-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-2 rounded-lg overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setWord(suggestion);
                      setSuggestions([]);
                    }}
                    className={`p-3 cursor-pointer hover:${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    } transition-colors border-b ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    {suggestion}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-6 rounded-lg overflow-hidden ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <div className="p-4 font-medium border-b flex justify-between items-center">
                <span>Search History</span>
                <button
                  onClick={() => setHistory([])}
                  className="text-sm text-purple-500 hover:text-purple-400"
                >
                  Clear All
                </button>
              </div>
              {history.length > 0 ? (
                history.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setWord(item);
                      setShowHistory(false);
                    }}
                    className={`p-3 cursor-pointer hover:${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    } transition-colors border-b ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    } flex justify-between`}
                  >
                    {item}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setHistory(history.filter((_, i) => i !== index));
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No history yet
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`resultContainer rounded-lg p-6 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border`}
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <RiseLoader color="#9333ea" size={30} />
            </div>
          ) : result ? (
            <>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-purple-500">{word}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={speakWord}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                    title="Pronounce"
                  >
                    <Volume2 size={18} />
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                    title="Copy"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                    title="Save"
                  >
                    <Bookmark size={18} />
                  </button>
                </div>
              </div>

              <div
                className={`markdown-content ${
                  darkMode ? "dark-markdown" : "light-markdown"
                }`}
              >
                <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Search size={48} className="mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-medium">Search for a word</h3>
              <p className="mt-2">
                Try words like "serendipity", "ephemeral", or "quintessential"
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
