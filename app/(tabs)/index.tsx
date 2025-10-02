import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AnimatedStringWave } from "@/components/ui/AnimatedStringWave";
import { useStateMgr } from "@/hooks/use-state-mgr";
import {
  getAllAsyncStoreItems,
  PHONE_TYPE_PREF,
  setItemInAsyncStorage,
} from "@/utils/asyncStoreUtils";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

import { DEFAULT_PHONE_TYPE_PREF } from "@/constants/misc";

const NOT_DONE = "⏳";
const DONE = "✅";

export default function HomeScreen() {
  const {
    pickedDocument,
    documentContents,
    pickedRecipients,
    setPhoneTypePref,
    pickedMessage,
  } = useStateMgr();

  useEffect(() => {
    const onStartup = async () => {
      console.log("HOME: STARTUP AsyncStore CHECK RUNNING ");
      const storageContents = await getAllAsyncStoreItems();

      if (!storageContents || !storageContents[PHONE_TYPE_PREF]) {
        console.log(
          `${PHONE_TYPE_PREF} not found in async storage, setting it.`
        );
        setItemInAsyncStorage(PHONE_TYPE_PREF, DEFAULT_PHONE_TYPE_PREF);
        setPhoneTypePref(DEFAULT_PHONE_TYPE_PREF);
      } else {
        console.log(
          `HOME: ${PHONE_TYPE_PREF} found in async storage: `,
          storageContents[PHONE_TYPE_PREF]
        );
      }
    };

    onStartup();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/SMS-02.png")}
          style={styles.appLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Batch SMS </ThemedText>
        <AnimatedStringWave text="📨" />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          Step 0: Explore the Settings tab
        </ThemedText>
        <ThemedText>
          Set whether primary or mobile phone number will get the text.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Link href="/pickCsv">
          <ThemedText
            type="subtitle"
            style={[pickedDocument && styles.completedText]}
          >
            Step 1: Pick CSV file
            <ThemedText style={styles.noLineThrough}>
              {"  "}
              {pickedDocument && DONE}
            </ThemedText>
          </ThemedText>
        </Link>
        <ThemedText>
          Browse files on this device and select CSV file.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Link href="/pickRecipients">
          <ThemedText
            type="subtitle"
            style={
              pickedRecipients && [
                pickedRecipients?.length > 0 && styles.completedText,
              ]
            }
          >
            Step 2: Pick Recipeints
            <ThemedText style={styles.noLineThrough}>
              {"  "}
              {pickedRecipients && pickedRecipients?.length > 0 && DONE}
            </ThemedText>
          </ThemedText>
        </Link>
        <ThemedText>
          Select all the people from the file you want to send to.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Link href="/pickMessage">
          <ThemedText
            type="subtitle"
            style={[pickedMessage && styles.completedText]}
          >
            Step 3: Pick Message
            <ThemedText style={styles.noLineThrough}>
              {"  "}
              {pickedMessage && DONE}
            </ThemedText>
          </ThemedText>
        </Link>
        <ThemedText>
          Create a message to send, or pick a saved message.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Link href="/send">
          <ThemedText type="subtitle">Step 4: Send</ThemedText>
        </Link>
        <ThemedText>Send your messages</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  appLogo: {
    // height: 178,
    // width: 290,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    position: "absolute",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  noLineThrough: {
    textDecorationLine: "none",
  },
});
