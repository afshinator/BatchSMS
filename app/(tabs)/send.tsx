import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { useStateMgr } from "@/hooks/use-state-mgr";
import { Link } from "expo-router";

export default function SendMessages() {
  const { pickedDocument, pickedRecipients, pickedMessage } = useStateMgr();

  console.log("SEND: ", pickedRecipients, pickedMessage);

  const Header = () => (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Send Messages
        </ThemedText>
      </ThemedView>

      <ThemedView style={{ marginBottom: 16 }}>
        <ThemedText>Send text messages to all your chosen numbers.</ThemedText>
        {!pickedDocument && (
          <ThemedText>
            First pick
            <Link href="/pickCsv">
              {" "}
              <ThemedText type="link">CSV file</ThemedText>{" "}
            </Link>
            <ThemedText> with names and numbers.</ThemedText>
          </ThemedText>
        )}
        {!pickedRecipients && (
          <ThemedText>
            Before sending you have to
            <Link href="/pickRecipients">
              {" "}
              <ThemedText type="link">select recipients.</ThemedText>
            </Link>
          </ThemedText>
        )}
        {!pickedMessage && (
          <ThemedText>
            Go create or select the
            <Link href="/pickRecipients">
              {" "}
              <ThemedText type="link">message</ThemedText>
            </Link>{" "}
            to send before continuing here.
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={{ borderRadius: 4,}}>
        {pickedMessage && (
          <ThemedView>
            <ThemedText type="subtitle">Message Template:</ThemedText>
            <ThemedText style={{   borderRadius: 4, color: 'yellow'}}>{pickedMessage}</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="paperplane.fill"
          style={styles.headerImage}
        />
      }
    >
      <Header />
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
    marginBottom: 16,
  },
});
