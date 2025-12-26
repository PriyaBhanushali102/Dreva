import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children, vendorOnly = false }) {
    const { user, isVendor } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/", { replace: true });
            return;
        }

        if (vendorOnly && !isVendor) {
            navigate("/", { replace: true });
        }
    }, [user, isVendor, vendorOnly, navigate]);

    if (!user || (vendorOnly && !isVendor)) {
        return null;
    }

    return children;
}
export default ProtectedRoute;

