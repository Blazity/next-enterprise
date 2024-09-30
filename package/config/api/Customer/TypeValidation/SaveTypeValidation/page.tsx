import { SaveTypeValidationOutputInterface } from "@interfaces/OutputInterfaces/Customer/SaveTypeValidationOutputInterface"
import { BASE_URL_CUSTOMER_VALIDATION } from "@package/config/ApiPath"
import { FetchData } from "@package/config/FetchData"
import { ReturnService } from "@package/config/ReturnService"
import { BASE_URL_LANGUAGE } from "@package/utils/Constants"
import i18n from "@package/utils/language/i18n"
import { getKeyApi } from "@package/utils/Utilities"


async function SaveTypeValidation(ae_object: SaveTypeValidationOutputInterface) {
    const token = getKeyApi()
    if (token === '') {
      return new ReturnService('', false, i18n.t('errorTokenAPI'), 102)
    }
  
    const options: RequestInit = {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        lng: BASE_URL_LANGUAGE
      },
      body: JSON.stringify({
        id: ae_object.id ?? '',
        idCountry: ae_object.idCountry ?? '',
        name: ae_object.name ?? '',
        alias: ae_object.alias ?? '',
        status: ae_object.status ?? null,
        idUser: ae_object.idUser ?? ''
      })
    }
    const data = await FetchData(BASE_URL_CUSTOMER_VALIDATION, 'save', options)
  
    if (data.correct) {
      return data.object
    }
  
    return data
  }

export { SaveTypeValidation }