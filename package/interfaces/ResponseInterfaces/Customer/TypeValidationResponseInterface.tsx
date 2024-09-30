export interface CustomerTypeValidationResponseInterface {
    correct: boolean;
    message: string;
    errorCode: number;
    object: CustomerTypeValidationObjectInterface;
  }

  export interface CustomerTypeValidationObjectInterface {
    page: number;
    size: number;
    totalPage: number;
    list: CustomerTypeValidationInterface[];
  }
  
  export interface CustomerTypeValidationInterface {
    id: string;
    idCountry: string;
    nameCountry: string;
    name: string;
    alias: string;
    status: boolean;
    idUser: string;
    nameUser: string;
  }
  