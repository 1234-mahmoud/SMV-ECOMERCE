import { useState } from "react";
import Axios from "axios";

export default function Testuser() {
  const [name, setName] = useState("");    
  const [email, setEmail] = useState("");    
  const [password, setPassword] = useState("");    
  const [role, setRole] = useState("");    

  const createUser = () => {
    Axios.post("http://localhost:3000/createUser", {
      name,
      email,
      password,
      role
    }).then((res) => {
      console.log(res.data);
      alert("User Created Successfully!");
    }).catch((err) => {
      console.error(err);
      alert("Error creating user");
    });
  };

  return (
    <div>
      <form>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          name="role"
        >
          <option value="">Choose Your Role...</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="button" onClick={createUser}>Create User</button>
      </form>
    </div>
  );
}
