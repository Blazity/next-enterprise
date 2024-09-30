import { atom } from 'jotai';
import { CustomerInterface } from '@interfaces/ResponseInterfaces/Customer/CustomerResponseInterface';


const CustomerAtom = atom<CustomerInterface | null>(null); // Estado inicial vacío

export default CustomerAtom;
