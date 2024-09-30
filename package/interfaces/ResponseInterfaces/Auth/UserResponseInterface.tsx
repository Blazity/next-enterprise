export interface UserResposeInterface {
    id: string;
    idSubsidiary: number;
    subsidiaryName: string;
    idCompany: string;
    companyName: string;
    name: string;
    lastName: string;
    email: string;
    cellphone: string;
    idTypeUser: string;
    typeName: string;
    isActive: boolean;
    isAdmin: boolean;
  }

export interface LoginResponse {
    correct?: boolean;
    message: string;
    errorCode?: number;
    object: UserResposeInterface | null;
  }

