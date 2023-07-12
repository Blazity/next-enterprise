import Head from "next/head"
import Footer from "../Footer/Footer"
import Navbar from "../Navbar/Navbar"

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta property="og:url" content="https://isacon.be" />
        <meta property="og:image" content="/Isacon logo RBG_1.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <title>IsaCon</title>
      </Head>
      <div className="flex h-screen flex-col justify-between">
        <Navbar />
        <main className="h-screen mb-auto bg-primary-50">{children}</main>
        <Footer />
      </div>
    </>
  )
}
