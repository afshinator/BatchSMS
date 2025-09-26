import ParallaxScrollView from "@/components/parallax-scroll-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useStateMgr } from "@/hooks/use-state-mgr";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { StyleSheet } from "react-native";

type CsvFileAsset = DocumentPicker.DocumentPickerAsset & {
  lastModified: number;
  name: string;
  size: number;
};

export default function PickRecipients() {
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



  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="person.3"
          style={styles.headerImage}
        />
      }
    >

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
