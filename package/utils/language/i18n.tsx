import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', // Default language
    lng: 'en', // Specify the default language to use
    resources: {
      en: {
        translation: {
          lbl_wellcome: "Welcome",
          lbl_login: "Login",
          lbl_username: "Username",
          lbl_password: "Password",
          lbl_enter_PLU: "Enter PLU",
          lbl_transfer_order: "Transfer Order",
          lbl_resale: "Resale",
          lbl_add_receipt: "Add receipt",
          lbl_coupons : "Coupons",
          lbl_discount_percentage: "Discount percentage",
          lbl_amount_discount: "Amount discount",
          lbl_bag_credit: "Bag credit",
          lbl_bottle_refund: "Bottle refund",
          lbl_tax_exempt: "Tax exempt",
          lbl_item_inquiry: "Item Inquiry",
          lbl_Store: "Store",
          lbl_register: "Register",
          lbl_associate: "Associate",
          
          

          msj_resume_previously_suspended_order: "Resume a previously suspended order",
          msj_transfer_Order_another_station: "Transfer an order to another station",
          msj_generate_resale: "Generate a resale",
          msj_generate_refund: "Generate a refund",
          msj_add_receipt: "Add receipt",
          msj_manage_coupons: "Manage coupons",
          msj_manage_discount_percentage: "Manage discount percentage",
          msj_manage_amount_discount: "Manage amount discount",
          msj_bag_credit_management: "Credit bag management",
          msj_bottle_refund_management: "Bottle refund management",
          msj_tax_exemption_management: "Tax exemption management",
          msj_query_search_article: "Query or search for article",
          msj_enter_your_username: "Enter your username",
          msj_enter_your_password: "Enter your password",
          msj_Incorrect_credentials_try_again: "Incorrect credentials, try again",        
        },
      },
      es: {
        translation: {
          lbl_wellcome: "Bienvenido",
          lbl_login: "Iniciar sesión",
          lbl_username: "Nombre de usuario",
          lbl_password: "Contraseña",
          lbl_enter_PLU: "Ingrese PLU",
          lbl_transfer_order: "Transferir orden",
          lbl_resale: "Reventa",
          lbl_add_receipt: "Agregar recibo",
          lbl_coupons : "Cupones",
          lbl_discount_percentage: "Porcentaje de descuento",
          lbl_amount_discount: "Importe de descuento",
          lbl_bag_credit: "Bolsa de crédito",
          lbl_bottle_refund: "Devolución de botellas",
          lbl_tax_exempt: "Exento de impuestos",
          lbl_item_inquiry: "Consulta de artículo",
          lbl_Store: "Tienda",
          lbl_register: "Registro",
          lbl_associate: "Asociado",
          

          msj_resume_previously_suspended_order: "Reanuda una orden previamente suspendida",
          msj_transfer_Order_another_station: "Transfiere la orden a otra estación",
          msj_generate_resale: "Generar una reventa",
          msj_generate_refund: "Generar una devolución",
          msj_add_receipt: "Agregar recibo",
          msj_manage_coupons: "Administrar cupones",
          msj_manage_discount_percentage: "Administrar porcentaje de descuento",
          msj_manage_amount_discount: "Administrar importe de descuento",
          msj_bag_credit_management: "Gestión de bolsa de crédito",
          msj_bottle_refund_management: "Gestión de devolución de botellas",
          msj_tax_exemption_management: "Gestión de exención de impuestos",
          msj_query_search_article: "Consulta o búsqueda de artículo",
          msj_enter_your_username: "Ingrese su nombre de usuario",
          msj_enter_your_password: "Ingrese su contraseña",
          msj_Incorrect_credentials_try_again: "Credenciales incorrectas, inténtelo de nuevo",
          
        },
      },
    },
    interpolation: {
      escapeValue: false, // Not needed for React as it escapes by default
    },
  });

export default i18n;
