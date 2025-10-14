export const handleLogout = async (isAdmin = false) => {
  const endpoint = isAdmin
    ? "http://localhost:8000/api/auth/admin/logout"
    : "http://localhost:8000/api/auth/logout";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      console.log("Logout successful");
      window.location.href = "/client-sign-in"; // redirect to login
    } else {
      console.error("Logout failed");
    }
  } catch (err) {
    console.error("Logout error:", err);
  }
};
