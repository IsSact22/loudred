import localFont from "next/font/local";
import { CoreProvider } from "@/src/core/CoreProvider";
import './globals.css';
import '@fontsource/poppins';
//libraries
import toast, { Toaster } from 'react-hot-toast';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Loudred",
  description: "Loudred es un reproductor de música en línea.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <CoreProvider>
        {children}
        <Toaster />
      </CoreProvider>
      </body>
    </html>

  );
}
