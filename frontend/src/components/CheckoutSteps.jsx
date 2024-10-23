import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CheckoutSteps = ({ process1, process2, process3, process4, }) => {
    
  return (
    <Nav className='justify-content-center mb-4'>
        <Nav.Item>
            { process1 ?(
                <LinkContainer to='/login'>
                    <Nav.Link> Sign In</Nav.Link>
                </LinkContainer>
            ) : (
                <Nav.Linl disabled>Sign In</Nav.Linl>
            )}
        </Nav.Item>
        <Nav.Item>
            { process2 ?(
                <LinkContainer to='/shipping'>
                    <Nav.Link> Shipping</Nav.Link>
                </LinkContainer>
            ) : (
                <Nav.Linl disabled>Shipping</Nav.Linl>
            )}
        </Nav.Item>
        <Nav.Item>
            { process3 ?(
                <LinkContainer to='/payment'>
                    <Nav.Link> Payment</Nav.Link>
                </LinkContainer>
            ) : (
                <Nav.Link disabled>Payment</Nav.Link>
            )}
        </Nav.Item>
        <Nav.Item>
            { process4 ?(
                <LinkContainer to='/placeorder'>
                    <Nav.Link> Place Order</Nav.Link>
                </LinkContainer>
            ) : (
                <Nav.Link disabled>Place Order</Nav.Link>
            )}
        </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps