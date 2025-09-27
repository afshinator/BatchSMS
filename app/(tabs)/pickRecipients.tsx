import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { useStateMgr } from "@/hooks/use-state-mgr";

import { Link } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import {
  getItemFromAsyncStorage,
  PHONE_TYPE_PREF,
} from "@/utils/asyncStoreUtils";

import { RecipientSelector } from "@/components/RecipientSelector";

export default function PickRecipients() {
  const {
    pickedDocument,
    documentContents,
    phoneTypePref,

    setPickedDocument,
    setDocumentContents,
    setPhoneTypePref,
  } = useStateMgr();

  useEffect(() => {
    const onStartup = async () => {
      const prefValue = await getItemFromAsyncStorage(PHONE_TYPE_PREF);

      if (!prefValue) {
        console.log(
          `${PHONE_TYPE_PREF} not found in async storage, setting it.`
        );
        // setItemInAsyncStorage(PHONE_TYPE_PREF, DEFAULT_PHONE_TYPE_PREF);
        // setPhoneTypePref(DEFAULT_PHONE_TYPE_PREF);
      } else {
        console.log(`${PHONE_TYPE_PREF} FOUND in async storage: ${prefValue}`);
        setPhoneTypePref(prefValue);
      }
    };

    onStartup();
  }, []);

  const Header = () => {
    return (
      <View>
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="title"
            style={{
              fontFamily: Fonts.rounded,
              marginBottom: 16,
            }}
          >
            Pick Recipients
          </ThemedText>
        </ThemedView>
        <ThemedText>
          Go through and select which people you want to send Text messages to.
        </ThemedText>
        <ThemedText>
          Right now, the phone column{" "}
          <ThemedText type="defaultSemiBold">{phoneTypePref}</ThemedText> is
          preferred. Go to{" "}
          <Link href="/settings">
            <ThemedText type="link">settings</ThemedText>
          </Link>{" "}
          to change this default.
        </ThemedText>
      </View>
    );
  };

  console.log("documentContests ", documentContents);

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
      <Header />
      {!pickedDocument && (
        <ThemedText>
          You need to first{" "}
          <Link href="/pickCsv">
            <ThemedText type="link">pick a CSV document</ThemedText>
          </Link>{" "}
          , before selecting recipients here.
        </ThemedText>
      )}

      {pickedDocument && (
        <RecipientSelector
          documentContents={documentContents}
          phoneTypePref={phoneTypePref}
          onFinalize={() => {}}
        />
      )}
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
