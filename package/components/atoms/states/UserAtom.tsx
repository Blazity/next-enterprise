import { atom } from 'jotai';
import { UserResposeInterface } from '@interfaces/ResponseInterfaces/Auth/UserResponseInterface';

const UserAtom = atom<UserResposeInterface | null>(null);

export default UserAtom;
