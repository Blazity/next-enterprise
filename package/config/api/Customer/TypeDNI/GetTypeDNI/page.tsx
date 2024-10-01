import { GetTypeDNIOutputInterface } from "@interfaces/OutputInterfaces/Customer/GetTypeDNIOutputInterface";
import { CustomerDniTypeResponseInterface } from "@interfaces/ResponseInterfaces/Customer/DNITypeResponseInterface";
import { BASE_URL_CUSTOMER_TYPEDNI } from "@package/config/ApiPath";
import { FetchData } from "@package/config/FetchData";
import { ReturnService } from "@package/config/ReturnService"
import { BASE_URL_LANGUAGE } from "@package/utils/Constants";
import i18n from "@package/utils/language/i18n";
import { getKeyApi } from "@package/utils/Utilities"


async function GetTypeDni(ae_object: GetTypeDNIOutputInterface) {
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
        longitude: ae_object.longitude ?? '',
        status: ae_object.status ?? null,
        idMethodValidation: ae_object.idMethodValidation ?? '',
        nameMethodValidation: ae_object.nameMethodValidation ?? '',
        idUser: ae_object.idUser ?? '',
        dataType: ae_object.dataType ?? '',
        size: ae_object.size ?? 1000,
        page: ae_object.page ?? 0
      })
    }
  
    const data: CustomerDniTypeResponseInterface = await FetchData(BASE_URL_CUSTOMER_TYPEDNI, 'all', options)
  
    if (data.correct) {
      return data.object
    }
  
    return data
  }

  export { GetTypeDni }