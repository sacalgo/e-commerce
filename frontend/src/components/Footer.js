/* eslint-disable no-unused-vars */
import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
const Footer = () => {
    return (
        <footer>
           <Container>
               <Row>
                   <Col className='text-center py-3'>
                       Copyright &copy; SacShop
                   </Col>
               </Row>
           </Container>
        </footer>
    )
}

export default Footer;
