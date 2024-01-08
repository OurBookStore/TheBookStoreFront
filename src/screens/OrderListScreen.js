import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listOrdersAdmin } from '../actions/orderActions';

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderListAll);
  const { loading, error, orders } = orderList;

  useEffect(() => {
    dispatch(listOrdersAdmin());
  }, [dispatch]);

  const getStatusOptions = (order,statusName) => {
    return order.orderStatusHistories.find( status => status.status === statusName);
  };

  const isContainsStatus = ( order, statusName) => {
    return order.orderStatusHistories.includes( status => {
      return status.status === statusName;
    })
  };

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
          <tr>
            <th>USERNAME</th>
            <th>ID</th>
            <th>DATE AND TIME</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.appUser.nickname}</td>
              <td>{order.id}</td>
              <td>{getStatusOptions(order, 'CREATED').actualFrom}</td>
              <td>{order.totalPrice}</td>

              <td>{isContainsStatus(order, 'DELIVERING') ? getStatusOptions(order, 'DELIVERING').actualFrom :
                <i className='fas fa-times' style={{ color: 'red' }}></i>}</td>
              <td>
                {isContainsStatus(order, 'DONE') ? getStatusOptions(order, 'DONE').actualFrom :
                  <i className='fas fa-times' style={{ color: 'red' }}></i>}
              </td>
              <td>
                <LinkContainer to={`/order/${order.id}`}>
                  <Button className='btn-sm' variant='light'>
                    Details
                  </Button>
                </LinkContainer>
              </td>
            </tr>
          ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
