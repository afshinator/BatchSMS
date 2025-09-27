import AsyncStorage from "@react-native-async-storage/async-storage";

// Key for the user's preferred contact method (e.g., 'mobile' or 'priority')
export const PHONE_TYPE_PREF = "phoneTypePref"; // same as state var naem

/**
 * Retrieves all key-value pairs stored in AsyncStorage.
 * @returns {Promise<Record<string, string | null>>} A Promise that resolves
 * with an object containing all stored keys and their values.
 */
export const getAllAsyncStoreItems = async (): Promise<
  Record<string, string | null>
> => {
  try {
    // 1. Get all existing keys from AsyncStorage. Keys are always strings.
    const keys: readonly string[] = await AsyncStorage.getAllKeys();

    // Retrieve all data for those keys using multiGet.
    // Result is an array of [key, value] pairs, where value can be string or null.
    const result: ReadonlyArray<[string, string | null]> =
      await AsyncStorage.multiGet(keys);

    // Convert the array of arrays into a single object { key: value }.
    const items: Record<string, string | null> = {};

    // Iterate and populate the object
    result.forEach(([key, value]) => {
      items[key] = value;
    });

    return items;
  } catch (error) {
    console.error("Error retrieving all AsyncStore items:", error);
    return {};
  }
};

export const getItemFromAsyncStorage = async (key: string): Promise<string | null> => {
  try {
    // AsyncStorage.getItem returns Promise<string | null>
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error(`Error getting AsyncStore item with key ${key}:`, error);
    return null;  
  }
};


/**
 * Sets a key-value pair in AsyncStorage.
 * @param {string} key The key to set.
 * @param {string} value The string value to store.
 * @returns {Promise<void>} A Promise that resolves once the item is set.
 */
export const setItemInAsyncStorage = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    // AsyncStorage.setItem expects both key and value to be strings.
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting AsyncStore item with key ${key}:`, error);
  }
};

