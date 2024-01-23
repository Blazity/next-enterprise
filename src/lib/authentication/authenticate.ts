import { FieldValues } from "react-hook-form"
import { delay } from "../delay"

export const users = [
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
]

export async function authenticate(fieldValues: FieldValues) {
  await delay(2000)
  const { branchId, username, password } = fieldValues
  const user = users.find(
    (account) =>
      String(account.username) === username &&
      String(account.password) === password &&
      String(account.branchId) === branchId
  )
  return user
}
