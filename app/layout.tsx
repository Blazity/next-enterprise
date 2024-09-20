import "@package/styles/tailwind.css";
import Navbar from "@organisms/Navbar";
import React from "react";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
