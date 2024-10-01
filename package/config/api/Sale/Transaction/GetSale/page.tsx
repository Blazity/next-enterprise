import { GetSaleOutputInterface } from "@interfaces/OutputInterfaces/Sale/GetSaleOutputInterface";
import { GetSaleResponseInterface } from "@interfaces/ResponseInterfaces/Sale/GetSaleResponseInterface";
import { BASE_URL_SALE } from "@package/config/ApiPath";
import { FetchData } from "@package/config/FetchData";
import { ReturnService } from "@package/config/ReturnService"
import { BASE_URL_LANGUAGE } from "@utils/Constants"
import i18n from "@utils/language/i18n";
import { getKeyApi } from "@utils/Utilities"

async function GetSale(ae_object: GetSaleOutputInterface) {
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
            idTransaction: ae_object.idTransaction ?? '',
            storeNumber: ae_object.storeNumber ?? 0,
            idSubsidiary: ae_object.idSubsidiary ?? '',
            idUser: ae_object.idUser ?? '',
            pos: ae_object.pos ?? '',
        
        })
    }

    let data: GetSaleResponseInterface  = await FetchData(BASE_URL_SALE, 'getSale', options)

    if (data.correct) {
        return data.object
    }

    return data
}


export default GetSale