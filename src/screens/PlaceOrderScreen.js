import React, { useEffect, useState } from 'react';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrderAction, previewOrderAction } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps';
import FullPageLoader from '../components/FullPageLoader';
import Loader from '../components/Loader';
import Message from '../components/Message';
import OrderItem from '../components/OrderItem';
// import { ORDER_CREATE_RESET } from '../constants/orderConstants';
// import { USER_DETAILS_RESET } from '../constants/userConstants';

const PlaceOrderScreen = (props) => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const order = useSelector((state) => state.order);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;


  const orderPreview = useSelector((state) => state.orderPreview);
  const { loading: previewOrderLoading, order: previewOrderResponse } = orderPreview;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading: placeOrderLoading, order: createOrderResponse } = orderCreate;

  if (!order.shippingAddressId) {
    props.history.push('/shipping');
  }
  // else if (!order.billingAddressId) {
  //   props.history.push('/shipping');
  // }
  else if (!order.paymentMethodId) {
    props.history.push('/payment');
  }

  useEffect(() => {

    previewOrder();

    console.log("orders preview",previewOrderResponse)
    // eslint-disable-next-line
    //Когда заказ создан на меня вкладки заказа
    if (createOrderResponse?.id != null) {
      dispatch({
        type: 'ORDER_CREATE_RESET'
      });
      props.history.push(`/order/${createOrderResponse.id}`);
    }
  }, [dispatch, createOrderResponse, order]);

  const previewOrder = () => {
    const id = userInfo.id;
    dispatch(previewOrderAction(id));
  };

  //Создание самого заказа
  const placeOrderHandler = () => {
    const placeOrderRequestBody = {
      address: order.shippingAddressId,
      appUserId: userInfo.id
    };

    dispatch(placeOrderAction(placeOrderRequestBody,userInfo.cartId));
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      {previewOrderLoading === true && <Loader></Loader>}
      {previewOrderLoading === false && (
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Address:</strong>
                  {previewOrderResponse.address}
                  {/*{previewOrderResponse.shippingAddress.city},*/}
                  {/*{previewOrderResponse.shippingAddress.postalCode}, */}
                  {/*{previewOrderResponse.shippingAddress.country}*/}
                </p>
              </ListGroup.Item>

              {/*<ListGroup.Item>*/}
              {/*  <h2>Payment Method</h2>*/}
              {/*  <strong>Method: </strong>*/}
              {/*  {previewOrderResponse.card.cardBrand.toUpperCase()} - **** **** **** {previewOrderResponse.card.last4Digits}*/}
              {/*</ListGroup.Item>*/}

              <ListGroup.Item>
                <h2>Order Items</h2>
                {previewOrderResponse?.orderPositions.length === 0 ? (
                  <Message>Your cart is empty</Message>
                ) : (
                  <ListGroup variant='flush'>
                    {previewOrderResponse.orderPositions.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <OrderItem item={item}></OrderItem>
                      </ListGroup.Item>
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
                {/*<ListGroup.Item>*/}
                {/*  <Row>*/}
                {/*    <Col>Items</Col>*/}
                {/*    <Col>${previewOrderResponse.itemsTotalPrice}</Col>*/}
                {/*  </Row>*/}
                {/*</ListGroup.Item>*/}
                {/*<ListGroup.Item>*/}
                {/*  <Row>*/}
                {/*    <Col>Shipping</Col>*/}
                {/*    <Col>${previewOrderResponse.shippingPrice}</Col>*/}
                {/*  </Row>*/}
                {/*</ListGroup.Item>*/}
                {/*<ListGroup.Item>*/}
                {/*  <Row>*/}
                {/*    <Col>Tax</Col>*/}
                {/*    <Col>${previewOrderResponse.taxPrice}</Col>*/}
                {/*  </Row>*/}
                {/*</ListGroup.Item>*/}
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${previewOrderResponse?.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button type='button' className='btn-block' disabled={previewOrderResponse?.orderPositions === 0} onClick={placeOrderHandler}>
                    Place Order
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
      {placeOrderLoading && <FullPageLoader></FullPageLoader>}
    </>
  );
};

export default PlaceOrderScreen;
