import React from 'react'
import { Carousel, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useGetTopProductQuery } from '../slices/prodApiSlice'
import Loader from './Loader'
import Meassage from './Meassage'

const ProductCarousel = () => {
    const {data: products, isLoading, error} = useGetTopProductQuery()

  return  isLoading ?( <Loader /> ): error ? (
  <Meassage variant='danger'>{error?.data?.message || error.error}</Meassage>):(
        <Carousel pause='hover' className='bg-dark mb-4'>
            {products.map( (product) => (
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image src={product.image} alt={product.name} fluid />
                        <Carousel.Caption className='carousel-caption'>
                            <h2 className='text-white text-right'>
                                {product.name} (<strong className='text-decoration-line-through'>N</strong>{product.price})
                                </h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
  
}

export default ProductCarousel