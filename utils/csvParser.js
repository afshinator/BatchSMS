import { Platform } from 'react-native';

// import { readAsStringAsync } from "expo-file-system/legacy";

// Only import expo-file-system on native platforms
let readAsStringAsync;
if (Platform.OS !== 'web') {
  readAsStringAsync = require('expo-file-system/legacy').readAsStringAsync;
}


/**
 * Simple CSV parser function
 * @param {string} csvText - Raw CSV text content
 * @param {Object} options - Parsing options
 * @returns {Array} Array of objects representing CSV rows
 */
export const parseCSV = (csvText, options = {}) => {
  const {
    delimiter = ",",
    skipEmptyLines = true,
    trimHeaders = true,
    trimValues = true,
  } = options;

  if (!csvText || typeof csvText !== "string") {
    throw new Error("Invalid CSV text provided");
  }

  const lines = csvText.split("\n").filter((line) => {
    return skipEmptyLines ? line.trim().length > 0 : true;
  });

  if (lines.length === 0) {
    return [];
  }

  // Parse headers from first line
  const headers = parseCSVLine(lines[0], delimiter).map((header) =>
    trimHeaders ? header.trim() : header
  );

  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], delimiter);

    // Skip lines that don't have the right number of columns
    if (values.length !== headers.length) {
      console.warn(
        `Row ${i + 1} has ${values.length} columns, expected ${
          headers.length
        }. Skipping.`
      );
      continue;
    }

    const row = {};
    headers.forEach((header, index) => {
      let value = values[index] || "";
      if (trimValues) {
        value = value.trim();
      }

      // Try to convert to number if it looks like a number
      if (value !== "" && !isNaN(value) && !isNaN(parseFloat(value))) {
        row[header] = parseFloat(value);
      } else {
        row[header] = value;
      }
    });

    data.push(row);
  }

  return data;
};

/**
 * Parse a single CSV line, handling quoted values and embedded commas
 * @param {string} line - Single line of CSV
 * @param {string} delimiter - Field delimiter
 * @returns {Array} Array of field values
 */
const parseCSVLine = (line, delimiter = ",") => {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle escaped quotes ("")
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      // Field separator found outside quotes
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  // Add the last field
  result.push(current);

  return result;
};

/**
 * Read and parse CSV file from DocumentPicker result
 * @param {Object} pickedFile - File object from DocumentPicker (must have uri, name, size properties)
 * @param {Object} options - Parsing options
 * @returns {Promise<Object>} Promise that resolves to parse result
 */
export const readAndParseCSV = async (pickedFile, options = {}) => {
  console.log('in parse ', pickedFile)
  try {
    if (!pickedFile || !pickedFile.uri) {
      throw new Error('Invalid file object provided');
    }

    // Check if it's a CSV file
    if (pickedFile.mimeType && !pickedFile.mimeType.includes('csv') && 
        !pickedFile.name?.toLowerCase().endsWith('.csv')) {
      console.warn('File may not be a CSV file');
    }

    // Read file content - different approach for web vs native
    let fileContent;
    
    if (Platform.OS === 'web') {
      // On web, DocumentPicker returns a File object that we can read directly
      if (pickedFile.file) {
        fileContent = await pickedFile.file.text();
      } else {
        throw new Error('File object not available on web');
      }
    } else {
      // On native, use expo-file-system
      fileContent = await readAsStringAsync(pickedFile.uri, {
        encoding: 'utf8',
      });
    }

    // Parse CSV content
    const parsedData = parseCSV(fileContent, options);
    
    return {
      success: true,
      data: parsedData,
      fileName: pickedFile.name,
      fileSize: pickedFile.size,
      rowCount: parsedData.length
    };

  } catch (error) {
    console.error('Error reading/parsing CSV file:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Utility function to validate CSV structure
 * @param {Array} data - Parsed CSV data
 * @returns {Object} Validation result
 */
export const validateCSVData = (data) => {
  if (!Array.isArray(data)) {
    return { valid: false, message: "Data is not an array" };
  }

  if (data.length === 0) {
    return { valid: false, message: "No data found" };
  }

  const firstRowKeys = Object.keys(data[0]);
  const inconsistentRows = [];

  // Check for consistent structure
  for (let i = 0; i < data.length; i++) {
    const currentKeys = Object.keys(data[i]);
    if (
      currentKeys.length !== firstRowKeys.length ||
      !currentKeys.every((key) => firstRowKeys.includes(key))
    ) {
      inconsistentRows.push(i);
    }
  }

  return {
    valid: inconsistentRows.length === 0,
    message:
      inconsistentRows.length > 0
        ? `Inconsistent structure in rows: ${inconsistentRows.join(", ")}`
        : "Valid CSV structure",
    headers: firstRowKeys,
    rowCount: data.length,
    inconsistentRows,
  };
};
