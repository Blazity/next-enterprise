"use client"

import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Avatar from "@mui/material/Avatar"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { useSession } from "src/components/SessionProvider"
import { authenticate } from "src/lib/authentication/authenticate"

export default function LoginPage() {
  const { session, setSession } = useSession()
  const router = useRouter()
  const [apiError, setApiError] = useState<string>("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  const handleFormSubmit = async (data: FieldValues) => {
    try {
      const user = await authenticate(data)
      if (user) {
        setSession(user)
        router.push("/dashboard")
        return
      }
      setApiError("Invalid credentials. Please Try again.")
    } catch (err) {
      setApiError("Unexpected error. Please Try again.")
    }
  }

  return (
    <>
      {!session?.username && (
        <Container component="main" maxWidth="xs" sx={{ backgroundColor: "beige" }}>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 1 }} data-test>
              <TextField
                margin="normal"
                required
                fullWidth
                id="branchId"
                label="Branch ID"
                autoFocus
                inputProps={{ "data-testid": "branchId" }}
                error={Boolean(errors.branchId)}
                helperText={errors.branchId && "Branch ID is required and should only be a number"}
                {...register("branchId", { required: true, pattern: /^\d+$/ })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                inputProps={{ "data-testid": "username" }}
                error={Boolean(errors.username)}
                helperText={errors.username && "Username is required"}
                {...register("username", { required: true })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                inputProps={{ "data-testid": "password" }}
                error={Boolean(errors.password)}
                helperText={errors.password && "Password is required"}
                {...register("password", { required: true })}
              />
              <Typography sx={{ mt: 2, ml: 0.5, color: "red" }}>{apiError}</Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => setApiError("")}
                data-testid="loginButton"
              >
                Login
              </Button>
              <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isSubmitting}>
                <CircularProgress color="inherit" />
              </Backdrop>
            </Box>
          </Box>
        </Container>
      )}
    </>
  )
}
