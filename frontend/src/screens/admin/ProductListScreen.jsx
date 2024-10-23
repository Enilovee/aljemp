import React from 'react'
import { Button, Table, Row, Col } from 'react-bootstrap'
import {  FaEdit, FaTrash } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'
import Meassage from '../../components/Meassage'
import Loader from '../../components/Loader'
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../../slices/prodApiSlice'
import { toast } from 'react-toastify'
import Paginate from '../../components/Paginate'
import { useParams } from 'react-router-dom'

const ProductListScreen = () => {
   const { pageNumber } = useParams()
    const {data, isLoading, error, refetch} = useGetProductsQuery({pageNumber});

    const [createProduct, {isLoading: loadingProduct }] = useCreateProductMutation();
    const [deleteProduct, {isLoading: loadingDelete }] = useDeleteProductMutation();

    const deleteHandler = async (id) => {
      if(window.confirm('Are you sure you want to delete this item ?')) {
        try {
          await deleteProduct(id)
          refetch()
        } catch (err) {
          toast.error(err?.data?.messae || err.error)
        }
      }
    }

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want t create a product')) {
            try {
                await createProduct()
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }


  return (
    <>
    <Row className='align-items-center'>
      <Col>
       <h1>Products</h1>
      </Col>
      <Col className='text-end'>
      <Button className='btn-sm m-3' onClick={createProductHandler} >
        <FaEdit /> Create Product
      </Button>
      </Col>
    </Row>
       {loadingProduct && <Loader />}
       {loadingDelete && <Loader />}
       { isLoading?(<Loader />): error?(<Meassage variant='danger'>{error}</Meassage>):(
        <>
        <Table striped hover responsive className='table-sm'>
            <thead>
            <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th></th>
          </tr>
            </thead>
            <tbody>
                {data.products.map((product) =>(
                    <tr key={product._id}>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.brand}</td>
                        <td>
                          <LinkContainer to={`/admin/product/${product._id}/edit`}  >
                            <Button variant='light' className='btn-sm mx-2'>
                                <FaEdit />
                            </Button>
                          </LinkContainer>
                          <Button variant='danger' className='btn-sm'onClick={()=> deleteHandler(product._id)}>
                            <FaTrash style={{color:'white'}} />
                          </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
       ) }

    </>
  )
}

export default ProductListScreen