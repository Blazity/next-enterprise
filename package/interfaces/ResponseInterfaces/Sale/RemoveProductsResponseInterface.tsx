// interfaces/ProductDetails.ts

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

export interface ProductObject {
    id: string;
    itemIdentifier: string;
    regularUnitPrice: number;
    totalTaxes: number;
    extendedPrice: number;
    name: string;
    idDepartment: string | null;
    departmentNumber: string | null;
    description: string;
    longDescription: string;
    quantity: number;
    restrictedAge: number;
    taxableFlag: boolean;
    weight: number | null;
    taxes: Tax[];
    weighable: boolean;
}

export interface RemoveProductsResponseInterface {
    correct: boolean;
    message: string | null;
    errorCode: number;
    object: ProductObject;
}
