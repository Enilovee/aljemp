import React,{useEffect} from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import { toast } from 'react-toastify'
import Meassage from '../components/Meassage'
import Loader from '../components/Loader'
import { useCreateOrderMutation } from '../slices/ordersApiSlice'
import { clearCartItems } from '../slices/cartSlice'



const PlaceOrdersScreen = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);

    const [ createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
          navigate('/shipping');
        } else if (!cart.paymentMethod) {
          navigate('/payment');
        } 
        }, [ cart.shippingAddress.address, cart.paymentMethod, navigate]);


        const dispatch = useDispatch();
        const placeOrderHandler = async () => {
          try {
            const res = await createOrder({
              orderItems: cart.cartItems,
              shippingAddress: cart.shippingAddress,
              paymentMethod: cart.paymentMethod,
              itemsPrice: cart.itemsPrice,
              shippingPrice: cart.shippingPrice,
              taxPrice: cart.taxPrice,
              totalPrice: cart.totalPrice,
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
          } catch (err) {
            toast.error(err);
          }

        };

  return (
    <>
      <CheckoutSteps process1 process2 process3 process4 />
      <Row className='text-black' >
        <Col  md={8}> 
        <ListGroup  >
          <ListGroup.Item >
            <h2>Shipping Address</h2>
            <p >
              <strong>Address: </strong>
              {cart.shippingAddress.address},{cart.shippingAddress.city},{cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Payment Method</h2>
            <p>
              <strong> Method: </strong>
              { cart.paymentMethod}
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Order Items</h2>
            { cart.cartItems.length === 0 ? (
              <Meassage>Your Cart Is Empty</Meassage>
            ) : (
              <ListGroup > 
                { cart.cartItems.map((item, index) =>(
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                       <Link to ={`/product/${item.product}`} >
                        {item.name}
                       </Link>
                      </Col>
                      <Col md={4}>
                      { item.qty } x <span className='text-decoration-line-through'>N</span>{item.price} =  <span className='text-decoration-line-through'>N</span>{item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        </ListGroup>
        </Col>
        <Col md={4}>
           <Card>
            <ListGroup >
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col> Items : </Col>
                      <Col> <span className='text-decoration-line-through'>N</span>{cart.itemsPrice} </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col> Shipping : </Col>
                      <Col> <span className='text-decoration-line-through'>N</span>{cart.shippingPrice} </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col> VAT : </Col>
                      <Col> <span className='text-decoration-line-through'>N</span>{cart.taxPrice} </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                <Row>
                  <Col>Total: </Col>
                  <Col> <span className='text-decoration-line-through'>N</span>{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Meassage variant='danger' >{error.data.message}</Meassage>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
           </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrdersScreen