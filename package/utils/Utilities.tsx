// import crypto from 'crypto';
import crypto from 'crypto';
import { INFINITY_SYMBOL, NOT_AVAILABLE } from '@package/utils/Constants';

const password: string = process.env.REACT_APP_API_KEY || '';

const startForString = '420';
const endForString = '021';

const keyApiStore = '3a1f8a790c238b8df0d447b53d792134';
const keyUser = '2a5f8a790c238u8sf0e447r53d344378';

/**
 * Encrypts a given object using AES-256-CBC encryption.
 *
 * @param object - The object to be encrypted. If the object is null, an empty string is returned.
 * @returns The encrypted string representation of the object.
 */
const encryptObject = (object: any): string => {
  if (object === null) return '';
  const jsonString = JSON.stringify(object);
  const cipher = crypto.createCipher('aes-256-cbc', password);
  let encryptedString = cipher.update(jsonString, 'utf-8', 'hex');
  encryptedString += cipher.final('hex');

  return encryptedString;
};

/**
 * Decrypts an encrypted string and parses it into an object.
 *
 * @param {string | null} encryptedString - The encrypted string to decrypt. If null, returns an empty string.
 * @returns {any} - The decrypted and parsed object.
 */
const decryptObject = (encryptedString: string | null): any => {
  if (encryptedString === null) return '';

  const decipher = crypto.createDecipher('aes-256-cbc', password);
  let decryptedString = decipher.update(encryptedString, 'hex', 'utf-8');
  decryptedString += decipher.final('utf-8');

  return JSON.parse(decryptedString);
};

/**
 * Encrypts the given data using AES-256-CBC encryption algorithm.
 *
 * @param {string | null} data - The data to be encrypted. If null, an empty string is returned.
 * @returns {string} The encrypted data in hexadecimal format, concatenated with the initialization vector (IV).
 *
 * @throws Will log an error to the console if encryption fails and return an empty string.
 */
function encrypt(data: string | null): string {
  try{
    if (data === null) return '';
  
    const passwordValid = password.slice(4).slice(0, -4);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(passwordValid, 'hex'), iv);
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted + '.' + iv.toString('hex');
  }
  catch(e){
    console.error("Error encriptando: ", e);
    return "";
  }
}

/**
 * Concatenates the given string with predefined start and end strings.
 *
 * @param data - The string to be concatenated.
 * @returns The concatenated string with start and end strings.
 */
function setInitEndString(data: string): string {
  return startForString + data + endForString;
}

/**
 * Generates a string representing the current date in the format DDMMYYYY.
 *
 * @returns {string} The current date formatted as a string.
 */
function getDateSaveStore(): string {
  const date = new Date();
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const año = date.getFullYear();

  return `${dia}${mes}${año}`;
}

/**
 * Stores a key-value pair in the local storage with a timestamped key.
 *
 * @param key - The key under which the data should be stored.
 * @param data - The data to be stored.
 * @throws Will log an error to the console if the storage operation fails.
 */
function setKeyStore(key: string, data: string): void {
  try {
    localStorage.setItem(`${getDateSaveStore()}${key}`, data);
  } catch (error) {
    console.error('Error setting key store', error);
  }
}

/**
 * Retrieves a value from localStorage based on a provided key.
 *
 * The key is prefixed with the current date obtained from `getDateSaveStore()`.
 * If an error occurs during retrieval, it logs the error to the console and returns null.
 *
 * @param {string} key - The key to retrieve the value for.
 * @returns {string | null} - The value associated with the key, or null if an error occurs.
 */
function getKeyStore(key: string): string | null {
  try {
    return localStorage.getItem(`${getDateSaveStore()}${key}`);
  } catch (error) {
    console.error('Error getting key store', error);
    return null;
  }
}

/**
 * Deletes a key from the local storage.
 *
 * @param {string} key - The key to be deleted from the local storage.
 * @throws Will log an error to the console if the deletion fails.
 */
function deleteKeyStore(key: string): void {
  try {
    localStorage.removeItem(`${getDateSaveStore()}${key}`);
  } catch (error) {
    console.error('Error deleting key store', error);
  }
}

/**
 * Sets the API key in the key store.
 *
 * @param data - The API key to be set.
 * @throws Will log an error message if setting the API key fails.
 */
function setKeyApi(data: string): void {
  try {
    setKeyStore(keyApiStore, data);
  } catch (error) {
    console.error('Error setting API key', error);
  }
}

/**
 * Retrieves the API key from the key store.
 *
 * @returns {string | null} The API key if it exists, otherwise `null`.
 * @throws Will log an error to the console if there is an issue retrieving the key.
 */
function getKeyApi(): string | null {
  try {
    return getKeyStore(keyApiStore);
  } catch (error) {
    console.error('Error getting API key', error);
    return null;
  }
}

/**
 * Deletes the API key from the store.
 *
 * This function attempts to delete the API key from the key store.
 * If an error occurs during the deletion process, it logs the error
 * to the console with a message indicating the failure.
 *
 * @throws Will log an error message to the console if the deletion fails.
 */
function deleteKeyApi(): void {
  try {
    deleteKeyStore(keyApiStore);
  } catch (error) {
    console.error('Error deleting API key', error);
  }
}

// User
/**
 * Sets the user data in the key store after encrypting it.
 *
 * @param data - The user data to be stored. This can be of any type.
 * @returns void
 */
function setUser(data: any): void {
  setKeyStore(keyUser, encryptObject(data));
}

/**
 * Retrieves the user information by decrypting the stored user data.
 *
 * @returns {any} The decrypted user object.
 */
function getUser(): any {
  return decryptObject(getKeyStore(keyUser));
}

/**
 * Deletes the user by removing the associated key from the key store.
 *
 * This function calls `deleteKeyStore` with `keyUser` to remove the user's key.
 *
 * @function
 * @returns {void} This function does not return a value.
 */
function deleteUser(): void {
  deleteKeyStore(keyUser);
}

/**
 * Sets the user privileges by encrypting the provided data and storing it in the key store.
 *
 * @param data - The user privileges data to be encrypted and stored.
 * @returns void
 */
function setUserPrivileges(data: any): void {
  setKeyStore('userPrivileges', encryptObject(data));
}

/**
 * Retrieves the user privileges from the key store and decrypts them.
 *
 * @returns {any} The decrypted user privileges.
 */
function getUserPrivileges(): any {
  const userPrivileges = decryptObject(getKeyStore('userPrivileges'));
  return userPrivileges;
}

/**
 * Deletes the user privileges from the key store.
 *
 * This function removes the 'userPrivileges' entry from the key store,
 * effectively revoking any stored user privileges.
 *
 * @returns {void} This function does not return a value.
 */
function deleteUserPrivileges(): void {
  deleteKeyStore('userPrivileges');
}

// Page Access, Update, Create Allowed validation
/**
 * Checks if the user has a specific privilege for a given page.
 *
 * @param {string} npage - The name of the page to check privileges for.
 * @param {string} privilegeType - The type of privilege to check (e.g., 'read', 'write').
 * @returns {boolean} - Returns `true` if the user has the specified privilege for the page, otherwise `false`.
 *
 * @throws Will log an error to the console if there is an issue checking the user's privileges.
 */
function checkUserPrivilege(npage: string, privilegeType: string): boolean {
  try {
    const userPrivileges = getUserPrivileges();
    if (userPrivileges) {
      const page = userPrivileges.find((item: any) => item.npage === npage);
      if (page && page.hasOwnProperty(privilegeType)) {
        return !!page[privilegeType];
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking user privilege:', error);
    return false;
  }
}

/**
 * Determines if access to a specific page is allowed based on user privileges.
 *
 * @param {string} npage - The name of the page to check access for.
 * @returns {boolean} - Returns `true` if the user has the required privileges and the page is active, otherwise `false`.
 */
function pageAccessAllowed(npage: string): boolean {
  return checkUserPrivilege(npage, 'isActive');
}

/**
 * Determines if the user has the privilege to update the specified page.
 *
 * @param {string} npage - The name of the page to check for update privileges.
 * @returns {boolean} - Returns `true` if the user has update privileges for the page, otherwise `false`.
 */
function pageUpdateAllowed(npage: string): boolean {
  return checkUserPrivilege(npage, 'isUpdate');
}

/**
 * Determines if the user has the privilege to create a new page.
 *
 * @param {string} npage - The name of the page to check.
 * @returns {boolean} - Returns `true` if the user has the 'isCreate' privilege for the specified page, otherwise `false`.
 */
function pageCreateAllowed(npage: string): boolean {
  return checkUserPrivilege(npage, 'isCreate');
}

/**
 * Calculates the percentage change between the current value and the last value.
 *
 * @param currentValue - The current value to compare.
 * @param lastValue - The previous value to compare against.
 * @returns A string representing infinity if the last value is zero and the current value is not zero,
 *          a string representing not available if both values are zero,
 *          or a number representing the percentage change rounded to two decimal places.
 */
function getPercentageChange(currentValue: number, lastValue: number): string | number {
  return lastValue === 0 && currentValue !== 0
    ? INFINITY_SYMBOL
    : lastValue === 0 && currentValue === 0
    ? NOT_AVAILABLE
    : parseFloat((((currentValue - lastValue) / lastValue) * 100).toFixed(2));
}

/**
 * Handles the input event for a name input field.
 * 
 * This function ensures that only alphabetic characters and spaces are allowed
 * in the input field by replacing any non-alphabetic characters with an empty string.
 * 
 * @param event - The input change event triggered by the user.
 */
const handleNameInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
  event.target.value = event.target.value.replace(/[^a-zA-Z\s]/g, '');
};

/**
 * Handles non-numeric input in an HTML input element.
 * 
 * This function listens for changes in the input field and replaces any non-alphabetic characters
 * with an empty string, effectively removing them. It allows only alphabetic characters and spaces.
 * 
 * @param event - The change event triggered by the input element.
 */
const handleNonNumericInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
  event.target.value = event.target.value.replace(/[^a-zA-Z\s]/g, '');
};

/**
 * Truncates a given text to a specified length and appends ellipsis if the text exceeds that length.
 *
 * @param text - The text to be truncated.
 * @param length - The maximum length of the truncated text.
 * @returns The truncated text with ellipsis if it exceeds the specified length.
 */
const truncateText = (text: string, length: number): string => {
  return text?.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * Concatenates the names of the selected items into a single string, separated by commas.
 *
 * @param selectedItems - An array of objects, each containing a `name` property.
 * @returns A string containing the concatenated names of the selected items.
 */
const renderName = (selectedItems: { name: string }[]): string => {
  let name = '';
  selectedItems?.forEach((item, index) => {
    if (index === 0) {
      name = item?.name;
    } else {
      name += ', ' + item?.name;
    }
  });

  return name;
};

export {
  encrypt,
  setInitEndString,
  setKeyStore,
  getKeyStore,
  deleteKeyStore,
  setKeyApi,
  getKeyApi,
  deleteKeyApi,
  setUser,
  getUser,
  deleteUser,
  setUserPrivileges,
  getUserPrivileges,
  deleteUserPrivileges,
  pageAccessAllowed,
  pageUpdateAllowed,
  pageCreateAllowed,
  getPercentageChange,
  handleNameInput,
  handleNonNumericInput,
  truncateText,
  renderName
};
