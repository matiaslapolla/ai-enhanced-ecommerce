import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AuthProvider } from "@/hooks/use-auth"
import { CartProvider } from "@/hooks/use-cart"
import { CurrencyProvider } from "@/components/multi-currency-selector"
import "./globals.css"

export const metadata: Metadata = {
  title: "EcoShop - Modern E-commerce Platform",
  description: "Shop with confidence using AI-powered search and personalized recommendations",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <CurrencyProvider>{children}</CurrencyProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
