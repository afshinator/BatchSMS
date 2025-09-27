import { ThemedText } from "@/components/themed-text";
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface DocumentContent {
  "File Name": string;
  "First Name": string;
  "Priority Phone": string;
  "Mobile Phone": string;
}

interface FinalizedRecipient {
  name: string;
  phone: string;
}

interface RecipientSelectorProps {
  documentContents: DocumentContent[];
  phoneTypePref?: 'mobile' | 'priority';
  onFinalize: (selections: FinalizedRecipient[]) => void;
}

export const RecipientSelector: React.FC<RecipientSelectorProps> = ({ 
  documentContents, 
  phoneTypePref = 'mobile', 
  onFinalize 
}) => {
  const [selectedRows, setSelectedRows] = useState<boolean[]>(
    new Array(documentContents?.length || 0).fill(false)
  );
  const [phonePreferences, setPhonePreferences] = useState<('mobile' | 'priority')[]>(
    new Array(documentContents?.length || 0).fill(phoneTypePref)
  );

  // If no data, return nothing
  if (!documentContents || documentContents.length === 0) {
    return null;
  }

  const handleSelectAll = () => {
    setSelectedRows(new Array(documentContents.length).fill(true));
  };

  const handleSelectNone = () => {
    setSelectedRows(new Array(documentContents.length).fill(false));
  };

  const handleRowToggle = (index: number) => {
    const newSelectedRows = [...selectedRows];
    newSelectedRows[index] = !newSelectedRows[index];
    setSelectedRows(newSelectedRows);
  };

  const handlePhoneToggle = (index: number) => {
    const row = documentContents[index];
    const hasMobilePhone = row["Mobile Phone"] && row["Mobile Phone"].trim() !== '';
    const hasPriorityPhone = row["Priority Phone"] && row["Priority Phone"].trim() !== '';
    
    // Only toggle if both phone types are available
    if (hasMobilePhone && hasPriorityPhone) {
      const newPhonePreferences = [...phonePreferences];
      newPhonePreferences[index] = newPhonePreferences[index] === 'mobile' ? 'priority' : 'mobile';
      setPhonePreferences(newPhonePreferences);
    }
  };

  const handleFinalizeSelections = () => {
    const finalizedSelections: FinalizedRecipient[] = [];
    
    selectedRows.forEach((isSelected, index) => {
      if (isSelected) {
        const row = documentContents[index];
        const phoneType = phonePreferences[index];
        const phone = phoneType === 'mobile' ? row["Mobile Phone"] : row["Priority Phone"];
        
        // Only add if there's a phone number and it's not empty
        if (phone && phone.trim() !== '') {
          finalizedSelections.push({
            name: row["First Name"],
            phone: phone
          });
        }
      }
    });
    
    console.log("In th eend ", finalizedSelections)
    onFinalize(finalizedSelections);
  };

  const selectedCount = selectedRows.filter(Boolean).length;

  return (
    <View style={styles.container}>
      {/* Selection Control Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSelectAll}>
          <ThemedText style={styles.buttonText}>Select All</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSelectNone}>
          <ThemedText style={styles.buttonText}>Select None</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Table Header */}
      <View style={styles.headerRow}>
        <ThemedText style={[styles.headerText, styles.firstNameColumn]}>
          First Name
        </ThemedText>
        <ThemedText style={[styles.headerText, styles.phoneColumn]}>Mobile Phone</ThemedText>
        <ThemedText style={[styles.headerText, styles.phoneColumn]}>Priority Phone</ThemedText>
        <View style={styles.checkboxHeaderContainer} />
      </View>

      {/* Table Body - Use ScrollView for vertical scrolling if needed */}
      <ScrollView>
        {documentContents.map((row, index) => {
          const hasMobilePhone = row["Mobile Phone"] && row["Mobile Phone"].trim() !== '';
          const hasPriorityPhone = row["Priority Phone"] && row["Priority Phone"].trim() !== '';
          
          return (
            <TouchableOpacity
              key={index}
              style={[styles.row, index % 2 === 0 && styles.evenRow]}
              onPress={() => handleRowToggle(index)}
              activeOpacity={0.7}
            >
              <ThemedText
                type="small"
                style={[styles.cell, styles.firstNameColumn]}
              >
                {row["First Name"]}
              </ThemedText>
              
              <TouchableOpacity 
                style={styles.phoneColumn}
                onPress={(e) => {
                  e.stopPropagation();
                  handlePhoneToggle(index);
                }}
                disabled={!hasMobilePhone || (!hasMobilePhone && !hasPriorityPhone)}
              >
                <ThemedText 
                  // type="tiny" 
                  style={[
                    styles.phoneText,
                    phonePreferences[index] === 'mobile' && styles.activePhone,
                    !hasMobilePhone && styles.disabledPhone
                  ]}
                >
                  {row["Mobile Phone"] || 'N/A'}
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.phoneColumn}
                onPress={(e) => {
                  e.stopPropagation();
                  handlePhoneToggle(index);
                }}
                disabled={!hasPriorityPhone || (!hasMobilePhone && !hasPriorityPhone)}
              >
                <ThemedText 
                  // type="tiny" 
                  style={[
                    styles.phoneText,
                    phonePreferences[index] === 'priority' && styles.activePhone,
                    !hasPriorityPhone && styles.disabledPhone
                  ]}
                >
                  {row["Priority Phone"] || 'N/A'}
                </ThemedText>
              </TouchableOpacity>
              
              <View style={styles.checkboxContainer}>
                <View style={[styles.checkbox, selectedRows[index] && styles.checkedBox]}>
                  {selectedRows[index] && (
                    <ThemedText style={styles.checkmark}>✓</ThemedText>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Finalize Button */}
      <View style={styles.finalizeContainer}>
        <TouchableOpacity 
          style={[styles.finalizeButton, selectedCount === 0 && styles.disabledButton]} 
          onPress={handleFinalizeSelections}
          disabled={selectedCount === 0}
        >
          <ThemedText style={[styles.finalizeButtonText, selectedCount === 0 && styles.disabledText]}>
            Finalize Selections ({selectedCount})
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 12,
    lineHeight: 12,
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  evenRow: {
    backgroundColor: "#555",
  },
  cell: {
    flex: 1,
    textAlign: "left",
    lineHeight: 8,
  },
  phoneCell: {
    justifyContent: "center",
  },
  phoneText: {
    lineHeight: 8,
    textAlign: "left",
  },
  activePhone: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  firstNameColumn: {
    width: 120,
    textAlign: "left",
    paddingLeft: 8,
  },
  phoneColumn: {
    minWidth: 60,
    paddingHorizontal: 4,
    alignItems: "flex-start",
  },
  checkboxHeaderContainer: {
    flex: 1,
    minWidth: 40,
  },
  checkboxContainer: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: 16,
    minWidth: 40,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkedBox: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  checkmark: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  finalizeContainer: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  finalizeButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  finalizeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledText: {
    color: "#666",
  },
  disabledPhone: {
    color: "#999",
    fontStyle: "italic",
  },
});