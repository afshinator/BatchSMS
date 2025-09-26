import { ThemedText } from "@/components/themed-text";
import { ScrollView, StyleSheet, View } from "react-native";

// A small type for the parsed data, assuming the keys are standardized
type CsvRow = {
  "First Name": string;
  "Mobile phone number": string;
  "Priority phone number": string;
  "File name": string;
};

// Props for the component
interface CsvDisplayTableProps {
  data: CsvRow[];
}

export const CsvDisplayTable: React.FC<CsvDisplayTableProps> = ({ data }) => {
  // If no data, return nothing
  if (!data || data.length === 0) {
    return null;
  }
  console.log("data .....", data);
  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.headerRow}>
        <ThemedText style={[styles.headerText, styles.firstNameColumn]}>
          First Name
        </ThemedText>
        <ThemedText style={styles.headerText}>Mobile Phone</ThemedText>
        <ThemedText style={styles.headerText}>Priority Phone</ThemedText>
        <ThemedText style={styles.headerText}>File Name</ThemedText>
      </View>

      {/* Table Body - Use ScrollView for vertical scrolling if needed */}
      <ScrollView>
        {data.map((row, index) => (
          <View
            key={index}
            style={[styles.row, index % 2 === 0 && styles.evenRow]}
          >
            <ThemedText
              type="small"
              style={[styles.cell, styles.firstNameColumn]}
            >
              {row["First Name"]}
            </ThemedText>
            <ThemedText type="tiny" style={styles.cell}>
              {row["Mobile Phone"]}
            </ThemedText>
            <ThemedText type="tiny" style={styles.cell}>
              {row["Priority Phone"]}
            </ThemedText>
            <ThemedText type="tiny" style={styles.cell}>
              {row["File Name"]}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 16,
    overflow: "hidden", // Ensures content stays within the border
  },
  headerRow: {
    flexDirection: "row",
    // backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontWeight: "bold",
    flex: 1, // Distribute columns evenly
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  evenRow: {
    // backgroundColor: "#f9f9f9",
    backgroundColor: "#555",
  },
  cell: {
    flex: 1,
    textAlign: "left",
  },
  firstNameColumn: {
    flex: 1.2, // Make this column slightly wider to prevent width variation
    textAlign: "left",
    paddingLeft: 8,
  },
});
