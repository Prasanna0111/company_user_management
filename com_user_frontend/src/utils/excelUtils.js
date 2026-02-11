import * as XLSX from "xlsx";
import { formatDate } from "./dateUtils";
export const exportUsersToExcel = (users, filename = "Users_List") => {
  try {
    const exportData = users.map((user, index) => ({
      "S.No": index + 1,
      Name: `${user.first_name} ${user.last_name}`,
      Email: user.email,
      Company: user.company_name || "Unassigned",
      Designation: user.designation,
      DOB: formatDate(user.dob),
      Status: user.active ? "Active" : "Inactive",
      "Added On": formatDate(user.created_at),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, `${filename}.xlsx`);

    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
};
