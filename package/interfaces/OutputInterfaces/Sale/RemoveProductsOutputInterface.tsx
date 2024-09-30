export interface Product {
    sku: string;
    value: number;
}

export interface Transaction {
    idTransaction: string;
    storeNumber: string;
    idSubsidiary: number;
    clientNit: string;
    idUser: string;
    localDate: string; 
    pos: string;
    products: Product[];
}