import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function Header(){

    const loggedData = useContext(UserContext);
    const navigate = useNavigate();

    function Logout()
    {
        localStorage.removeItem("nutriTrack-user");
        loggedData.setLoggedUser(null);
        navigate("/login")

    }
    return(
        <nav>
        <h1>You are logged in!</h1>
        <ul>
            <li>Home</li>
            <li onClick={Logout}>Logout</li>
        </ul>
        </nav>
    )
}