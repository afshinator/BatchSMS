import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { useStateMgr } from "@/hooks/use-state-mgr";

import { Link } from "expo-router";
import { useEffect, useState } from "react"; // ADDED useState
import { StyleSheet, TouchableOpacity, View } from "react-native";

import {
  getItemFromAsyncStorage,
  PHONE_TYPE_PREF,
} from "@/utils/asyncStoreUtils";

import { RecipientSelector } from "@/components/RecipientSelector";
import { DEFAULT_PHONE_TYPE_PREF } from "@/constants/misc";

export default function PickRecipients() {
  const {
    pickedDocument,
    documentContents,
    phoneTypePref,
    pickedRecipients,

    setPhoneTypePref,
    setPickedRecipients,
  } = useStateMgr();

  const [resetKey, setResetKey] = useState(0); 

  useEffect(() => {
    const onStartup = async () => {
      const prefValue = await getItemFromAsyncStorage(PHONE_TYPE_PREF);

      if (!prefValue) {
        console.log(
          `${PHONE_TYPE_PREF} not found in async storage, setting it.`
        );
        // Index page already does this; this screen can't be naviagted to on mobile.
        // setItemInAsyncStorage(PHONE_TYPE_PREF, DEFAULT_PHONE_TYPE_PREF);
        // setPhoneTypePref(DEFAULT_PHONE_TYPE_PREF);
      } else {
        console.log(`${PHONE_TYPE_PREF} FOUND in async storage: ${prefValue}`);
        setPhoneTypePref(prefValue);
      }
    };

    onStartup();
  }, []);

  const handleResetPicks = () => {
    setPickedRecipients([]);
    // Increment the key to force the RecipientSelector component to re-mount and reset its local state
    setResetKey(prevKey => prevKey + 1);
  }

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
          key={resetKey} 
          documentContents={documentContents}
          phoneTypePref={phoneTypePref ?? DEFAULT_PHONE_TYPE_PREF}
          onFinalize={() => {}}
        />
      )}
      {pickedRecipients?.length && (
        <ThemedView>
          <View style={styles.finishedPickingMsg}>
            <ThemedText type="defaultSemiBold" style={{ marginBottom: 16 }}>
              {pickedRecipients.length} of{" "}
              {documentContents ? documentContents.length : 0} selected.
            </ThemedText>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetPicks}>
              <ThemedText>Reset Picks!</ThemedText>
            </TouchableOpacity>
          </View>

          {pickedRecipients.map((row, i) => {
            return (
              <ThemedText key={i}>
                {row["name"]} : {row["phone"]}  {row['phoneType']}
              </ThemedText>
            );
          })}
          <ThemedText style={{ marginTop: 16 }}>
            👉 Now go to{" "}
            <Link href="/">
              <ThemedText type="link">Pick Message</ThemedText>
            </Link>{" "}
            tab to select what message to send to these people.
          </ThemedText>
        </ThemedView>
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
  finishedPickingMsg: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resetButton: {
    backgroundColor: "#B98110",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});