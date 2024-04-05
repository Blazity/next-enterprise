import "styles/tailwind.css"
import "styles/custom.css"
import Navbar from "components/Navbar/Navbar"
import StarBackground from "components/StarBackground/StarBackground";
import Footer from "components/Footer/Footer"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0f172a] ">
        <Navbar logoSrc="/images/image-removebg-preview (1).png" />
        {children}
        <Footer />
      </body>
    </html>
  )
}
