import { EndSaleOutputInterface } from "@interfaces/OutputInterfaces/Sale/EndSaleOutputInterface";
import { EndSaleResponseInterface } from "@interfaces/ResponseInterfaces/Sale/EndSaleResponseInterface";
import { BASE_URL_SALE } from "@package/config/ApiPath";
import { FetchData } from "@package/config/FetchData";
import { ReturnService } from "@package/config/ReturnService"
import { BASE_URL_LANGUAGE } from "@utils/Constants"
import i18n from "@utils/language/i18n";
import { getKeyApi } from "@utils/Utilities"


async function EndSale(ae_object: EndSaleOutputInterface) {
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
          lng: BASE_URL_LANGUAGE,
        },
        body: JSON.stringify({
          idTransaction: ae_object.idTransaction ?? '',
          storeNumber: ae_object.storeNumber ?? '',
          idSubsidiary: ae_object.idSubsidiary ?? 0,
          idUser: ae_object.idUser ?? '',
          localDate: ae_object.localDate ?? '',
          pos: ae_object.pos ?? '',
          comment: ae_object.comment ?? '',
          payment: ae_object.payment.map((item) => ({
            type: item.type ?? '',
            approvalCode: item.approvalCode ?? '',
            receiptNumber: item.receiptNumber ?? '',
            value: item.value ?? 0,
            cardNumber: item.cardNumber ?? '',
            cardType: item.cardType ?? '',
            comment: item.comment ?? '',
          })),
          infoPos: {
            addressPos: ae_object.infoPos.addressPos ?? '',
            codeMunPos: ae_object.infoPos.codeMunPos ?? '',
            nameMunPos: ae_object.infoPos.nameMunPos ?? '',
            codeDepPos: ae_object.infoPos.codeDepPos ?? '',
            nameDepPos: ae_object.infoPos.nameDepPos ?? '',
            pos: ae_object.infoPos.pos ?? '',
          },
        }),
      };

    let data : EndSaleResponseInterface = await FetchData(BASE_URL_SALE, 'endSale', options)

    if (data.correct) {
        return data.object
    }

    return data
}


export default EndSale