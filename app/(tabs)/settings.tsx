import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import {
  getItemFromAsyncStorage,
  PHONE_TYPE_PREF,
  setItemInAsyncStorage,
} from "@/utils/asyncStoreUtils";
import { Image } from "expo-image";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type PhoneType = "mobile" | "priority";

export default function SettingsScreen() {
  const [phoneTypePref, setPhoneTypePref] = useState<PhoneType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhoneTypePref();
  }, []);

  const loadPhoneTypePref = async () => {
    try {
      const value = await getItemFromAsyncStorage(PHONE_TYPE_PREF);
      // Default to 'mobile' if no value is stored
      setPhoneTypePref((value as PhoneType) || "mobile");
    } catch (error) {
      console.error("Error loading phone type preference:", error);
      setPhoneTypePref("mobile");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneTypeChange = async (type: PhoneType) => {
    try {
      await setItemInAsyncStorage(PHONE_TYPE_PREF, type);
      setPhoneTypePref(type);
    } catch (error) {
      console.error("Error saving phone type preference:", error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gearshape.fill"
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
          Settings
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.settingSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Phone Type Preference
        </ThemedText>
        <ThemedText style={styles.sectionDescription}>
          Choose your preferred contact method
        </ThemedText>

        {loading ? (
          <ActivityIndicator size="small" style={styles.loader} />
        ) : (
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                phoneTypePref === "mobile" && styles.optionButtonActive,
              ]}
              onPress={() => handlePhoneTypeChange("mobile")}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  phoneTypePref === "mobile" && styles.optionTextActive,
                ]}
              >
                Mobile
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                phoneTypePref === "priority" && styles.optionButtonActive,
              ]}
              onPress={() => handlePhoneTypeChange("priority")}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  phoneTypePref === "priority" && styles.optionTextActive,
                ]}
              >
                Priority
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        <ThemedText style={styles.currentValue}>
          Current: {phoneTypePref || "Not set"}
        </ThemedText>
      </ThemedView>
      <ThemedView style={{ marginTop: 32 }}>
        <ThemedView style={styles.divider} />
        <ThemedText type="subtitle">About the app</ThemedText>
        <ThemedView
          style={{
            flex: 1,
            marginTop: 16,

          }}
        >
          <ThemedView>
            <ThemedText>Version 1.0 - Oct 2025</ThemedText>
            <ThemedText>by Afshin Mokhtari</ThemedText>
            <ThemedText style={{ marginTop: 16 }} />
            <ThemedText>
              This app will read in a csv file of names and numbers, let you
              select all or some of them, then lets you choose a message to send
              via text message to all those people.
            </ThemedText>
            <ThemedText>for David Schevick, LAc</ThemedText>
          </ThemedView>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </ThemedView>
      </ThemedView>
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
  settingSection: {
    marginTop: 20,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  loader: {
    marginVertical: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  optionButtonActive: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  optionTextActive: {
    color: "#fff",
  },
  currentValue: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 8,
  },
  divider: {
    height: 1,
    opacity: 0.2,
    backgroundColor: "#999", // Will adapt to theme via ThemedView
    marginVertical: 16,
  },
  logo: {
    width: 128,
    height: 128,
    marginTop: 16
  },
});
