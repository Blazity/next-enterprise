import { AddProductsOutputInterface } from "@interfaces/OutputInterfaces/Sale/AddProductsOutputInterfae";
import { AddProductsResponseInterface } from "@interfaces/ResponseInterfaces/Sale/AddProductsResponseInterface";
import { BASE_URL_SALE } from "@package/config/ApiPath";
import { FetchData } from "@package/config/FetchData";
import { ReturnService } from "@package/config/ReturnService"
import { BASE_URL_LANGUAGE } from "@utils/Constants"
import i18n from "@utils/language/i18n";
import { getKeyApi } from "@utils/Utilities"


async function AddProducts(ae_object: AddProductsOutputInterface) {
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
            storeNumber: ae_object.storeNumber ?? '',
            idSubsidiary: ae_object.idSubsidiary ?? 0,
            clientNit: ae_object.clientNit ?? '',
            idUser: ae_object.idUser ?? '',
            localDate: ae_object.localDate ?? '',
            pos: ae_object.pos ?? '',
            products: ae_object.products.map(item => ({
                sku: item.sku ?? '',
                value: item.value ?? 0,
            })),
        })
    }

    let data: AddProductsResponseInterface = await FetchData(BASE_URL_SALE, 'addProducts', options)

    if (data.correct) {
        return data.object
    }

    return data
}


export default AddProducts