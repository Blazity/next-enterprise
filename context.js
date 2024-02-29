import router from "next/router"
import { createContext } from "react"
import { getlocal, storelocal } from "./localstore"

export const AuthContext = createContext({
  isLoggedIn: true,
  accounttype: true,
  firebase: null,
  premium: false,
  modelopen: false,
  setModel: () => {},
  changeaccount: () => {
    accounttype = !accounttype
    storelocal("accounttype", accounttype)
  },
  checkType: async () => {
    var at = getlocal("accounttype")
    accounttype = at
  },
  login: () => {
    isLoggedIn = true
  },
  logout: () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("userdata")
    isLoggedIn = false
  },
})
