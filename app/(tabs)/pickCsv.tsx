import { CsvDisplayTable } from "@/components/CsvDisplayTable";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { useStateMgr } from "@/hooks/use-state-mgr";
import { readAndParseCSV } from "@/utils/csvParser";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type CsvFileAsset = DocumentPicker.DocumentPickerAsset & {
  lastModified: number;
  name: string;
  size: number;
};

export default function PickCsvScreen() {
  const {
    pickedDocument,
    documentContents,
    setPickedDocument,
    setDocumentContents,
  } = useStateMgr();
  const [loading, setLoading] = useState(false);

  const filename = pickedDocument ? pickedDocument.name : "";
  const buttonPrompt = filename
    ? "Browse for a different CSV file"
    : "Browse for CSV file";

  const handlePickFile = async () => {
    try {
      const pickedDoc = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (
        !pickedDoc.canceled &&
        pickedDoc.assets &&
        pickedDoc.assets.length > 0
      ) {
        const rawFile = pickedDoc.assets[0];

        // Ensure required properties exist
        const file: CsvFileAsset = {
          ...rawFile,
          lastModified: rawFile.lastModified || Date.now(),
          name: rawFile.name || "unknown.csv",
          size: rawFile.size || 0,
        };

        setPickedDocument(file);
        const fileResult = await readAndParseCSV(file);
        // @ts-ignore
        if (fileResult.success) {
          console.info(">>> DATA RESULT: ", fileResult.data);
          setDocumentContents(fileResult.data);
        }
      }
    } catch (error) {
      console.error("Error picking file:", error);
      return { success: false, file: null, error };
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="doc.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Pick CSV file 📄
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Browse files on this device, select which CSV file has names/numbers of
        those you want to send text message to.
      </ThemedText>
      <ThemedText type="subtitle">
        Chosen file: {pickedDocument ? filename : "not yet selected"}
      </ThemedText>

      <TouchableOpacity
        style={styles.button}
        onPress={handlePickFile}
        // disabled={disabled}
      >
        <Text style={styles.buttonText}>{buttonPrompt}</Text>
      </TouchableOpacity>
      {documentContents && (
        <ThemedView>
          <ThemedText>
            File successfully parsed - {documentContents.length} rows
          </ThemedText>
          <CsvDisplayTable data={documentContents} />
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#999",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
