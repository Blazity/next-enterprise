"use client";

import Grid2 from '@mui/material/Grid2';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { storeNumberAtom, storePosAtom } from '@atoms/states/StoreAtom';
import { AddProductsOutputInterface } from '@interfaces/OutputInterfaces/Sale/AddProductsOutputInterfae';
import { CustomerInterface } from '@interfaces/ResponseInterfaces/Customer/CustomerResponseInterface';
import { AddProductsResponseInterface, ItemObject } from '@interfaces/ResponseInterfaces/Sale/AddProductsResponseInterface';
import { StartSaleResponseInterface } from '@interfaces/ResponseInterfaces/Sale/StartSaleResponseInterface';
import ActionButtons from '@molecules/ActionButtons';
import ProductSearch from '@molecules/ProductSearch';
import SaleSummary from '@molecules/SaleSummary';
import AddProducts from "@package/config/api/Sale/Transaction/AddProducts/page";

interface ControlPanelProps {
  onVoidOrder: () => void;
  onVoidLast: () => void;
  onResume: () => void;
  transaction: StartSaleResponseInterface;
  client: CustomerInterface;
  onProductAdded: () => void; 
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onVoidOrder,
  onVoidLast,
  onResume,
  transaction,
  client,
  onProductAdded,
}) => {

  const [addedProducts, setAddedProducts] = useState<ItemObject>({} as ItemObject);
  const [loading, setLoading] = useState(false);
  const [storeNumber] = useAtom(storeNumberAtom);
  const [storePos] = useAtom(storePosAtom);


  const handleSearchSKU = async (sku: string) => {
    setLoading(true);

    try {
      const addProductRequest: AddProductsOutputInterface = {
        idTransaction: transaction.object?.id,
        storeNumber: storeNumber,
        idSubsidiary: client.idSubsidiary,
        clientNit: client.dni,
        idUser: client.idUser,
        localDate: new Date(),
        pos: storePos,
        products: [
          {
            sku: sku,
            value: 1,
          },
        ],
      };

      const productResponse = await AddProducts(addProductRequest) as AddProductsResponseInterface;

      if (productResponse && productResponse.correct) {
        const newProduct = productResponse.object;
        setAddedProducts(newProduct)
        onProductAdded();
      } else {
        console.error("Error adding product: ", productResponse?.message);
      }
    } catch (error) {
      console.error("Error during AddProducts API call", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Grid2 container spacing={4}>
      <Grid2  size={{xs:12}}>
        <ActionButtons onVoidOrder={onVoidOrder} onVoidLast={onVoidLast} onResume={onResume} />
      </Grid2>

      <Grid2  size={{xs:12}}>
        <ProductSearch onSearch={handleSearchSKU} />
      </Grid2>

      <Grid2  size={{xs:12}}>
        <SaleSummary product={addedProducts} />
      </Grid2>
    </Grid2>
  );
};

export default ControlPanel;
