import { SaveTypeDniOutputInterface } from "@interfaces/OutputInterfaces/Customer/SaveTypeDniOutputInterface";
import { BASE_URL_CUSTOMER_TYPEDNI } from "@package/config/ApiPath";
import { FetchData } from "@package/config/FetchData";
import { ReturnService } from "@package/config/ReturnService"
import { BASE_URL_LANGUAGE } from "@package/utils/Constants";
import i18n from "@package/utils/language/i18n"
import { getKeyApi } from "@package/utils/Utilities"



async function SaveTypeDni(ae_object: SaveTypeDniOutputInterface) {
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
        name: ae_object.name ?? '',
        alias: ae_object.alias ?? '',
        longitude: ae_object.longitude ?? 0,
        status: ae_object.status ?? null,
        idMethodValidation: ae_object.idMethodValidation ?? '',
        idUser: ae_object.idUser ?? '',
        dataType: ae_object.dataType ?? '',
      })
    }
    const data = await FetchData(BASE_URL_CUSTOMER_TYPEDNI, 'save', options)
  
    if (data.correct) {
      return data.object
    }
    return data
  }

  export { SaveTypeDni }