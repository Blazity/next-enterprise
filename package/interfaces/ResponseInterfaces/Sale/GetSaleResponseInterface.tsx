
export interface Tax {
    id: string;
    idSaleDetail: string;
    idProduct: string;
    idTax: string;
    name: string;
    alias: string;
    percent: number;
    totalPriceBeforeTaxes: number;
    taxValue: number;
    taxUnitValue: number | null;
    taxIncluded: boolean;
}

export interface SaleDetail {
    idDetail: string;
    idTransaction: string;
    id: string;
    itemIdentifier: string;
    name: string;
    unitMeasurement: string;
    idDepartment: string | null;
    departmentNumber: string | null;
    description: string;
    quantity: number;
    weight: number | null;
    regularUnitPrice: number;
    originalUnitPrice: number;
    discount: number;
    totalTaxes: number;
    taxableFlag: boolean;
    restrictedAge: number;
    idSaleState: number;
    idUser: string;
    creation: string;
    lastUpdate: string;
    taxes: Tax[];
    active: boolean;
    weighable: boolean;
    extendedPrice: number;
}

export interface CustomerPromotion {
    groupId: string;
    customerId: string;
    percentageDiscount: number | null;
}

export interface ItemPromotion {
    index: number;
    code: string;
    quantity: number;
    unitPrice: number;
    attribute: string | null;
    promotionTrace: string | null;
    resultPercentDiscount: number | null;
    weighable: boolean;
}

export interface Promotions {
    customer: CustomerPromotion;
    items: ItemPromotion[];
    total: number;
    listPromotion: any[]; // Assuming this is an empty array, can adjust if more data is provided
}

export interface SaleTransactionObject {
    id: string;
    idCompany: string;
    idSubsidiary: number;
    transactionNumber: string;
    idClient: string;
    clientName: string;
    clientDni: string;
    idType: string;
    totalSale: number;
    totalTaxes: number;
    totalWithPromotion: number;
    idGroup: string;
    group: string;
    invoiceCode: string | null;
    invoiceName: string;
    invoiceTypeDni: string;
    invoiceDni: string;
    invoiceDirection: string;
    invoiceCellPhone: string;
    invoiceEmail: string;
    idUser: string;
    idSaleState: number;
    numberStore: string;
    pos: string;
    posLocalTimeStart: string;
    posLocalTimeEnd: string | null;
    localDateTime: string | null;
    creation: string;
    lastUpdate: string;
    list: SaleDetail[];
    promotions: Promotions;
}

export interface GetSaleResponseInterface {
    correct: boolean;
    message: string | null;
    errorCode: number;
    object: SaleTransactionObject;
}
