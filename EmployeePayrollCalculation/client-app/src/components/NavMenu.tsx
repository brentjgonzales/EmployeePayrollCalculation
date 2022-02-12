import React, {useState} from 'react';
import {
    Collapse,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink
} from 'reactstrap';
import {Link} from 'react-router-dom';
import './NavMenu.css';
import Layout from "./Layout";

interface ILocalState {
    collapsed: boolean
}

const NavMenu = () => {

    const [state, setState] = useState<ILocalState>({
        collapsed: true
    });

    const toggleNavbar = () => {
        setState({
            collapsed: !state.collapsed
        });
    };

    return (
        <div>
            <Navbar
                color="faded"
                light
            >
                <NavbarBrand tag={Link} to="/">
                    Employee Payroll Calculation
                </NavbarBrand>
                <NavbarToggler
                    className="me-2"
                    onClick={() => toggleNavbar()}
                />
                <Collapse navbar isOpen={!state.collapsed}>
                    <Nav navbar>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/create-employee">Create
                                Employee</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
};

export default NavMenu;