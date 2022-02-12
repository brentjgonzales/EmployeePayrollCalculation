import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

const Layout = (element: any) => {
    return (
        <>
            <NavMenu />
            <Container>
                {element.children}
            </Container>
        </>
    );
}

export default Layout;
