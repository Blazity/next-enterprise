export interface CustomerResponseInterface {
  correct: boolean;
  message: string;
  errorCode: number;
  object: CustomerObjectInterface;
}

export interface CustomerObjectInterface {
  page: number;
  size: number;
  totalPage: number;
  list: CustomerInterface[];
}

export interface CustomerInterface {
  id?: string;
  idCompany?: string;
  companyName?: string;
  idSubsidiary?: number;
  nameSubsidiary?: string;
  externalClientId?: string | null;
  name?: string;
  secondName?: string;
  firstSurname?: string;
  secondSurname?: string;
  idTypeCustomer: string;
  nameTypeCustomer?: string;
  dni: string;
  idGender?: string;
  nameGender?: string;
  idMaritalStatus?: string | null;
  nameMaritalStatus?: string | null;
  address: string;
  idCity?: string | null;
  nameCity?: string | null;
  idCountry?: string | null;
  nameCountry?: string | null;
  mail: string;
  phone: string;
  idUser?: string;
  nameUser?: string;
  status: boolean;
  birthdate?: string | null;
  group: any[];
  NameSurname?: string;
  SurnameName?: string;
}
