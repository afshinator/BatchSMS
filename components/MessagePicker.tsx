import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useStateMgr } from "@/hooks/use-state-mgr";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface MessagePickerProps {
  message1: string;
  message2: string;
  message3: string;
  selectedMessage: "1" | "2" | "3";
  onMessage1Change: (text: string) => void;
  onMessage2Change: (text: string) => void;
  onMessage3Change: (text: string) => void;
  onSelectedMessageChange: (option: "1" | "2" | "3") => void;
  onSave: () => void;
  onConfirmSelection: () => void;
}

export default function MessagePicker({
  message1,
  message2,
  message3,
  selectedMessage,
  onMessage1Change,
  onMessage2Change,
  onMessage3Change,
  onSelectedMessageChange,
  onSave,
  onConfirmSelection,
}: MessagePickerProps) {
  const { setPickedMessage } = useStateMgr();

  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#1c1c1e" },
    "background"
  );
  const borderColor = useThemeColor(
    { light: "#e0e0e0", dark: "#404040" },
    "text"
  );
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor(
    { light: "#999", dark: "#666" },
    "text"
  );

  // Track original values to detect changes - only set on mount
  const [originalMessage1, setOriginalMessage1] = useState(message1);
  const [originalMessage2, setOriginalMessage2] = useState(message2);
  const [originalMessage3, setOriginalMessage3] = useState(message3);

  // Track whether message has been picked (confirmed)
  const [isPicked, setIsPicked] = useState(false);

  // Check if there are any unsaved changes
  const hasChanges =
    message1 !== originalMessage1 ||
    message2 !== originalMessage2 ||
    message3 !== originalMessage3;

  const getCurrentMessage = () => {
    switch (selectedMessage) {
      case "1":
        return message1;
      case "2":
        return message2;
      case "3":
        return message3;
      default:
        return "";
    }
  };

  const handleMessageChange = (text: string) => {
    switch (selectedMessage) {
      case "1":
        onMessage1Change(text);
        break;
      case "2":
        onMessage2Change(text);
        break;
      case "3":
        onMessage3Change(text);
        break;
    }
  };

  const handleSave = () => {
    onSave();
    // After save, update the original values
    setOriginalMessage1(message1);
    setOriginalMessage2(message2);
    setOriginalMessage3(message3);
  };

  const handleConfirmSelection = async () => {
    await onConfirmSelection();
    const msg = getCurrentMessage();
    console.log("chosen message: ", msg);
    setPickedMessage(msg);
    setIsPicked(true);
  };

  const handleResetPick = () => {
    setIsPicked(false);
  };

  const renderMessageButton = (
    optionNumber: "1" | "2" | "3",
    label: string
  ) => {
    const isSelected = selectedMessage === optionNumber;

    return (
      <TouchableOpacity
        style={[
          styles.messageButton,
          {
            backgroundColor: isSelected ? "#007AFF" : backgroundColor,
            borderColor: isSelected ? "#007AFF" : borderColor,
          },
        ]}
        onPress={() => onSelectedMessageChange(optionNumber)}
        activeOpacity={0.7}
      >
        <ThemedText
          type="defaultSemiBold"
          style={{ color: isSelected ? "#fff" : textColor }}
        >
          {label}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView
          style={[styles.content, { backgroundColor: "transparent" }]}
        >
          {/* Message Selection Buttons */}
          <ThemedView
            style={[styles.buttonRow, { backgroundColor: "transparent" }]}
          >
            {renderMessageButton("1", "1")}
            {renderMessageButton("2", "2")}
            {renderMessageButton("3", "3")}
          </ThemedView>

          {/* Action Buttons */}
          <ThemedView
            style={[styles.actionRow, { backgroundColor: "transparent" }]}
          >
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.saveButton,
                (!hasChanges || isPicked) && styles.disabledButton,
              ]}
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={!hasChanges || isPicked}
            >
              <ThemedText
                type="defaultSemiBold"
                style={styles.actionButtonText}
              >
                Save Changes
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.confirmButton,
                isPicked && styles.disabledButton,
              ]}
              onPress={handleConfirmSelection}
              activeOpacity={0.7}
              disabled={isPicked}
            >
              <ThemedText
                type="defaultSemiBold"
                style={styles.actionButtonText}
              >
                Pick Message
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedText
            type="small"
            style={{ marginBottom: 8, fontWeight: "bold" }}
          >
            Use [name] in the text to indicate where to insert name in the
            message when sending.
          </ThemedText>

          {/* Edit Area */}
          <ThemedView
            style={[styles.editContainer, { backgroundColor: "transparent" }]}
          >
            <ThemedText type="defaultSemiBold" style={styles.editLabel}>
              {isPicked ? "Selected" : "Editing"}: Message {selectedMessage}
            </ThemedText>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor,
                  backgroundColor: isPicked ? borderColor : backgroundColor,
                  color: textColor,
                },
              ]}
              value={getCurrentMessage()}
              onChangeText={handleMessageChange}
              placeholder="Enter your message here..."
              placeholderTextColor={placeholderColor}
              multiline
              textAlignVertical="top"
              editable={!isPicked}
            />
          </ThemedView>

          {/* Reset Pick Button - Only show when message is picked */}
          {isPicked && (
            <ThemedView>
              <ThemedView
                style={[
                  styles.resetButtonContainer,
                  { backgroundColor: "transparent" },
                ]}
              >
                <TouchableOpacity
                  style={[styles.resetButton]}
                  onPress={handleResetPick}
                  activeOpacity={0.7}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.resetButtonText}
                  >
                    Reset Pick
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
              <ThemedText style={{ marginTop: 16 }}>
                👉 Now you can go to{" "}
                <Link href="/send">
                  <ThemedText type="link">Send Messages</ThemedText>
                </Link>
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 0,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  messageButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#34C759",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  disabledButton: {
    backgroundColor: "#999",
    opacity: 0.5,
  },
  actionButtonText: {
    color: "#fff",
  },
  editContainer: {
    marginBottom: 20,
  },
  editLabel: {
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 200,
    maxHeight: 400,
  },
  resetButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: "#B98110",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#fff",
  },
});
