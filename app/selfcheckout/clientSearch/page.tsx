'use client';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import Button from '@atoms/Button';
import CustomLoading from '@atoms/CustomLoading';
import Icon from '@atoms/Icon';
import Input from '@atoms/Input';
import Label from '@atoms/Label';
import CustomerAtom from '@atoms/states/CustomerAtom';
import Title from '@atoms/Title';
import { Tooltip } from '@atoms/Tooltip';
import { useClientSearchLogic } from '@hooks/useClientSearchLogic';
import { CustomerDniTypeInterface } from '@interfaces/ResponseInterfaces/Customer/DNITypeResponseInterface';

const ClientSearch: React.FC = () => {
  const {
    idTypes,
    loading,
    error,
    result,
    formData,
    handleInputChange,
    handleSubmitForm,
    isAffiliated,
  } = useClientSearchLogic();
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const setCustomer = useSetAtom(CustomerAtom);
  const router = useRouter();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUseGenericCustomer = () => {
    setCustomer({
      id: '',
      idCompany: 'default-company',
      companyName: 'default-company-name',
      idSubsidiary: 0,
      nameSubsidiary: 'default-subsidiary',
      externalClientId: null,
      name: 'Cliente',
      secondName: '',
      firstSurname: 'Generico',
      secondSurname: '',
      idTypeCustomer: 'Tarjeta de identidad',
      nameTypeCustomer: 'Tarjeta',
      dni: '222222222222',
      idGender: '',
      nameGender: '',
      idMaritalStatus: null,
      nameMaritalStatus: null,
      address: '',
      idCity: null,
      nameCity: null,
      idCountry: null,
      nameCountry: null,
      mail: '',
      phone: '',
      idUser: '',
      nameUser: '',
      status: true,
      birthdate: null,
      group: [],
      NameSurname: '',
      SurnameName: ''
    });

    router.push("/selfcheckout/checkout");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    handleSubmitForm(); // Ejecuta la función de búsqueda con los datos actuales
  };

  return (
    <Paper elevation={3} className="p-6 max-w-2xl mx-auto">
      <Title text={t("lbl_client_search")} size="h2" />

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Label htmlFor="idType" text={t("lbl_id_type")} />
            <select
              name="idType"
              value={formData.idType}
              onChange={handleInputChange}  // Asegura que el estado del input cambie
              className="w-full p-2 border rounded"
              disabled={loading}
            >
              <option value="">{t("lbl_selectid_type")}</option>
              {idTypes.length > 0 ? (
                idTypes.map((type: CustomerDniTypeInterface) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))
              ) : (
                <option disabled>{t("msj_loading_id_types")}</option>
              )}
            </select>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Label htmlFor="idNumber" text={t("lbl_id_number")} />
            <Input
              type="text"
              name="idNumber"
              placeholder={t("msj_enter_id_number")}
              value={formData.idNumber}
              onChange={handleInputChange}  // Actualiza el valor del input al escribir
              disabled={loading}
            />
          </Grid>
        </Grid>

        <div className="flex justify-end">
          <Tooltip explainer={t("mjs_search_for_client")} withArrow>
            <Button
              label={t("lbl_search")}
              variant="primary"
              type="submit"
              disabled={loading}
              startIcon={<Icon name="Search" />}
            />
          </Tooltip>
        </div>
      </form>

      {loading && (
        <div className="flex justify-center mt-4">
          <CustomLoading />
        </div>
      )}

      {error && (
        <Typography color="error" className="mt-4">
          {error}
        </Typography>
      )}

      {result.length === 0 && !isAffiliated && (
        <Paper elevation={2} className="mt-6 p-4">
          <Title text={t("msj_no_affiliate")} size="h3" />
          <Typography variant="body1" className="mt-2">
            {t("msj_choose_option_for_non_affiliate")}
          </Typography>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              label={t("lbl_use_generic_customer")}
              variant="primary"
              onClick={handleOpenDialog}
            />
            <Button
              label={t("lbl_create_new_customer")}
              variant="primary"
              onClick={() => {
                // Lógica para crear nuevo cliente
              }}
            />
          </div>
        </Paper>
      )}

      {result.length > 0 && (
        <Paper elevation={2} className="mt-6 p-4">
          <Title text={t("lbl_search_result")} size="h3" />
          {result.map((customer) => (
            <Grid container spacing={2} className="mt-2" key={customer.id}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body1">
                  <strong>{t("lbl_name")}:</strong> {customer.name}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body1">
                  <strong>{t("lbl_last_name")}:</strong> {customer.firstSurname}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body1">
                  <strong>{t("lbl_email")}:</strong> {customer.mail}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body1">
                  <strong>{t("lbl_phone")}:</strong> {customer.phone}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1">
                  <strong>{t("lbl_address")}:</strong> {customer.address}
                </Typography>
              </Grid>
            </Grid>
          ))}
          <div className="flex justify-end mt-4">
            <Button
              label={t("lbl_continue")}
              variant="primary"
              onClick={() => {
                router.push("/selfcheckout/checkout");
              }}
            />
          </div>
        </Paper>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          {t("msj_confirm_generic_customer")}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <DialogContentText>
            {t("msj_are_you_sure_generic_customer")}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseDialog} label={t("lbl_cancel")} />
          <Button
            onClick={handleUseGenericCustomer}
            label={t("lbl_confirm")}
            variant="primary"
          />
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ClientSearch;
