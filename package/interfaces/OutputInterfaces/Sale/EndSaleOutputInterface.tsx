export interface Payment {
    type: string;
    approvalCode: string;
    receiptNumber: string;
    value: number;
    cardNumber: string;
    cardType: string;
    comment: string;
  }

  export interface InfoPos {
    addressPos: string;
    codeMunPos: string;
    nameMunPos: string;
    codeDepPos: string;
    nameDepPos: string;
    pos: string;
  }
  
  export interface EndSaleOutputInterface {
    idTransaction: string;
    storeNumber: string;
    idSubsidiary: number;
    idUser: string;
    localDate: string;
    pos: string;
    comment: string;
    payment: Payment[];
    infoPos: InfoPos;
  }