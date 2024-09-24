import { ReturnService } from "@package/config/ReturnService"
import i18n from "@package/utils/language/i18n"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Fetches data from a specified endpoint and returns a `ReturnService` object.
 *
 * @template T - The type of the data expected from the API response.
 * @param {string} BASE_URL_MODULE - The base URL module to be appended to the base URL.
 * @param {string} endpoint - The specific API endpoint to fetch data from.
 * @param {RequestInit} [options={}] - Optional configuration for the fetch request.
 * @returns {Promise<ReturnService<T>>} A promise that resolves to a `ReturnService` object containing the fetched data.
 *
 * @throws {Error} If the fetch request fails or the response is not ok.
 */
async function FetchData<T>(
  BASE_URL_MODULE: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<ReturnService<T>> {
  
  const url = `${BASE_URL}${BASE_URL_MODULE}${endpoint}`
  const text = i18n.t("errorProcessingAPI") as string
  try {
    const response = await fetch(url, options)

    if (response.status === 403) {
      const text = i18n.t("inCorrectAccess") as string
      return new ReturnService<T>(null as unknown as T, false, text, 1)
    }

    if (!response.ok) {
      return new ReturnService<T>(null as unknown as T, false, text, 1)
    }

    const data = await response.json()
    return new ReturnService<T>(data as T)
  } catch (error: any) {
    return new ReturnService<T>(null as unknown as T, false, text || error.message, error.errorCode || 1)
  }
}

export { FetchData }