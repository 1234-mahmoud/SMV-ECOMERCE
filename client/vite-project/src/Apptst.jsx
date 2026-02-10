import { useState, useEffect } from "react";
import "./style/App.css";
import Axios from "axios";
import Testuser from "./Testuser";
function App() {
    const [users, setUsers] = useState([]);
    const [name,setName] = useState("");
    const [age,setAge] = useState("");
    const [email,setEmail] = useState("");
    useEffect(() => {
      Axios.get("http://localhost:3000/users").then((res) => {
        setUsers(res.data);
      });
    }, [users]);

  const createUser = () => {
  Axios.post("http://localhost:3000/createUser", {
  firstName: name,
  age: age,
  email: email
  }).then((res) => {
  console.log(res.data);
  });
  };

  return (
    <div className="">
   
{users.map((u) => {
  return (
    <ul key={u._id}>
      <li>Name:{u.firstName}</li>
      <li>Age:{u.age}</li>
      <li>E-mail:{u.email}</li>
    </ul>
  );
})}

<div>
  <input name="firstName" type="text" placeholder="name"  onChange={e=>setName(e.target.value)}/>
  <input name="age" type="number" placeholder="age"  onChange={e=>setAge(e.target.value)}/>
  <input name="email" type="email" placeholder="email"  onChange={e=>setEmail(e.target.value)}/>
  <button onClick={createUser}>Create User</button>
</div>


<hr />
<br />
<br />

<Testuser/>
    </div>
  );
}

export default App;




