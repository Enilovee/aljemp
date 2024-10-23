import React,{useState} from 'react'
import { Form, Button } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../slices/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'


const ShippingScreen = () => {
    const  cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    const [ address, setAddress] = useState( shippingAddress?.address ||'')
    const [ city, setCity] = useState(shippingAddress?.city ||'')
    const [ postalCode, setPostalCode] = useState(shippingAddress?.postalCode ||'')
    const [ country, setCountry] = useState(shippingAddress?.country ||'')

     const navigate = useNavigate()
     const dispatch = useDispatch()

    
    
    const submitHandler = (e) =>{
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country}))
        navigate('/payment')
    }

    return (
    <FormContainer>

        <CheckoutSteps process1 process2  />

        <h1>Shipping</h1>
        <Form onSubmit={submitHandler} >
            <Form.Group style={{color:"black"}} controlId='address' className='my-2'>
                <Form.Label>Address</Form.Label>
                <Form.Control
                    type='text'
                    className='text-black'
                    placeholder='Enter Address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                >

                </Form.Control>
            </Form.Group>
            <Form.Group style={{color:"black"}} controlId='city' className='my-2'>
                <Form.Label>City</Form.Label>
                <Form.Control
                    type='text'
                    className='text-black'
                    placeholder='Enter City'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                >

                </Form.Control>
            </Form.Group>
            <Form.Group style={{color:"black"}} controlId='postalCode' className='my-2'>
                <Form.Label>PostalCode</Form.Label>
                <Form.Control
                 className='text-black'
                    type='text'
                    placeholder='Enter PostalCode'
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                >

                </Form.Control>
            </Form.Group>
            <Form.Group style={{color:"black"}} controlId='country' className='my-2'>
                <Form.Label>Country</Form.Label>
                <Form.Control 
                    className='text-black'
                    type='text'
                    placeholder='Enter Country'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                >

                </Form.Control>
            </Form.Group>
            <Button
            type='submit' variant='primary' className='my-2'
            > Continue
            </Button>
        </Form>
    </FormContainer>
  )
}

export default ShippingScreen