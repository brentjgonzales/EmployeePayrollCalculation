import React, {Component} from 'react';
import {
    Collapse,
    Container,
    Modal, ModalBody, ModalHeader,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarText,
    NavbarToggler,
    NavItem,
    NavLink
} from 'reactstrap';
import {Link} from 'react-router-dom';
import './NavMenu.css';
import {CreateEmployee} from "./CreateEmployee";

interface ILocalState {
    collapsed: boolean
}

export class NavMenu extends Component<{}, ILocalState> {
    static displayName = NavMenu.name;

    constructor(props: any) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (

            <div>
                <Navbar
                    color="faded"
                    light
                >
                    <NavbarBrand tag={Link} to="/">
                        Employeee Payroll Calculation
                    </NavbarBrand>
                    <NavbarToggler
                        className="me-2"
                        onClick={() => this.toggleNavbar()}
                    />
                    <Collapse navbar isOpen={!this.state.collapsed}>
                        <Nav navbar>
                            <NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/create-employee">Create
                                        Employee</NavLink>
                                </NavItem>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}
