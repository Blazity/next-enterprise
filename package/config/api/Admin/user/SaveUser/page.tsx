import { BASE_URL_ADMINISTRATION } from "@package/config/ApiPath";
import { FetchData } from "@package/config/FetchData";
import { ReturnService } from "@package/config/ReturnService";
import { DEFAULT_PASSWORD } from "@package/utils/Constants";
import i18n from "@package/utils/language/i18n";
import { encrypt, getKeyApi } from "@package/utils/Utilities";

const BASE_URL_LANGUAGE = i18n.language

interface UserObject {
  id?: string;
  idSubsidiary?: number;
  idCompany?: number;
  name?: string;
  lastName?: string;
  email?: string;
  cellphone?: string;
  password?: string;
  type?: string;
  isActive?: boolean;
  isAdmin?: boolean;
}

async function SaveUser(ae_object: UserObject) {
    const token = getKeyApi()
    if (token === '') {
      return new ReturnService('', false, i18n.t('errorTokenAPI'), 102)
    }
  
    if ((ae_object.id ?? '').trim().length <= 0 && (ae_object.password ?? '').trim().length <= 0) {
      ae_object.password = DEFAULT_PASSWORD
    }
  
    if ((ae_object.password ?? '').trim().length > 0) {
      ae_object.password = encrypt(ae_object.password ?? '')
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
        id: (ae_object.id ?? '').trim(),
        idSubsidiary: ae_object.idSubsidiary ?? 0,
        idCompany: ae_object.idCompany ?? 0,
        name: ae_object.name ?? '',
        lastName: ae_object.lastName ?? '',
        email: ae_object.email ?? '',
        cellphone: ae_object.cellphone ?? '',
        password: ae_object.password ?? '',
        idTypeUser: ae_object.type ?? '',
        isActive: ae_object.isActive ?? false,
        isAdmin: ae_object.isAdmin ?? false
      })
    }
  
    const data = await FetchData(BASE_URL_ADMINISTRATION, 'user/save', options)
  
    let result = data;
    if (data.correct) {
      result = data.object as ReturnService<unknown>
    }

    return result
  }
  

  export { SaveUser }