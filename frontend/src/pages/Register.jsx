import React from "react";
import { RegisterForm, Container} from "../components/index"
function Signup() {
  
    return (
        <Container>
            <div className="py-8 max-w-md mx-auto"> 
                <RegisterForm />
            </div>
        </Container>
    )
}

export default Signup;
