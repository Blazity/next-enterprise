import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { CssBaseline } from "@mui/material"
import SessonProvider from "src/components/SessionProvider"
import StoreProvider from "src/components/StoreProvider"
import ThemeProvider from "src/components/ThemeProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <SessonProvider>
            <ThemeProvider>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </SessonProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
