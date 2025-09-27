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

  // Initialize selectedRows when documentContents changes
  useEffect(() => {
    setSelectedRows(new Set());
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
          
          console.log(row);
          return (
            <View style={styles.row} key={index}>
              <View style={styles.checkboxColumn}>
                <TouchableOpacity
                  style={styles.cellCheckbox}
                  onPress={() => toggleRowSelection(index)}
                >
                  <View style={[
                    styles.checkboxPlaceholder,
                    isSelected && styles.checkboxSelected
                  ]} />
                </TouchableOpacity>
              </View>
              <ThemedText style={styles.phoneColumn}>
                {row["Mobile Phone"]}
              </ThemedText>
              <ThemedText style={styles.phoneColumn}>
                {row["Priority Phone"]}
              </ThemedText>
              <ThemedText style={styles.nameColumn}>
                {row["First Name"]}
              </ThemedText>
            </View>
          );
        })}
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
  row: {
    flexDirection: "row",
    alignItems: 'center',
    height: 35,
  },
});

export default RecipientSelector;