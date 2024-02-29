export const storeobjlocal = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getobjlocal = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

export const storelocal = (key, value) => {
  localStorage.setItem(key, value)
}

export const getlocal = (key) => {
  return localStorage.getItem(key)
}

export const localkeys = {
  access_token: "",
  refresh_token: "",
  user: { customer: {}, worker: {} },
  settings: {},
}

export const stateobj = {
  user: {},
}

/**
 * what are the filter options -
 * 1 place  ==>  filter_place
 * 2 price range
 * 3 location
 * 4 distance
 * 5 tags
 * 6 categories
 * 7 sub categories
 */

/**
 * user infos -
 * 1 access_token
 * 2 refresh_token
 * 3 user_data -> json -> (user_key) ->
 */

/**
 * single page data -
 * items
 * bookings
 * bookingreqs
 */
