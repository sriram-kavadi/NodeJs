<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="java.util.*" %>

<html>
<head>
    <title>Students</title>

    <style>
        table {
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
        }
    </style>
</head>

<body>

    <h2>Students List</h2>

    <!-- Link to Add Student -->
    <a href="<%=request.getContextPath()%>/students/new">Add New Student</a>

    <br><br>

    <table>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Marks</th>
        </tr>

        <%
            List students = (List) request.getAttribute("students");

            if (students != null) {
                for (Object o : students) {
                    Map s = (Map) o;
        %>

        <tr>
            <td><%= s.get("id") %></td>
            <td><%= s.get("name") %></td>
            <td><%= s.get("email") %></td>
            <td><%= s.get("marks") %></td>
        </tr>

        <%
                }
            }
        %>

    </table>

</body>
</html>