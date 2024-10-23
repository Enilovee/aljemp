import { useParams, Link, useNavigate } from 'react-router-dom'
import { Form, Row, Col, Image, ListGroup, Card, Button,} from 'react-bootstrap'
import Rating from '../components/Rating'
import { useGetProductdetailsQuery, useCreateReviewMutation } from '../slices/prodApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Meassage'
import { useState } from 'react'
import { addToCart } from '../slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Meassage from '../components/Meassage'
import Meta from '../components/Meta'




const ProductScreen = () => {

    const  dispatch = useDispatch()
    const navigate = useNavigate()

    const { id: productId } = useParams()

    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    
    
    const {data: product, isLoading, refetch, error } = useGetProductdetailsQuery(productId);
    const [createReview, {isLoading: loadingProductReview}] = useCreateReviewMutation()

    const { userInfo } = useSelector((state) => state.auth)

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }))
        navigate('/cart')
     }
        const submitHandler = async (e) => {
            e.preventDefault() 
            try {
            await createReview({
                productId,
                rating,
                comment,
            }).unwrap()
            refetch()
            toast.success('review submitted')
         
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }

  return (
    <>
        <Link className='btn btn-light my-3' to="/">
        Go back     
        </Link>    
         {isLoading ? (<Loader />) : error ? (<Message variant = 'danger'>{error?.data?.message || error?.error}</Message>):
         (<>
         <Meta title={product.name} />
        <Row>
            <Col md={5}>
                <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
                 <ListGroup >
                    <ListGroup.Item>
                        <h3>{product.name}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Price: <span>N</span>{product.price}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Description: {product.description}
                    </ListGroup.Item>
                 </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup >
                        <ListGroup.Item>
                            <Row>
                                <Col> Price:</Col>
                                <Col>
                                  <strong><span>N</span>{product.price}</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col> Status:</Col>
                                <Col>
                                  <strong>{product.countInStock > 0 ? 'In stock' :'Out of Stock'}</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>

                            {product.countInStock > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Qty</Col>
                                        <Col>
                                        <Form.Control
                                        as = 'select'
                                        value ={qty}
                                        onChange = {(e) => setQty(Number(e.target.value))}>
                                            {[...Array(product.countInStock).keys()].map((x) =>(
                                              <option key={ x + 1} value={ x + 1}>
                                                { x + 1}
                                              </option>  
                                            )) }
                                        </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}

                        <ListGroup.Item>
                            <Button
                            className='btn-block'
                            type='button'
                            disabled={product.countInStock===0}
                            onClick={addToCartHandler}
                            > Add To Cart </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        <Row className='review'>
           <Col md={6}>
            <h2>Reviews</h2> 
            { product.reviews.length === 0 && <Meassage>No Reviews</Meassage>}
            <ListGroup variant='flush'>
                {product.reviews.map( review => (
                    <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} />
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                    </ListGroup.Item>
                ))}
                <ListGroup.Item>
                    <h2>Write a Customer Review</h2>
                    {loadingProductReview && <Loader />}
                    { userInfo ? (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='rating' className='my-2'>
                                <Form.Label>Rating</Form.Label>
                                <Form.Control 
                                as ='select' 
                                required
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                >
                                    <option value=''>Select...</option>
                                    <option value='1'>1- Bad</option>
                                    <option value='2'>2- poor</option>
                                    <option value='3'>3- Fair</option>
                                    <option value='4'>4 -Good</option>
                                    <option value='5'>5- Excellent</option>
                                </Form.Control>

                            </Form.Group>
                            <Form.Group controlId='comment' className='my-2'>
                                <Form.Label>Comment</Form.Label>
                                <Form.Control 
                                as ='textarea' 
                                required
                                row='3'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Button
                             disabled={loadingProductReview}
                             type='submit'
                             variant='success'
                            > Submit </Button>
                        </Form>
                    ) : (
                        <Meassage>
                            please <Link to='/login'>sign in</Link> to write a review {' '}
                        </Meassage>
                    )}
                </ListGroup.Item>
            </ListGroup>
           </Col>                                     
        </Row>
     </>
     )}
        
    </>
  )
}

export default ProductScreen