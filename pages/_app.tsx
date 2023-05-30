import { useEffect } from "react"
import "../styles/tailwind.css"

import { AppProps } from "next/app"

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    console.log('hello!');
  }, []);

  return <Component {...pageProps} />
}

export default MyApp
