"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
export default function ModalExample({show,setShow,setAgent}) {
    const handleAgent=function(agent){
        setAgent(agent)
        setShow(false);
    }
  return (
    <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/75"
            initial={{ opacity: 0 }} // Starts transparent
            animate={{ opacity: 1 }} // Fades in
            exit={{ opacity: 0 }} // Fades out
          >
            {/* Modal Content */}
            <motion.div
              className="bg-white text-gray-600 rounded-lg shadow-lg w-96"
              initial={{ y: -50, opacity: 0, scale: 0.9 }} // Starts slightly above and smaller
              animate={{ y: -40, opacity: 1, scale: 1 }} // Moves to the center
              exit={{ y: -50, opacity: 0, scale: 0.9 }} // Moves up again on exit
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="border-b border-gray-700 p-3 flex flex-row justify-between">
                <h2 className="text-lg font-bold">Choose AI Agent</h2>
                <button
                    onClick={() => setShow(false)}
                    className="px-4 bg-red-500 text-white rounded-lg"
                >
                    Close
                </button>
              </div>
              <div className="max-h-96 p-3 overflow-auto flex flex-col">
                <div type="button" onClick={()=>{handleAgent('jamal')}} className="rounded border p-2 my-2 border-gray-700 hover:bg-gray-200 cursor-pointer">
                    <div className="font-bold text-lg">
                        Jamal
                    </div>
                    <div className="text-sm">
                        this is the description
                    </div>
                </div>
                <div type="button" onClick={()=>{handleAgent('dobleh')}} className="rounded border p-2 my-2 border-gray-700 hover:bg-gray-200 cursor-pointer">
                    <div className="font-bold text-lg">
                        dobleh
                    </div>
                    <div className="text-sm">
                        this is the description
                    </div>
                </div>
                <div type="button" onClick={()=>{handleAgent('Kabur')}} className="rounded border p-2 my-2 border-gray-700 hover:bg-gray-200 cursor-pointer">
                    <div className="font-bold text-lg">
                        Kabur
                    </div>
                    <div className="text-sm">
                        this is the description
                    </div>
                </div>
              </div>
              <div className="border-t border-gray-700 p-3">
                <button
                    onClick={() => setShow(false)}
                    className="px-4 bg-red-500 text-white rounded-lg"
                >
                    Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  );
}