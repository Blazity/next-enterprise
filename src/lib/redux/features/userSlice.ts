import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userList: [
      {
        branchId: 10001,
        username: "testuser01",
        password: "pa55w0rd001",
        firstName: "John",
        middleName: "Sanchez",
        lastName: "Doe",
        position: "Developer",
      },
      {
        branchId: 10002,
        username: "testuser02",
        password: "pa55w0rd002",
        firstName: "Ricardo",
        middleName: "Dubov",
        lastName: "Martinez",
        position: "Lead Developer",
      },
      {
        branchId: 10003,
        username: "testuser03",
        password: "pa55w0rd003",
        firstName: "Gol",
        middleName: "Denver",
        lastName: "Roger",
        position: "Project Manager",
      },
    ],
  },
  reducers: {
    addUser: (state, action) => {
      state.userList.push(action.payload)
    },
    removeUser: (state, action) => {
      const { branchId, username } = action.payload
      state.userList = state.userList.filter(
        (account) => account.username !== username && account.branchId !== branchId
      )
    },
  },
})

export const { addUser, removeUser } = userSlice.actions

export default userSlice.reducer
