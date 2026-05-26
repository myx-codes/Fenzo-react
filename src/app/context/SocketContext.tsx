import React, { createContext } from "react";
import { io, Socket } from "socket.io-client";
import { getApiBaseUrl } from "../../lib/config";

const socket = io(getApiBaseUrl() || undefined, {
  withCredentials: true,
});

export const SocketContext = createContext<Socket>(socket);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};