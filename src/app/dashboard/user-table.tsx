"use client"

import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { useSelector } from "react-redux"
import { removeUser } from "src/lib/redux/features/userSlice"
import { useAppDispatch } from "src/lib/redux/hooks"
import type { RootState } from "src/lib/redux/store"
import { TUser } from "../types/user"

export default function UserTable() {
  const dispatch = useAppDispatch()
  const users = useSelector((state: RootState) => state.users.userList || [])

  const getFullName = (user: TUser) => {
    return user.firstName + (user.middleName && " " + user.middleName) + " " + user.lastName
  }

  const handleRemoveUser = async (user: TUser) => {
    dispatch(removeUser(user))
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Branch ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, idx) => (
            <TableRow key={user.branchId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{user.branchId}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{getFullName(user)}</TableCell>
              <TableCell>{user.position}</TableCell>
              <TableCell>
                <Button onClick={() => handleRemoveUser(user)}>Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
