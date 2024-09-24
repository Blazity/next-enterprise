import { BASE_URL_ADMINISTRATION } from "@package/config/ApiPath";
import { FetchData } from "@package/config/FetchData";
import { GRID_SIZE } from "@package/utils/Constants";
import i18n from "@package/utils/language/i18n";
import { getKeyApi } from "@package/utils/Utilities";

interface AeObject {
  size: number | null;
  page: number | null;
  type?: string;
  idSubsidiary?: number;
  idCompany?: number;
  name?: string;
  email?: string;
  isActive?: boolean | null;
}

interface GetUsersResponse {
  correct: boolean;
  message: string;
  errorCode: number;
  object?: any;
}

async function GetUsers(ae_object: AeObject): Promise<GetUsersResponse> {
  const token = getKeyApi();
  if (!token) {
    return { correct: false, message: i18n.t('errorTokenAPI'), errorCode: 102, object: null };
  }

  if (ae_object.size === null || ae_object.size <= 0) {
    ae_object.size = GRID_SIZE;
  }
  if (ae_object.page === null || ae_object.page <= 0) {
    ae_object.page = 0;
  }

  const options = {
    method: 'post',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
      lng: i18n.language,
    },
    body: JSON.stringify({
      idType: ae_object.type ?? '',
      idSubsidiary: ae_object.idSubsidiary ?? 0,
      idCompany: ae_object.idCompany ?? 0,
      name: ae_object.name ?? '',
      mail: ae_object.email ?? '',
      isActive: ae_object.isActive ?? null,
      size: ae_object.size,
      page: ae_object.page,
    }),
  };

  // Llamada a FetchData
  const response = await FetchData<any>(BASE_URL_ADMINISTRATION, 'user/all', options);

  if (response.correct) {
    return {
      correct: true,
      message: "OK",
      errorCode: 0,
      object: response.object,
    };
  } else {
    return {
      correct: false,
      message: response.message,
      errorCode: response.errorCode,
      object: null,
    };
  }
}

export { GetUsers };
