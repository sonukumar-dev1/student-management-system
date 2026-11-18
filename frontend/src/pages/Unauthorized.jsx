
import { Link } from "react-router-dom";

function Unauthorized() {
    return (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <h1>403 - Access Denied</h1>

            <p style={{ margin: "15px 0" }}>
                Sorry, you do not have permission to access this page.
            </p>

            <Link to="/login">Go to Login</Link>
        </div>
    );
}

export default Unauthorized;
