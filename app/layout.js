import { Poppins } from "next/font/google";
import { CoreProvider } from "@/src/core/CoreProvider";
import { SidebarProvider } from "@/src/contexts/sidebarContext";
import './globals.css';
import '@fontsource/poppins';
import { Toaster } from 'react-hot-toast';
import '@madzadev/audio-player/dist/index.css'
import SideLayout from "@/src/layouts/SideLayout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata = {
  title: "Loudred",
  description: "Loudred es un reproductor de música en línea.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <CoreProvider>
        <SidebarProvider>
            <SideLayout> 
                {children}
              </SideLayout>
          </SidebarProvider>
        </CoreProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
