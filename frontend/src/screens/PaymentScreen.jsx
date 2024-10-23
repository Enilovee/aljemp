import React,{useState, useEffect} from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../slices/cartSlice'




const PaymentScreen = () => {
    
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart;

    useEffect(()=>{
        if(!shippingAddress){
            navigate('/shipping');
        }
    },[shippingAddress, navigate])

    const [paymentMethod, setPaymentMethod] = useState('PayPal')
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder')
    }

  return (
    <FormContainer>
        <CheckoutSteps process1 process2 process3  />
            <h1>Payment Method </h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>
                        Select Method
                    </Form.Label>
                    <Col>
                    <Form.Check
                    type='radio'
                    className='my-2'
                    label='PayPal, CreditCard, PayStack'
                    id = 'PayPal'
                    name='paymentMethod'
                    value='PayPal'
                    checked
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    ></Form.Check>
                    </Col>
                </Form.Group>
                <Button type='submit' variant='primary'>Continue</Button>
            </Form>
        
    </FormContainer>
  )
}

export default PaymentScreen