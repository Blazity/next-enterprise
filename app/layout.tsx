import React from "react";
import "@package/styles/tailwind.css";
import Navbar from "@organisms/Navbar";


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
