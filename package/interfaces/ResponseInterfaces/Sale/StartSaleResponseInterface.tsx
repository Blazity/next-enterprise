export interface TransactionObject {
    id: string;
    transactionNumber: string;
}

export interface StartSaleResponseInterface {
    correct: boolean;
    message: string;
    errorCode: number;
    object: TransactionObject | null;
}