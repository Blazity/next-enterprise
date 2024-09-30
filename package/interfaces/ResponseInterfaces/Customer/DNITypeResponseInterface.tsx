export interface CustomerDniTypeResponseInterface {
    correct: boolean;
    message: string;
    errorCode: number;
    object: CustomerDniTypeObjectInterface;
  }
  
  export interface CustomerDniTypeObjectInterface {
    page: number;
    size: number;
    totalPage: number;
    list: CustomerDniTypeInterface[];
  }
  
  export interface CustomerDniTypeInterface {
    id: string;
    name: string;
    alias: string;
    longitude: string;
    status: boolean;
    idMethodValidation: string;
    nameMethodValidation: string;
    dataType: string | null;
    idUser: string;
    nameUser: string;
  }
  