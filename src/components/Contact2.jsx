import React from "react";
import avatar_1_BG from "../assets/avatar/avatar_1_BG.png";

const Contact = () => {
  return (
    <div
      className="absolute top-0 left-0 min-h-screen min-w-screen z-10 flex justify-center items-center bg-black/20 backdrop-blur-sm"
    >
      <div className="h-[320px] w-[520px] bg-white rounded-2xl shadow-xl flex p-6 gap-6 border border-gray-200">
        
        {/* Avatar Section */}
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-400"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-green-500"></div>

        <div className="flex flex-col items-center justify-center w-1/3">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-md border">
            <img
              src={avatar_1_BG}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="mt-4 px-4 py-1.5 text-xs font-medium bg-gray-100 rounded-full hover:bg-gray-200 transition">
            Message
          </button>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center w-2/3">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Product Designer
          </p>
          <h2 className="text-2xl font-bold mb-1">Charlsy Yang</h2>
          <a
            href="https://charlsy.design"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 text-sm hover:underline"
          >
            charlsy.design ↗
          </a>

          {/* Divider */}
          <div className="border-t border-gray-200 my-3"></div>

          {/* Social Links */}
          <div className="flex flex-col gap-2 text-gray-600 text-sm">
            <a
              href="https://twitter.com/imCharlsy"
              className="flex items-center gap-2 hover:text-blue-500 transition"
            >
              @imCharlsy
            </a>
            <a
              href="https://instagram.com/charlsyyang"
              className="flex items-center gap-2 hover:text-pink-500 transition"
            >
              @charlsyyang
            </a>
          </div>

          {/* Contact Button */}
          <button className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 w-fit transition">
            Contact Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
