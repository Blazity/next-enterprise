"use client"

import { Typography } from "@mui/material"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import { useRouter } from "next/navigation"
import { useSession } from "src/components/SessionProvider"
import AddUserForm from "./add-user-form"
import UserTable from "./user-table"

export default function Dashboard() {
  const { session, setSession } = useSession()
  const router = useRouter()
  if (!session) {
    router.push("/login")
  }

  return (
    <>
      {session?.username ? (
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 10, mt: 4 }}>
            <Typography variant="h3">{session?.username}</Typography>
            <Button
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                setSession(undefined)
              }}
            >
              Logout
            </Button>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <AddUserForm />
            </Grid>
            <Grid item xs={8}>
              <UserTable />
            </Grid>
          </Grid>
        </Container>
      ) : (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  )
}
