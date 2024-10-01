"use client";

import { Box, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@atoms/Button';
import { storeNumberAtom, storePosAtom } from '@atoms/states/StoreAtom';
import { EndSaleOutputInterface } from '@interfaces/OutputInterfaces/Sale/EndSaleOutputInterface';
import { GetSaleOutputInterface } from '@interfaces/OutputInterfaces/Sale/GetSaleOutputInterface';
import { CustomerInterface } from '@interfaces/ResponseInterfaces/Customer/CustomerResponseInterface';
import { EndSaleResponseInterface } from '@interfaces/ResponseInterfaces/Sale/EndSaleResponseInterface';
import { GetSaleResponseInterface, SaleTransactionObjectInterface } from '@interfaces/ResponseInterfaces/Sale/GetSaleResponseInterface';
import { StartSaleResponseInterface } from '@interfaces/ResponseInterfaces/Sale/StartSaleResponseInterface';
import ClientSearch from '@organisms/Checkout/ClientSearch';
import ControlPanel from '@organisms/Checkout/ControlPanel';
import ProductTable from '@organisms/Checkout/ProductTable';
import EndSale from '@package/config/api/Sale/Transaction/EndSale/page';
import GetSale from '@package/config/api/Sale/Transaction/GetSale/page';
import { getUser } from '@utils/Utilities';

interface MainLayoutProps {
  onEndTransaction: () => void; // Callback para notificar cuando la transacción termine
}

const MainLayout: React.FC<MainLayoutProps> = ({ onEndTransaction }) => {
  const [transaction, setTransaction] = useState<StartSaleResponseInterface | null>(null);
  const [client, setClient] = useState<CustomerInterface | null>(null);
  const [productsList, setProductsList] = useState<SaleTransactionObjectInterface | null>(null);
  const [endSaleResponse, setEndSaleResponse] = useState<EndSaleResponseInterface | null>(null); 
  const [openDialog, setOpenDialog] = useState(false); 

  const [idUser] = useState(getUser() && getUser().id ? getUser().id : '');
  const { t } = useTranslation();

  const [storeNumber] = useAtom(storeNumberAtom);
  const [storePos] = useAtom(storePosAtom);

  const handleTransactionComplete = (transaction: StartSaleResponseInterface, client: CustomerInterface) => {
    setTransaction(transaction);
    setClient(client);
  };

  const fetchSaleDetails = useCallback(async () => {
    if (!transaction || !client) return;

    try {
      const saleRequest: GetSaleOutputInterface = {
        idTransaction: transaction.object?.id,
        storeNumber: storeNumber,
        idSubsidiary: client.idSubsidiary,
        idUser: client.idUser,
        pos: storePos,
      };

      const saleResponse = await GetSale(saleRequest) as GetSaleResponseInterface;

      if (saleResponse && saleResponse.correct) {
        setProductsList(saleResponse.object);
      } else {
        console.error("Error fetching sale details: ", saleResponse?.message);
      }
    } catch (error) {
      console.error("Error during GetSale API call", error);
    }
  }, [client, storeNumber, storePos, transaction]);

  useEffect(() => {
    fetchSaleDetails();
  }, [fetchSaleDetails, transaction]);

  const handleProductAdded = () => {
    fetchSaleDetails();
  };

  const handleVoidOrder = () => console.log("Void Order");
  const handleVoidLast = () => console.log("Void Last");
  const handleResume = () => console.log("Resume");

  const handleEndSale = async () => {
    if (!transaction || !client || !productsList) return;

    if (!transaction.object?.id) {
      console.error("Transaction ID is missing");
      return;
    }

    if (client.idSubsidiary === undefined) {
      console.error("Client subsidiary ID is missing");
      return;
    }
    const storeAddress = process.env.NEXT_PUBLIC_STORE_ADDRESS || '';
    const codeMunPos = process.env.NEXT_PUBLIC_STORE_CODE_CITY || '';
    const nameMunPos = process.env.NEXT_PUBLIC_STORE_CITY || '';
    const codeDepPos = process.env.NEXT_PUBLIC_STORE_CODE_DEPARTMENT || '';
    const nameDepPos = process.env.NEXT_PUBLIC_STORE_DEPARTMENT || '';

    if (!storeAddress || !codeMunPos || !nameMunPos || !codeDepPos || !nameDepPos) {
      console.error("Missing store address information from environment variables");
      return;
    }
  const endSaleRequest: EndSaleOutputInterface = {
    idTransaction: transaction.object.id,
    storeNumber: storeNumber,
    idSubsidiary: client.idSubsidiary,
    idUser: idUser,
    localDate: new Date().toISOString(),
    pos: storePos,
    comment: 'Test End Sale',
    payment: [
      {
        type: "CASH",
        approvalCode: "0001",
        receiptNumber: "10001",
        value: productsList.totalWithPromotion+ productsList.totalTaxes,
        cardNumber: "0032",
        cardType: "DEBIT",
        comment: "Test"
      }
    ],
    infoPos: {
      addressPos: storeAddress,
      codeMunPos: codeMunPos,
      nameMunPos: nameMunPos,
      codeDepPos: codeDepPos,
      nameDepPos: nameDepPos,
      pos: storePos
    }
  };
    console.log("End Sale Request: ", endSaleRequest);
    try {
      const endSaleResponse = await EndSale(endSaleRequest) as EndSaleResponseInterface;

      console.log("End Sale Response: ", endSaleResponse);
      if (endSaleResponse && endSaleResponse.correct) {
        setEndSaleResponse(endSaleResponse); 
        setOpenDialog(true); 
      } else {
        console.error("Error ending sale:", endSaleResponse?.message);
      }
    } catch (error) {
      console.error("Error during EndSale API call", error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    onEndTransaction();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'background.default', boxShadow: '4' }}>
      <Container maxWidth={false} sx={{ flexGrow: 1, display: 'flex', py: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={3} sx={{ height: '100%', p: 2 }}>
              <ProductTable products={productsList} />

            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={3} sx={{ height: '100%', p: 2 }}>
              {!transaction && !client ? (
                <ClientSearch onTransactionComplete={handleTransactionComplete} />
              ) : (
                <ControlPanel
                  onVoidOrder={handleVoidOrder}
                  onVoidLast={handleVoidLast}
                  onResume={handleResume}
                  transaction={transaction!}
                  client={client!}
                  onProductAdded={handleProductAdded}
                />

              )}
              {productsList && productsList.list.length > 0 && (
                  <Button
                  label={t("lbl_resume")}
                  variant="primary"
                  onClick={handleEndSale}
                  className="full-width-button"
                  disabled={!productsList || productsList.list.length === 0}
                />
              )}

            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{t("transaction_complete")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {endSaleResponse?.object?.description || t("transaction_successful")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} label="Aceptar" />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainLayout;
