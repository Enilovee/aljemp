import React,{useEffect} from 'react'

import {Link, useParams} from 'react-router-dom'
import {Row, Col, ListGroup, Image,  Button, Card } from 'react-bootstrap'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import Meassage from '../components/Meassage'
import Loader from '../components/Loader'
import {toast} from 'react-toastify';

import { useGetOrderDetailsQuery,
   usePayOrderMutation, 
   useGetPayStackClientIdQuery,
    useDeliverOrderMutation  
  } from '../slices/ordersApiSlice'
import { useSelector } from 'react-redux'

const OrderScreen = () => {
  const {id :orderId} = useParams()

   const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId)

   const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation()

   const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();

     const {userInfo} = useSelector ((state) =>state.auth)

  
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  
    const {data: paypal, isLoading : loadingPayPal, error: errorPayPal } = useGetPayStackClientIdQuery();


    useEffect(() => {
      if(!errorPayPal && !loadingPayPal && paypal.clientId){
        const loadPayPalScript  = async () => {
          paypalDispatch({
            type:"resetOptions",
            value:{
              'client-id': paypal.clientId,
              currency :"USD",
            },
          })
          paypalDispatch({ type: 'setLoadingStatus', value: 'pending'})
        }
        if(order && !order.isPaid) {
          if(!window.paypal){
            loadPayPalScript()
          }
        }
      }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal ])

    function onApprove (data, actions){
      return actions.order.capture().then( async function(details){
        try {
          await payOrder ({orderId, details});
          refetch();
          toast.success("Payment Successful")
        } catch (err) {
          toast.error(err?.data?.message || err.message)
        }
       }) 
    }
    // async function onApproveTest (){
    //   await payOrder ({orderId, details:{ payer:{} } });
    //   refetch();
    //   toast.success("Payment Successful")
    
    // }
    function onError (err){
      toast.error(err.message)
    }
    function createOrder (data, actions) {
      return actions.order
        .create({
          purchase_units:[
            {
              amount: {
                value: order.totalPrice,
              },
            },
          ],
        }).then((orderId) =>{
          return orderId;
        })
    }
     
     const deliverOrderHandler = async () => {
       try {
        await deliverOrder(orderId)
        refetch()
        toast.success('Order delivered')
       } catch (err) {
        toast.error(err?.data?.message || err.message)
       }
     }
   
  return isLoading ? (<Loader />): error? ( <Meassage variant='danger'>
                {error.data.message}
  </Meassage> ) : (
    <>
     <h1>ORDER {order._id}</h1>
     <Row>
      <Col md={8}>
        <ListGroup >
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p>
              <strong>Name :</strong> {order.user.name}
            </p>
            <p>
              <strong>Email :</strong> {order.user.email}
            </p>
            <p>
              <strong>Address :</strong> {order.shippingAddress.address},{order.shippingAddress.city},{order.shippingAddress.postalCode},{''}
              {order.shippingAddress.country}
              </p>
              {order.isDelivered ?(
                <Meassage variant='success'>
                  Your order has been delivered on {order.deliveredAt}
                </Meassage>
              ) :(
                <Meassage variant='danger'>
                  Your Order is in transit
                </Meassage>
              )}
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Payment With</h2>
            <p>
                <strong> Method : </strong>{order.paymentMethod}
            </p>
            {order.isPaid ?(
                <Meassage variant='success'>
                  Your order was paid on {order.paidAt}
                </Meassage>
              ) :(
                <Meassage variant='danger'>
                  We Are Yet To Recieve Your Payment
                </Meassage>
              )}
          </ListGroup.Item>
          <ListGroup.Item>
            <h2> Order Item</h2>
              {order.orderItems.map((item, index) =>(
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/$(item.product)`}>
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={4}>
                    { item.qty } x <strong className='text-decoration-line-through'>N</strong>{item.price} =  <strong className='text-decoration-line-through'>N</strong>{item.qty * item.price}

                    </Col>
                  </Row>

                </ListGroup.Item>
              ))}  
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={4}>
        <Card>
        <ListGroup  >
          <ListGroup.Item>Order Summary</ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col> Items</Col>
              <Col>{order.itemPrice}</Col>
            </Row>
            <Row>
              <Col> Shipping </Col>
              <Col>{order.shippingPrice}</Col>
            </Row>
            <Row>
              <Col> VAT</Col>
              <Col>{order.taxPrice}</Col>
            </Row>
            <Row>
              <Col> Total </Col>
              <Col>{order.totalPrice}</Col>
            </Row>
          </ListGroup.Item>
          { ! order.isPaid &&(
            <ListGroup.Item>
              {loadingPay && <Loader />}
              {isPending ? <Loader />: (
                <div className="">
                 {/* <Button onClick={onApproveTest} style={{marginBottom:"10px"}}>Test Pay Order </Button> */}
                  <div>
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}></PayPalButtons>
                  </div>
                </div>
              )}
            </ListGroup.Item>
          )}
          
          { loadingDeliver && <Loader /> }
             {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <ListGroup.Item>
                <Button
                type='button'
                className='btn btn-block'
                onClick={deliverOrderHandler}
                >
                  Confirm Item is Delivered
                </Button>
              </ListGroup.Item>
             )}   
           
        </ListGroup> 
        </Card>
      </Col>
     </Row>
    </>
  )
}

export default OrderScreen