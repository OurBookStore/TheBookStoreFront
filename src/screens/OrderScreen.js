import React, { useState, useEffect } from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import OrderItem from '../components/OrderItem';
import { isAdmin } from '../service/CommonUtils';
import { getOrderDetailsAction, addOrderStatusAction } from '../actions/orderActions';

// import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
// import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;
  const [successPay, setSuccessPay] = useState(false);
  const [successDeliver, setSuccessDeliver] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  // const [order, setOrder] = useState(null);
  //   const orderDetails = useSelector((state) => state.orderDetails);
  //   const { order, loading, error } = orderDetails;

  //   const orderPay = useSelector((state) => state.orderPay);
  //   const { loading: loadingPay, success: successPay } = orderPay;

  //   const orderDeliver = useSelector((state) => state.orderDeliver);
  //   const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetail = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetail;

  const orderDetailStatus = useSelector((state) => state.orderStatus);
  const { orderStatus, loadingStatus, errorStatus } = orderDetailStatus;

  useEffect(() => {
    console.log("--------------We are in oreder!")
    if (!userInfo) {
      history.push('/login');
    }
    dispatch(getOrderDetailsAction(orderId));
    console.log("-------------end")
  }, [dispatch, orderId]);

  const doneHandler = () => {
    statusHandler('DONE');
  };

  const statusHandler = (status) => {
    setLoadingDeliver(true);

    const orderStatusBody = {
      OrderStatus: status
    }
    dispatch(addOrderStatusAction(orderStatusBody,orderId));
  };

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 10);
  };

  const getActualStatus = () => {
    return order.orderStatusHistories.find( status => status.actualFlag === true);
  };

  const isContainsStatus = ( statusName) => {
    return order.orderStatusHistories.includes( status => {
      return status.status === statusName;
    })
  };

  const getStatusOptions = (statusName) => {
    return order.orderStatusHistories.find( status => status.status === statusName);
  };

  return (
    <>
      {loading === true ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <h1>Order - {order.id}</h1>
          <hr></hr>
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {/*{order.card.cardBrand.toUpperCase()} - **** **** **** {order.card.last4Digits}*/}
                  </p>
                  { isContainsStatus('DELIVERING') ? (
                    <Message variant='success'>Paid on {getStatusOptions('DELIVERING').actualFrom}</Message>
                  ) : (
                    <Message variant='danger'>Not Paid</Message>
                  )}

                  <p>
                    <strong>Payment Receipt : </strong>
                    {/*<a href={order.paymentReceiptUrl} target='_blank'>*/}
                    {/*  {order.paymentReceiptUrl}*/}
                    {/*</a>*/}
                  </p>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong> {userInfo.username}
                  </p>
                  <p>
                    <strong>Email: </strong> <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
                  </p>
                  <p>
                    <strong>Address:</strong>
                    {order.address}
                    {/*, */}
                    {/*{order.shippingAddress.city} {order.shippingAddress.postalCode},{' '}*/}
                    {/*{order.shippingAddress.country}*/}
                  </p>
                  { isContainsStatus('DONE') ? (
                    <Message variant='success'>Delivered on {getStatusOptions('DONE').actualFrom}</Message>
                  ) : (
                    <Message variant='danger'>Not Delivered</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderPositions.length === 0 ? (
                    <Message>Order is empty</Message>
                  ) : (
                    <ListGroup variant='flush'>
                      {order.orderPositions.map((item, index) => (
                        <OrderItem item={item}></OrderItem>
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>

              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col>${order.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  {loadingStatus&& <Loader />}
                  {
                    userInfo && isAdmin() && isContainsStatus('DELIVERING') &&(
                      <ListGroup.Item>
                        <Button type='button' className='btn btn-block' onClick={ doneHandler}>
                          Mark As Delivered
                        </Button>
                      </ListGroup.Item>
                    )
                  }
                  {/*<ListGroup.Item>*/}
                  {/*  <Row>*/}
                  {/*    <Col>Items</Col>*/}
                  {/*    <Col>${order.totalPrice}</Col>*/}
                  {/*  </Row>*/}
                  {/*</ListGroup.Item>*/}
                  {/*<ListGroup.Item>*/}
                  {/*  <Row>*/}
                  {/*    <Col>Shipping</Col>*/}
                  {/*    <Col>${order.shippingPrice}</Col>*/}
                  {/*  </Row>*/}
                  {/*</ListGroup.Item>*/}
                  {/*<ListGroup.Item>*/}
                  {/*  <Row>*/}
                  {/*    <Col>Tax</Col>*/}
                  {/*    <Col>${order.taxPrice}</Col>*/}
                  {/*  </Row>*/}
                  {/*</ListGroup.Item>*/}
                  {/*{loadingDeliver && <Loader />}*/}
                </ListGroup>
              </Card>

            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default OrderScreen;
