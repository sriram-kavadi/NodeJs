import java.sql.*;
import java.util.Scanner;

public class StudentCRUD {

    static final String URL = "jdbc:mysql://localhost:3306/studentdb";
    static final String USER = "root";
    static final String PASSWORD = "YOUR_PASSWORD"; // change this

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        try {
            // Load MySQL Driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Establish connection
            Connection con = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Connected Successfully!");

            while (true) {

                System.out.println("\n===== STUDENT CRUD MENU =====");
                System.out.println("1. Insert");
                System.out.println("2. View All");
                System.out.println("3. Update Marks");
                System.out.println("4. Delete");
                System.out.println("5. Exit");
                System.out.print("Choose option: ");

                int choice = sc.nextInt();
                sc.nextLine();

                switch (choice) {

                    // ================= INSERT =================
                    case 1:
                        System.out.print("Enter Name: ");
                        String name = sc.nextLine();

                        System.out.print("Enter Email: ");
                        String email = sc.nextLine();

                        System.out.print("Enter Marks: ");
                        int marks = sc.nextInt();

                        String insertSQL = "INSERT INTO students(name, email, marks) VALUES (?, ?, ?)";
                        PreparedStatement psInsert = con.prepareStatement(insertSQL);
                        psInsert.setString(1, name);
                        psInsert.setString(2, email);
                        psInsert.setInt(3, marks);

                        psInsert.executeUpdate();
                        System.out.println("Record Inserted!");

                        psInsert.close();
                        break;

                    // ================= VIEW =================
                    case 2:
                        String selectSQL = "SELECT * FROM students";
                        PreparedStatement psSelect = con.prepareStatement(selectSQL);
                        ResultSet rs = psSelect.executeQuery();

                        while (rs.next()) {
                            System.out.println(
                                    rs.getInt("id") + " | " +
                                    rs.getString("name") + " | " +
                                    rs.getString("email") + " | " +
                                    rs.getInt("marks")
                            );
                        }

                        rs.close();
                        psSelect.close();
                        break;

                    // ================= UPDATE =================
                    case 3:
                        System.out.print("Enter Student ID: ");
                        int id = sc.nextInt();

                        System.out.print("Enter New Marks: ");
                        int newMarks = sc.nextInt();

                        String updateSQL = "UPDATE students SET marks=? WHERE id=?";
                        PreparedStatement psUpdate = con.prepareStatement(updateSQL);
                        psUpdate.setInt(1, newMarks);
                        psUpdate.setInt(2, id);

                        psUpdate.executeUpdate();
                        System.out.println("Record Updated!");

                        psUpdate.close();
                        break;

                    // ================= DELETE =================
                    case 4:
                        System.out.print("Enter Student ID: ");
                        int deleteId = sc.nextInt();

                        String deleteSQL = "DELETE FROM students WHERE id=?";
                        PreparedStatement psDelete = con.prepareStatement(deleteSQL);
                        psDelete.setInt(1, deleteId);

                        psDelete.executeUpdate();
                        System.out.println("Record Deleted!");

                        psDelete.close();
                        break;

                    // ================= EXIT =================
                    case 5:
                        System.out.println("Exiting...");
                        con.close();
                        sc.close();
                        System.exit(0);

                    default:
                        System.out.println("Invalid Choice!");
                }
            }

        } catch (Exception e) {
            System.out.println("Error: " + e);
        }
    }
}