import * as DocumentPicker from "expo-document-picker";
import { create } from "zustand";

type CsvFileAsset = DocumentPicker.DocumentPickerAsset & {
  lastModified: number;
  name: string;
  size: number;
};

// Define the state structure
interface State {
  pickedDocument: CsvFileAsset | null;
  documentContents: [] | null;
  phoneTypePref: "mobile" | "priority" | null;
  pickedRecipients: [] | null;

  setPickedDocument: (document: CsvFileAsset | null) => void;
  setDocumentContents: (contents: [] | null) => void;
  setPhoneTypePref: (pref: "mobile" | "priority" | null) => void;
  setPickedRecipients: (contents: [] | null) => void;
}

// Create the Zustand store
export const useStateMgr = create<State>((set) => ({
  pickedDocument: null,
  documentContents: null,
  phoneTypePref: null,
  pickedRecipients: null,

  setPickedDocument: (document) => set({ pickedDocument: document }),
  setDocumentContents: (contents) => set({ documentContents: contents }),
  setPhoneTypePref: (pref) => set({ phoneTypePref: pref }),
  setPickedRecipients: (pickedList) => set({ pickedRecipients: pickedList }),
}));
