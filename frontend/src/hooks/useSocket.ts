"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ?? "http://localhost:5000";

let _socket: Socket | null = null;

export function getSocket(token: string): Socket {
  if (!_socket) {
    _socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
    });
  }
  return _socket;
}

export function disconnectSocket(): void {
  if (_socket) {
    _socket.disconnect();
    _socket = null;
  }
}

export function useSocket(token: string | null) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;
    socketRef.current = getSocket(token);

    return () => {
      // Don't disconnect on component unmount — keep singleton alive
    };
  }, [token]);

  return socketRef.current;
}
