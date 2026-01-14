import "./globals.css";

import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
  variable: "--font-geist", // nome della CSS variable
});

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
