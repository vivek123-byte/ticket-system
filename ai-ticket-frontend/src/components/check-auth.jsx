// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function CheckAuth({ children, protectedRoute }) {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (protectedRoute) {
//       if (!token) {
//         navigate("/login");
//       } else {
//         setLoading(false);
//       }
//     } else {
//       if (token) {
//         navigate("/");
//       } else {
//         setLoading(false);
//       }
//     }
//   }, [navigate, protectedRoute]);

//   if (loading) {
//     return <div>loading...</div>;
//   }
//   return children;
// }

// export default CheckAuth;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckAuth({ children, protectedRoute, adminOnly }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (protectedRoute) {
      if (!token || !user) {
        navigate("/login", { replace: true });
      } else if (adminOnly && user.role !== "admin") {
        navigate("/", { replace: true }); // redirect non-admins
      } else {
        setLoading(false); // ✅ allow access
      }
    } else {
      if (token) {
        navigate("/", { replace: true });
      } else {
        setLoading(false);
      }
    }
  }, [navigate, protectedRoute, adminOnly]);

  if (loading) return <div>Loading...</div>;

  return children;
}

export default CheckAuth;
