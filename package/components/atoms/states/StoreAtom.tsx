import { atom } from 'jotai';

export const storeNumberAtom = atom<string>(process.env.NEXT_PUBLIC_STORE_NUMBER || '');
export const storePosAtom = atom<string>(process.env.NEXT_PUBLIC_POS || '');
export const storeInfoPosAtom = atom({
  addressPos: process.env.NEXT_PUBLIC_STORE_ADDRESS || '',
  codeMunPos: process.env.NEXT_PUBLIC_STORE_CODE_CITY || '',
  nameMunPos: process.env.NEXT_PUBLIC_STORE_CITY || '',
  codeDepPos: process.env.NEXT_PUBLIC_STORE_CODE_DEPARTMENT || '',
  nameDepPos: process.env.NEXT_PUBLIC_STORE_DEPARTMENT || '',
});
