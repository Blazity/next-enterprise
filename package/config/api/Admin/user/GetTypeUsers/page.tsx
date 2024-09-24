import { BASE_URL_ADMINISTRATION } from "@package/config/ApiPath"
import { FetchData } from "@package/config/FetchData"
import { ReturnService } from "@package/config/ReturnService"
import { GRID_SIZE } from "@package/utils/Constants"
import i18n from "@package/utils/language/i18n"
import { getKeyApi } from "@package/utils/Utilities"

const BASE_URL_LANGUAGE = i18n.language

interface AeObject {
  id?: string;
  name?: string;
  idCompany?: string;
  idSubsidiary?: number;
  isActive?: boolean;
  size?: number;
  page?: number;
}

/**
 * Fetches a list of user types from the administration API.
 *
 * @param {AeObject} ae_object - The object containing parameters for the request.
 * @param {string} ae_object.id - The ID of the user type (optional).
 * @param {string} ae_object.name - The name of the user type (optional).
 * @param {string} ae_object.idCompany - The ID of the company (optional).
 * @param {string} ae_object.idSubsidiary - The ID of the subsidiary (optional).
 * @param {boolean} ae_object.isActive - The active status of the user type (optional, defaults to true).
 * @param {number} ae_object.size - The number of items per page (optional, defaults to GRID_SIZE).
 * @param {number} ae_object.page - The page number (optional, defaults to 0).
 * @returns {Promise<ReturnService>} A promise that resolves to a ReturnService object containing the result of the API call.
 */
async function GetTypeUsers(ae_object: AeObject): Promise<ReturnService<any>> {
    const token = getKeyApi()
    if (token === '') {
      return new ReturnService('', false, i18n.t('errorTokenAPI'), 102)
    }
  
    if (ae_object.size == null || ae_object.size <= 0) {
      ae_object.size = GRID_SIZE
    }
    if (ae_object.page == null || ae_object.page <= 0) {
      ae_object.page = 0
    }
  
    const options = {
      method: 'post',
      mode: 'cors' as RequestMode,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        lng: BASE_URL_LANGUAGE
      },
      body: JSON.stringify({
        id: ae_object.id ?? '',
        name: ae_object.name ?? '',
        idCompany: ae_object.idCompany ?? '',
        idSubsidiary: ae_object.idSubsidiary ?? 0,
        isActive: ae_object.isActive ?? true,
        size: ae_object.size,
        page: ae_object.page
      })
    }
  
    const data = await FetchData(BASE_URL_ADMINISTRATION, 'type-user/all', options)
  
    let result = data;
    if (data.correct) {
      result = data.object as ReturnService<unknown>
    }
  
    return result
  }
  
  export { GetTypeUsers }