package com.ace.controller;

import java.io.IOException;
import java.sql.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/students/*")
public class StudentController extends HttpServlet {

    private static final long serialVersionUID = 1L;

    // Database connection settings
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/studentdb?useSSL=false&serverTimezone=Asia/Kolkata";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASS = "YOUR_PASSWORD"; // change this

    // ====================== GET METHOD ======================
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String path = req.getPathInfo();
        if (path == null) path = "/list";

        try {
            switch (path) {

                // Show form
                case "/new":
                    req.getRequestDispatcher("/addStudent.jsp").forward(req, resp);
                    break;

                // Show list (default)
                case "/list":
                default:

                    List<Map<String, Object>> students = new ArrayList<>();

                    Class.forName("com.mysql.cj.jdbc.Driver");

                    try (
                        Connection con = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASS);
                        PreparedStatement ps = con.prepareStatement(
                                "SELECT id, name, email, marks FROM students ORDER BY id");
                        ResultSet rs = ps.executeQuery()
                    ) {
                        while (rs.next()) {
                            Map<String, Object> s = new HashMap<>();
                            s.put("id", rs.getInt("id"));
                            s.put("name", rs.getString("name"));
                            s.put("email", rs.getString("email"));
                            s.put("marks", rs.getInt("marks"));
                            students.add(s);
                        }
                    }

                    req.setAttribute("students", students);
                    req.getRequestDispatcher("/index.jsp").forward(req, resp);
            }

        } catch (Exception e) {
            throw new ServletException(e);
        }
    }

    // ====================== POST METHOD ======================
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String path = req.getPathInfo();
        if (path == null) path = "/insert";

        try {
            switch (path) {

                case "/insert":
                default:

                    String name = req.getParameter("name");
                    String email = req.getParameter("email");
                    int marks = Integer.parseInt(req.getParameter("marks"));

                    Class.forName("com.mysql.cj.jdbc.Driver");

                    try (
                        Connection con = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASS);
                        PreparedStatement ps = con.prepareStatement(
                                "INSERT INTO students(name, email, marks) VALUES (?, ?, ?)")
                    ) {
                        ps.setString(1, name);
                        ps.setString(2, email);
                        ps.setInt(3, marks);
                        ps.executeUpdate();
                    }

                    // Redirect to list page
                    resp.sendRedirect(req.getContextPath() + "/students/list");
            }

        } catch (Exception e) {
            throw new ServletException(e);
        }
    }
}