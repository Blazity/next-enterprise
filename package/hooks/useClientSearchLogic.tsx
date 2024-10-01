import { useEffect, useState } from 'react';
import { CustomerInterface, CustomerResponseInterface } from '@interfaces/ResponseInterfaces/Customer/CustomerResponseInterface';
import { CustomerDniTypeInterface, CustomerDniTypeResponseInterface } from '@interfaces/ResponseInterfaces/Customer/DNITypeResponseInterface';
import { GetCustomer } from '@package/config/api/Customer/Customer/GetCustomer/page';
import { GetTypeDni } from '@package/config/api/Customer/TypeDNI/GetTypeDNI/page'; 

export const useClientSearchLogic = () => {
  const [idTypes, setIdTypes] = useState<CustomerDniTypeInterface[]>([]); 
  const [loading, setLoading] = useState(false);
  const [isAffiliated, setIsAffiliated] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 
  const [result, setResult] = useState<CustomerInterface[]>([]);
  const [formData, setFormData] = useState({
    idType: '',
    idNumber: ''
  });

  // Cliente seleccionado
  const [customer, setCustomer] = useState<CustomerInterface | null>(null);

  const fetchIdTypes = async () => {
    setLoading(true);
    try {
      const response = await GetTypeDni({
        size: 100,
        page: 0,
      }) as CustomerDniTypeResponseInterface;
      if (response?.object.list) {
        setIdTypes(response.object.list);
      } else {
        setError('No se pudieron cargar los tipos de identificación');
      }
    } catch (err) {
      setError('Error al obtener los tipos de identificación');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdTypes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setResult([]);
    setIsAffiliated(true);
  };

  const handleSubmitForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setResult([]);

    const response = await GetCustomer({
      idTypeCustomer: formData.idType,
      dni: formData.idNumber
    }) as CustomerResponseInterface;

    setLoading(false);

    if (response.correct && response.object.list.length > 0) {
      const customerData = response.object.list[0];

      if (customerData) {
        setIsAffiliated(true);
        setCustomer({
          ...customerData,
          idTypeCustomer: formData.idType,
          dni: formData.idNumber,
          id: customerData.id || '',
        });
        setResult(response.object.list); 
      }
    } else {
      setIsAffiliated(false);
      setCustomer(null);
    }
  };

  return {
    idTypes,
    loading,
    error,
    result,
    formData,
    handleInputChange,
    handleSubmitForm,
    isAffiliated,
    customer
  };
};
