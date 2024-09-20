import {
  ArgentinaDocuments,
  BrazilDocuments,
  ChileDocuments,
  ColombiaDocuments,
  CostaRicaDocuments,
  EcuadorDocuments,
  MexicoDocuments,
  PeruDocuments,
  SpainDocuments,
  USADocuments,
} from "@package/utils/enums/TypesDocumentsByCountry"

const country = process.env.NEXT_PUBLIC_STORE_COUNTRY

export const getDocumentsByCountry = (): string[] => {
  switch (country?.toLowerCase()) {
    case "colombia":
      return Object.values(ColombiaDocuments)
    case "ecuador":
      return Object.values(EcuadorDocuments)
    case "costarica":
      return Object.values(CostaRicaDocuments)
    case "chile":
      return Object.values(ChileDocuments)
    case "mexico":
      return Object.values(MexicoDocuments)
    case "usa":
      return Object.values(USADocuments)
    case "peru":
      return Object.values(PeruDocuments)
    case "argentina":
      return Object.values(ArgentinaDocuments)
    case "brazil":
      return Object.values(BrazilDocuments)
    case "spain":
      return Object.values(SpainDocuments)
    default:
      return []
  }
}
