// pickMessage.tsx

import MessagePicker from "@/components/MessagePicker";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { useStateMgr } from "@/hooks/use-state-mgr";
import {
  getItemFromAsyncStorage,
  setItemInAsyncStorage,
} from "@/utils/asyncStoreUtils";
import { Link } from "expo-router";

import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";

// Keys for the three message strings in AsyncStorage
const MSG_KEY_1 = "message1";
const MSG_KEY_2 = "message2";
const MSG_KEY_3 = "message3";

// Key for storing which message is currently selected
const SELECTED_MSG_KEY = "selectedMessage";

export default function PickMessage() {
  const { pickedDocument, documentContents, pickedRecipients, pickedMessage } =
    useStateMgr();

  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<"1" | "2" | "3">("1");
  const [loading, setLoading] = useState(true);

  // Load all data from AsyncStorage on mount
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const [msg1, msg2, msg3, selected] = await Promise.all([
        getItemFromAsyncStorage(MSG_KEY_1),
        getItemFromAsyncStorage(MSG_KEY_2),
        getItemFromAsyncStorage(MSG_KEY_3),
        getItemFromAsyncStorage(SELECTED_MSG_KEY),
      ]);

      setMessage1(msg1 || "");
      setMessage2(msg2 || "");
      setMessage3(msg3 || "");
      setSelectedMessage((selected as "1" | "2" | "3") || "1");
    } catch (error) {
      console.error("Error loading messages:", error);
      Alert.alert("Error", "Failed to load saved messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await Promise.all([
        setItemInAsyncStorage(MSG_KEY_1, message1),
        setItemInAsyncStorage(MSG_KEY_2, message2),
        setItemInAsyncStorage(MSG_KEY_3, message3),
      ]);

      Alert.alert("Success", "Messages saved successfully");
    } catch (error) {
      console.error("Error saving messages:", error);
      Alert.alert("Error", "Failed to save messages");
    }
  };

  const handleConfirmSelection = async () => {
    try {
      await setItemInAsyncStorage(SELECTED_MSG_KEY, selectedMessage);
      Alert.alert("Success", `Message ${selectedMessage} is now active`);
    } catch (error) {
      console.error("Error saving selection:", error);
      Alert.alert("Error", "Failed to save selection");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="message"
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
          Pick Message
        </ThemedText>
      </ThemedView>
      <ThemedView style={{ marginBottom: 16 }}>
        <ThemedText>
          Choose one of three pre-saved messages to edit and use.
        </ThemedText>
        {!pickedDocument && (
          <ThemedText>
            Dont forget to pick
            <Link href="/pickCsv"> <ThemedText type="link">CSV file</ThemedText> </Link>
            first.
          </ThemedText>
        )}
        {!pickedRecipients && (
          <ThemedText>You might want to 
           <Link href="/pickRecipients"> <ThemedText type="link">select recipients</ThemedText> </Link>
            first.</ThemedText>
        )}
      </ThemedView>
      {loading ? (
        <ThemedText>Loading...</ThemedText>
      ) : (
        <MessagePicker
          message1={message1}
          message2={message2}
          message3={message3}
          selectedMessage={selectedMessage}
          onMessage1Change={setMessage1}
          onMessage2Change={setMessage2}
          onMessage3Change={setMessage3}
          onSelectedMessageChange={setSelectedMessage}
          onSave={handleSave}
          onConfirmSelection={handleConfirmSelection}
        />
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
    // flexDirection: "row",
    // gap: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  postParseContents: {
    gap: 16,
  },
});
