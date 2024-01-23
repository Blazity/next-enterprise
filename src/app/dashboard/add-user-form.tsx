"use client"

import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { FieldValues, useForm } from "react-hook-form"
import { addUser } from "src/lib/redux/features/userSlice"
import { useAppDispatch } from "src/lib/redux/hooks"

export default function AddUserForm() {
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm()

  const handleFormSubmit = async (data: FieldValues) => {
    reset()
    dispatch(addUser(data))
  }

  return (
    <>
      <Box sx={{ backgroundColor: "beige", padding: 2 }}>
        <Typography component="h1" variant="h5" align="center">
          Add User
        </Typography>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="branchId"
            label="Branch ID"
            autoFocus
            error={Boolean(errors.branchId)}
            helperText={errors.branchId && "Branch ID is required and should only be a number"}
            {...register("branchId", { pattern: /^\d+$/, required: true })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            error={Boolean(errors.username)}
            helperText={errors.username && "Username is required"}
            {...register("username", { required: true })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            error={Boolean(errors.firstName)}
            helperText={errors.firstName && "First Name is required"}
            {...register("firstName", { required: true })}
          />
          <TextField margin="normal" fullWidth id="middleName" label="Middle Name" {...register("middleName")} />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            error={Boolean(errors.lastName)}
            helperText={errors.lastName && "Last Name is required"}
            {...register("lastName", { required: true })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="position"
            label="Position"
            error={Boolean(errors.position)}
            helperText={errors.position && "Position is required"}
            {...register("position", { required: true })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            error={Boolean(errors.password)}
            helperText={errors.password && "Password is required with a minimum of 6 characters"}
            {...register("password", { required: true, minLength: 6 })}
          />
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              sx={{ mt: 3, mb: 2, mr: 3 }}
              onClick={() => {
                reset()
              }}
              color="secondary"
            >
              Reset
            </Button>
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Add
            </Button>
          </Box>
        </Box>
      </Box>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isSubmitting}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}
