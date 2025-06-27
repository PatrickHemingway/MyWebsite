import "./navBar.css"

const NavBar = (props) => {
    return (
        <div className="navbar-container">
            <h1>{props.navData.title}</h1>
            <nav className="navbar-links-row">
                {props.navData.links.map((link) => (
                    <a key={link.id} href={link.link} className = "navbar-link">
                        {link.text}
                    </a>
                ))}
            </nav>
        </div>
    )
}

export default NavBar;