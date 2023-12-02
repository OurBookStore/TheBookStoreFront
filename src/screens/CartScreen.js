import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import CartItem from '../components/CartItem';
import {
  addPosition,
  addPositionAction,
  addToCartAction,
  getCartDetailsAction,
  updatePositionAction
} from '../actions/cartActions';
import FullPageLoader from '../components/FullPageLoader';
import { LinkContainer } from 'react-router-bootstrap';
import { push } from 'react-router-redux';
import { put } from 'axios';

const CartScreen = (props) => {
  const productId = props.match.params.id;
  const qty = props.location.search ? Number(props.location.search.split('=')[1]) : 1;
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const cartState = useSelector((state) => state.cart);
  const [reloadItem,updateItemReload] = useState(false);
  const { cart } = cartState;
  let loading = cartState.loading;
  let error = cartState.error;
  const { userInfo } = userLogin;
  const redirect = props.location.pathname + props.location.search;

  useEffect(() => {
    if (userInfo === null || userInfo === undefined) {
      props.history.push(`/login?redirect=${redirect}`);
      return;
    }
    if (productId) {
      addToCart();
    } else {
      getCartDetail();
    }
    console.log("info error", error);
  }, [dispatch, productId, qty, userInfo]);

  const addToCart = (pId, q) => {
    const addPositionRequestBody = {
      bookId: pId === undefined ? productId: pId,
      count: q === undefined ? qty : q
    };
    const promisePositionId = dispatch(addPositionAction(addPositionRequestBody));
    promisePositionId.then(function (positionId){
      const addToCartPositionRequestBody = {
        orderPositionId: positionId,
        cartId: userLogin.userInfo.cartId
      };
      dispatch(addToCartAction(addToCartPositionRequestBody));
    }, function (error){
          console.log("info err", error);
    });
  };

  const updateItemCart = (posId, q) => {
    const updatePositionBody = {
      id: posId,
      count: q
    };
    dispatch(updatePositionAction(updatePositionBody));
    updateItemReload(true);
    window.location.reload();
    console.log("end updateing")
  };


  const getCartDetail = () => {
    dispatch(getCartDetailsAction(userLogin.userInfo.cartId));
  };

  const checkoutHandler = () => {
    props.history.push('/login?redirect=shipping');
  };

  return (
    <>
      { error ? (
        <Message variant='danger'> {JSON.stringify(error)}</Message>
      ) : (
        <>
          <Row>
            <h1>Shopping Cart </h1>
          </Row>
          <Row>
            <Col md={8}>
              {cart == null || cart?.cartItems?.length == 0 ? (
                  <Message>
                  Your cart is empty <Link to='/'>Go Back</Link>
                </Message>
              ) : (
                <ListGroup.Item variant='flush'>
                  {cart?.cartItems?.map((item) => (
                    <CartItem key={item.id} item={item} updateItemCart={updateItemCart} props={props}></CartItem>
                  ))}
                </ListGroup.Item>
              )}
              <Row className='m-5 justify-content-md-center'>
                <LinkContainer to={'/'}>
                  <a>Add more books</a>
                </LinkContainer>
              </Row>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h3>Subtotal ({cart?.cartItems?.length}) Items</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h3>${cart?.total}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button type='button' className='btn-block' disabled={cart?.cartItems?.length === 0} onClick={checkoutHandler}>
                      Proceed To Checkout
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
      {loading && <FullPageLoader></FullPageLoader>}
    </>
  );
};

export default CartScreen;
