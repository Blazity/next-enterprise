"use client"
import Grid from "@mui/material/Grid2"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Button from "@package/components/atoms/Button"

const HomePage: React.FC = () => {
  const router = useRouter()

  const handleLoginClick = () => {
    router.push("/account/login")
  }

  const handleFeaturesClick = () => {
    router.push("/features")
  }

  return (
    <Grid
      container
      className="min-h-screen"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(to right, black, #2c3e50, #0064dc)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid size={{ xs: 12, md: 6 }} display="flex" justifyContent={{ xs: "center", md: "flex-end" }}>
        <Image
          src="/img/selfcheckout.jpg"
          alt="Checkout"
          width={500}
          height={400}
          style={{ width: 'auto', height: 'auto' }}
          className="rounded-lg shadow-lg"
          priority
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} textAlign={{ xs: "center", md: "left" }} padding={{ md: "0 24px" }}>
        <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">SELF CHECKOUT</h1>

        <p className="mb-6 text-xl text-gray-200 md:text-2xl">Mejorando la experiencia en tienda</p>

        <Grid container justifyContent={{ xs: "center", md: "flex-start" }} spacing={2}>
          <Grid size={{ xs: 6, md: 6 }}>
            <Button
              label="Iniciar Sesión"
              onClick={handleLoginClick}
              className="rounded-lg bg-blue-600 px-6 py-3 text-lg text-white transition hover:bg-blue-700"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 6 }}>
            <Button
              label="Ver Funcionalidades"
              onClick={handleFeaturesClick}
              className="rounded-lg bg-gray-200 px-6 py-3 text-lg text-blue-600 transition hover:bg-gray-300"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default HomePage
