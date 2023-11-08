import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import CartItem from '../components/CartItem';
import {addPosition, addToCartAction, getCartDetailsAction} from '../actions/cartActions';
import FullPageLoader from '../components/FullPageLoader';
import { LinkContainer } from 'react-router-bootstrap';

const CartScreen = (props) => {
  const productId = props.match.params.id;
  const qty = props.location.search ? Number(props.location.search.split('=')[1]) : 1;
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const cartState = useSelector((state) => state.cart);
  const { cart } = cartState;
  let loading = cartState.loading;
  let error = cartState.error;
  const { userInfo } = userLogin;
  const redirect = props.location.pathname + props.location.search;

  useEffect(() => {
    console.log("Seek proops", props);
    if (userInfo === null || userInfo === undefined) {
      props.history.push(`/login?redirect=${redirect}`);
      return;
    }
    console.log("Check productId before dead", productId);
    console.log("info error", error);
    if (productId) {
      addToCart();
    } else {
      getCartDetail();
    }
    console.log("info error", error);
  }, [dispatch, productId, qty, userInfo]);

  const addToCart = (pId, q) => {
    console.log(`Info of count ${q}`);
    console.log(`Info of id ${pId}`);
    console.log(`Info of id 2 ${productId}`);
    console.log(`Info of count 2 ${qty}`);

    const addPositionRequestBody = {
      bookId: pId === undefined ? productId: pId,
      count: q === undefined ? qty : q
    };
    const promisePositionId = dispatch(addPosition(addPositionRequestBody));
    promisePositionId.then(function (positionId){
      const addToCartPositionRequestBody = {
        orderPositionId: positionId,
        cartId: userLogin.userInfo.cartId
      };
      dispatch(addToCartAction(addToCartPositionRequestBody));
    }, function (error){
          console.log("info err", error);
    });
    console.log("State", cartState);
    console.log("Info cart",cart);
    console.log("info error", error);
  };

  const getCartDetail = () => {
    console.log("info error", error);
    console.log("Check cart", cart);
    dispatch(getCartDetailsAction(userLogin.userInfo.cartId));
  };

  const checkoutHandler = () => {
    console.log("info error", error);
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
                    <CartItem key={item.id} item={item} addToCart={addToCart} props={props} ></CartItem>
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
