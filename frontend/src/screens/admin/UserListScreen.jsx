import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { FaTrash, FaUserTimes, FaEdit, FaCheck } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'
import Meassage from '../../components/Meassage'
import Loader from '../../components/Loader'
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice'
import { toast } from 'react-toastify'


const UserListScreen = () => {
  const {data : users, refetch, isLoading, error} = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete}] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if(window.confirm('Are You Sure You want to delete User ?')){
        try {
            await deleteUser(id)
            toast.success('User deleted')
            refetch()
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }
  }
  return (
    <>
    <h1>Users</h1>
    {/* {loadingProduct && <Loader />} */}
       {loadingDelete && <Loader />}
     {isLoading ?( <Loader />) : error ? (<Meassage variant='danger'>{error} </Meassage>) :(
      <Table striped  hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ADMIN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { users.map((user) =>(
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
              <td>
              {
                user.isAdmin ? (
                    <FaCheck style={{color:"teal"}} />
                ) :(
                  <FaUserTimes style={{color:"red"}} />
                )
              }
              </td>
            
              <td>
                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                  <Button variant='light' className='btn-sm'>
                    <FaEdit />
                  </Button>
                </LinkContainer>
                <Button variant='danger' 
                        className='btn-sm'
                        onClick={() => deleteHandler(user._id)} >
                            <FaTrash style={{ color: "whitesmoke"}} />
                </Button>
              </td>
            </tr>
          )) }
        </tbody>
      </Table>
     )}
    </>
 ) 
}

export default UserListScreen