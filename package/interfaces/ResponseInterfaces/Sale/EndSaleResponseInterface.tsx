export interface TransactionObject {
    StatusCV: boolean;
    QRCode: string;
    description: string;
    numFac: string;
    status: string;
    cufe: string;
}

export interface EndSaleResponseInterface {
    correct: boolean;
    message: string;
    errorCode: number;
    object: TransactionObject;
}