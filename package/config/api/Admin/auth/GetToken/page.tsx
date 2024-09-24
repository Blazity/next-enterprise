import { auth } from "@package/config/api/Auth/page"
import { API_PASS_SERVICE, API_USER_TOKEN_SERVICE } from "@package/utils/Constants"

/**
 * Retrieves an authentication token using the provided user token service and password service.
 *
 * @returns {Promise<any>} The authentication token.
 * @throws {Error} If `API_USER_TOKEN_SERVICE` or `API_PASS_SERVICE` is undefined.
 */
export async function GetToken() {
    try {
      if (!API_USER_TOKEN_SERVICE || !API_PASS_SERVICE) {
        throw new Error("API_USER_TOKEN_SERVICE or API_PASS_SERVICE is undefined");
      }
      return await auth(API_USER_TOKEN_SERVICE, API_PASS_SERVICE)
    } catch (error) {
      console.error('error' + error)
    }
  }