
export interface TaxInteface {
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

export interface SaleDetailInterface {
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
    taxes: TaxInteface[];
    active: boolean;
    weighable: boolean;
    extendedPrice: number;
}

export interface CustomerPromotionInterface {
    groupId: string;
    customerId: string;
    percentageDiscount: number | null;
}

export interface ItemPromotionInterface {
    index: number;
    code: string;
    quantity: number;
    unitPrice: number;
    attribute: string | null;
    promotionTrace: string | null;
    resultPercentDiscount: number | null;
    weighable: boolean;
}

export interface PromotionsInterface {
    customer: CustomerPromotionInterface;
    items: ItemPromotionInterface[];
    total: number;
    listPromotion: any[];
}

export interface SaleTransactionObjectInterface {
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
    list: SaleDetailInterface[];
    promotions: PromotionsInterface;
}

export interface GetSaleResponseInterface {
    correct: boolean;
    message: string | null;
    errorCode: number;
    object: SaleTransactionObjectInterface;
}
