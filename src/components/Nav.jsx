import React from "react";
import { Link } from 'react-router-dom';

const Nav = () => {
    return ( 
        <div className="nav-bar">
            <h4>GenshinHub</h4>
            <h4><Link to="/">Home</Link></h4>
            <h4><Link to="/create-post">Create New Post</Link></h4>
        </div>
    )
}
export default Nav;