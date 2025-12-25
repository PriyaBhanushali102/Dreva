import React, { useState } from "react";
import { LoginForm, Container} from "../components/index";

function Login() {
    const [error, setError] = useState('');
    return (
        <Container>
            <div className="py-8 max-w-md mx-auto">

                {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
                    {error}
                </div>
                )}


                <LoginForm setError={setError} />
            </div>
        </Container>
    )
}

export default Login;

