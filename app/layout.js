import { Poppins } from "next/font/google";
import { CoreProvider } from "@/src/core/CoreProvider";
import './globals.css';
import '@fontsource/poppins';
import { Toaster } from 'react-hot-toast';
import '@madzadev/audio-player/dist/index.css'

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
      <body
        className={`${poppins.className} antialiased`}
      >
        <CoreProvider>{children}</CoreProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
