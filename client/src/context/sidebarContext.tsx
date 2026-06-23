"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const defaultValue: SidebarContextType = {
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
};

const SidebarContext = createContext<SidebarContextType>(defaultValue);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);