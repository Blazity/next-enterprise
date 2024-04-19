import React, { useState } from "react"

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignUp = () => {
    // Implement your sign-up logic here
    console.log("Sign up button clicked")
    console.log("Email:", email)
    console.log("Password:", password)
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <form>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button type="button" onClick={handleSignUp}>
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default SignUpPage
