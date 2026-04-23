<%@ page contentType="text/html; charset=UTF-8" %>

<html>
<head>
    <title>Add Student</title>
</head>

<body>

    <h2>Add Student</h2>

    <!-- Form to insert student -->
    <form action="<%=request.getContextPath()%>/students/insert" method="post">

        <!-- Name -->
        <label>Name:</label>
        <input type="text" name="name" required>
        <br><br>

        <!-- Email -->
        <label>Email:</label>
        <input type="email" name="email" required>
        <br><br>

        <!-- Marks -->
        <label>Marks:</label>
        <input type="number" name="marks" required>
        <br><br>

        <!-- Submit -->
        <button type="submit">Save</button>

    </form>

    <br>

    <!-- Back to list -->
    <a href="<%=request.getContextPath()%>/students/list">Back to List</a>

</body>
</html>