import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

interface RecipientSelectorProps {
  documentContents: [] | null;
  phoneTypePref?: "mobile" | "priority" | null;
  onFinalize: () => void;
}

/**
 * RecipientSelector component with full interaction logic, handling phone selection,
 * row selection, and final output generation.
 */
export const RecipientSelector = ({
  documentContents,
  phoneTypePref,
  onFinalize,
}: RecipientSelectorProps) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [phoneSelections, setPhoneSelections] = useState<
    Map<number, "mobile" | "priority">
  >(new Map());
  const [hasFinishedPicking, setHasFinishedPicking] = useState(false);
  const [finishedList, setFinishedList] = useState([{}]);

  // Initialize selectedRows and phone selections when documentContents changes
  useEffect(() => {
    setSelectedRows(new Set());
    if (documentContents) {
      const initialPhoneSelections = new Map();
      documentContents.forEach((row, index) => {
        const hasMobilePhone =
          row["Mobile Phone"] && row["Mobile Phone"].trim() !== "";
        const hasPriorityPhone =
          row["Priority Phone"] && row["Priority Phone"].trim() !== "";

        // If only mobile phone exists, select mobile; otherwise default to priority
        if (hasMobilePhone && !hasPriorityPhone) {
          initialPhoneSelections.set(index, "mobile");
        } else {
          initialPhoneSelections.set(index, "priority"); // Default to priority phone
        }
      });
      setPhoneSelections(initialPhoneSelections);
    }
  }, [documentContents]);

  const handleSelectAll = () => {
    if (documentContents) {
      const allIndices = new Set(documentContents.map((_, index) => index));
      setSelectedRows(allIndices);
    }
  };

  const handleSelectNone = () => {
    setSelectedRows(new Set());
  };

  const toggleRowSelection = (index: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedRows(newSelection);
  };

  const togglePhoneSelection = (index: number) => {
    const newPhoneSelections = new Map(phoneSelections);
    const currentSelection = newPhoneSelections.get(index) || "priority";
    newPhoneSelections.set(
      index,
      currentSelection === "mobile" ? "priority" : "mobile"
    );
    setPhoneSelections(newPhoneSelections);
  };

  const handleFinishedPicking = () => {
    if (!documentContents) return;

    const result = Array.from(selectedRows).map((index) => {
      const row = documentContents[index];
      const phoneType = phoneSelections.get(index) || "priority";
      const phoneNumber =
        phoneType === "mobile" ? row["Mobile Phone"] : row["Priority Phone"];

      return {
        name: row["First Name"],
        phoneNumber: phoneNumber,
      };
    });

    setHasFinishedPicking(true);
    setFinishedList(result);
    console.log("Selected recipients:", result);
  };

  return (
    <View style={styles.container}>
      {/* Select All/None buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSelectAll}>
          <ThemedText style={styles.buttonText}>Select All</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSelectNone}>
          <ThemedText style={styles.buttonText}>Select None</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.listHeader}>
        <View style={styles.checkboxColumn}></View>

        <ThemedText style={[styles.headerCell, styles.phoneColumn]}>
          Mobile Phone
        </ThemedText>
        <ThemedText style={[styles.headerCell, styles.phoneColumn]}>
          Priority Phone
        </ThemedText>
        <ThemedText style={[styles.headerCell, styles.nameColumn]}>
          Name
        </ThemedText>
      </View>
      {documentContents &&
        documentContents.map((row, index) => {
          const hasMobilePhone =
            row["Mobile Phone"] && row["Mobile Phone"].trim() !== "";
          const hasPriorityPhone =
            row["Priority Phone"] && row["Priority Phone"].trim() !== "";
          const isSelected = selectedRows.has(index);
          const selectedPhoneType = phoneSelections.get(index) || "priority";

          return (
            <View style={styles.row} key={index}>
              <View style={styles.checkboxColumn}>
                <TouchableOpacity
                  style={styles.cellCheckbox}
                  onPress={() => toggleRowSelection(index)}
                >
                  <View
                    style={[
                      styles.checkboxPlaceholder,
                      isSelected && styles.checkboxSelected,
                    ]}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.phoneColumn}
                onPress={() => togglePhoneSelection(index)}
                disabled={!hasMobilePhone}
              >
                <ThemedText
                  style={[
                    styles.phoneText,
                    selectedPhoneType === "mobile" && styles.selectedPhoneText,
                    !hasMobilePhone && styles.disabledPhoneText,
                  ]}
                >
                  {row["Mobile Phone"]}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.phoneColumn}
                onPress={() => togglePhoneSelection(index)}
                disabled={!hasPriorityPhone}
              >
                <ThemedText
                  style={[
                    styles.phoneText,
                    selectedPhoneType === "priority" &&
                      styles.selectedPhoneText,
                    !hasPriorityPhone && styles.disabledPhoneText,
                  ]}
                >
                  {row["Priority Phone"]}
                </ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.nameColumn}>
                {row["First Name"]}
              </ThemedText>
            </View>
          );
        })}

      {/* Finished Picking Recipients button */}
      <View style={styles.finishButtonContainer}>
        <TouchableOpacity
          style={[
            styles.finishButton,
            selectedRows.size === 0 && styles.finishButtonDisabled,
          ]}
          onPress={handleFinishedPicking}
          disabled={selectedRows.size === 0}
        >
          <ThemedText
            style={[
              styles.finishButtonText,
              selectedRows.size === 0 && styles.finishButtonTextDisabled,
            ]}
          >
            Finished Picking Recipients
          </ThemedText>
        </TouchableOpacity>
      </View>

      {hasFinishedPicking && (
        <View>
          <ThemedText type="defaultSemiBold">{finishedList.length} of {documentContents.length} selected.</ThemedText>
          <ThemedText> 
            Now go to Pick Message tab to select what message to send to these people.
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    gap: 10,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  listHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#999",
  },
  headerCell: {
    fontWeight: "bold",
  },
  checkboxColumn: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  nameColumn: {
    width: 120,
  },
  phoneColumn: {
    width: 110,
  },
  cellCheckbox: {
    width: 30,
  },
  checkboxPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#3b82f6",
    backgroundColor: "#e0f2fe",
  },
  checkboxSelected: {
    backgroundColor: "#3b82f6",
  },
  phoneText: {
    color: "#666",
  },
  selectedPhoneText: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  disabledPhoneText: {
    color: "#ccc",
  },
  finishButtonContainer: {
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  finishButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  finishButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  finishButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  finishButtonTextDisabled: {
    color: "#9ca3af",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 35,
  },
});

export default RecipientSelector;
