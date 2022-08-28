import "./Header.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import logo from './logo_g.png';

const Header = () => {
    
    const [activeTab, setActiveTab] = useState("Home");
    const [menuVisible, setMenuVisible] = useState("block");
    const location = useLocation();
    

    useEffect(()=>{
        if(location.pathname === "/")
        {
            setActiveTab("Home");

        }else if(location.pathname.indexOf("/persons") >=0 )
        {
            setActiveTab("Persons")
        }
        else if(location.pathname.indexOf("/events") >= 0)
        {
            setActiveTab("Events")
        }
        else if(location.pathname.indexOf("/about") >= 0)
        {
            setActiveTab("About")
        }else{
            
            setActiveTab("Unknow")
        }
    }, [location])

    return(
        
        <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <a href="#" class="navbar-brand" >
                    <img src={logo} alt={"Logo"} style={{width : "40px", marginTop: '-10px'}} onClick={()=>{ setMenuVisible(menuVisible === "block" ? "none" : "block")}}></img></a>
            </div>
            <ul class="nav navbar-nav" style={{display : menuVisible }}>
                
                <li class={`${activeTab === "Persons" ? "active" : ""}`}><a href="/persons" onClick={()=> setActiveTab("Persons")}>Persons</a></li>
                <li class={`${activeTab === "Events" ? "active" : ""}`}><a href="/events" onClick={()=> setActiveTab("Events")}>Events</a></li>
                
            </ul>
        </div>
    </nav>
    )

}

export default Header;