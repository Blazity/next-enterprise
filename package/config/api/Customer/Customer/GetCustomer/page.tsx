import { GetCustomerOutputInterface } from "@interfaces/OutputInterfaces/Customer/GetCustomerOutputInterface";
import { CustomerResponseInterface } from "@interfaces/ResponseInterfaces/Customer/CustomerResponseInterface";
import { BASE_URL_CUSTOMER } from "@package/config/ApiPath";
import { FetchData } from "@package/config/FetchData";
import { ReturnService } from "@package/config/ReturnService"
import { BASE_URL_LANGUAGE } from "@package/utils/Constants";
import i18n from "@package/utils/language/i18n"
import { getKeyApi } from "@package/utils/Utilities"

async function GetCustomer(ae_object: GetCustomerOutputInterface)  {
    const token = getKeyApi()
    if (token === '') {
      return new ReturnService('', false, i18n.t('errorTokenAPI'), 102)
    }
  
    const options: RequestInit =  {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        lng: BASE_URL_LANGUAGE
      },
      body: JSON.stringify({
        id: ae_object.id ?? '',
        idCompany: ae_object.idCompany ?? '',
        idSubsidiary: ae_object.idSubsidiary ?? 0,
        name: ae_object.name ?? '',
        lastname: ae_object.lastname ?? '',
        idTypeCustomer: ae_object.idTypeCustomer ?? '',
        dni: ae_object.dni ?? '',
        idGender: ae_object.idGender ?? '',
        idMaritalStatus: ae_object.idMaritalStatus ?? '',
        address: ae_object.address ?? '',
        mail: ae_object.mail ?? '',
        phone: ae_object.phone ?? '',
        idUser: '',
        status: ae_object.status ?? null,
        size: ae_object.size ?? 1000,
        page: ae_object.page ?? 0
      })
    }
  
    const data: CustomerResponseInterface = await FetchData(BASE_URL_CUSTOMER, 'all', options)
  
    if (data.correct) {
      return data.object
    }
  
    return data
  }

  export { GetCustomer }