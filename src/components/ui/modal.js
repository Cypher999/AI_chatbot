"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
export const Header=function({className,children}){
    return (
        <div className={`border-b border-gray-700 p-3 flex flex-row justify-between ${className?className:""}`}>
            {children}
        </div>
    )
}

export const Body=function({className,children}){
    return (
        <div className={`max-h-96 p-3 overflow-auto flex flex-col ${className?className:""}`}>
            {children}
        </div>
    )
}
export const Footer=function({className,children}){
    return (
        <div className={`border-t border-gray-700 p-3 ${className?className:""}`}>
            {children}
        </div>
    )
}
export const Modal=function ({show,children}) {
  return (
    <AnimatePresence>
        {show && (
          <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/75 z-50"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
        >
            <motion.div
                className="bg-gray-800 text-white rounded-lg shadow-lg w-96"
                initial={{ y: -350, opacity: 0, scale: 0.9 }} 
                animate={{ y: -100, opacity: 1, scale: 1 }} 
                exit={{ y: -350, opacity: 0, scale: 0.9 }} 
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  );
}