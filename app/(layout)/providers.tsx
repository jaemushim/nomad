"use client"

import React, { PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { AuthContextProvider } from "../context/AuthContext"

const queryClient = new QueryClient()

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthContextProvider>
  )
}

export default Providers
