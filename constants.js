//here we can define all the things that we can keep in the cache database and remove it after some time

//getting the type of endpoint at one point
export const geturlFormdata = (data, reqtype, queryoptions, formdataoptions) => {
  var rooturl = "https://api.smorentel.com/"
  var allurl = rooturl + `${data}/${reqtype}?`

  var queryparam = new String()

  for (const property in queryoptions) {
    queryparam += `${property}=${queryoptions[property]}&`
  }

  var formdata = new FormData()
  for (const formproperty in formdataoptions) {
    formdata.set(formproperty, formdataoptions[formproperty])
  }

  return { url: allurl + queryparam.slice(0, queryparam.length - 1), formdata: formdata }
}

export const workstatus_dict = { 1: "progress", 2: "created", 3: "done" }

export const onRefresh = (authContext) => {
  try {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("refresh_token") != undefined) {
        authContext.login()
      }
    } else {
      authContext.login()
    }
  } catch (e) {
    console.log(e)
  }
}
