import Head from "next/head"
import Header from "../components/headbar"
export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Learning bee</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>{children}</main>
    </>
  )
}
