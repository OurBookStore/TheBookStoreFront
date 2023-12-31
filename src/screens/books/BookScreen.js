import React, { useEffect, useState } from 'react';
import { BACKEND_API_GATEWAY_URL } from '../../constants/appConstants';
import { Button, Card, Col, Form, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FullPageLoader from '../../components/FullPageLoader';
import { createProductReviewAction, listProductReviewsAction } from '../../actions/productActions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import Rating from '../../components/Rating';
import {getBookApi, getImageApi, getProductDetailApi, removeBookToAuthorApi} from '../../service/RestApiCalls';
import { addPositionAction, addToCartAction } from '../../actions/cartActions';
import addNotification, { Notifications } from 'react-push-notification';

const BookScreen = (props) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState('');
  const [productimageBase64, setProductimageBase64] = useState(null);
  const [product, setProduct] = useState(null);

  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error } = productDetails;

  const productReviews = useSelector((state) => state.productReviews);
  const { loading: loadingProductReviews, error: errorProductReviews, reviews } = productReviews;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { success: successProductReview, loading: loadingProductReview, error: errorProductReview } = productReviewCreate;

  useEffect(async () => {
    // setProductimageBase64(null);
    // dispatch(listProductDetailsAction(props.match.params.id));
    console.log("In Book api")
    await getBookApi(props.match.params.id).then((r) => {
      setProduct(r);
    });
    dispatch(listProductReviewsAction(props.match.params.id));
    // if (product?.imageId) {
    // await getImageApi(product?.imageId).then((r) => {
    //   setProductimageBase64(r);
    // });
    // }
  }, [dispatch, product?.imageId]);

  function buttonOnClick (){
    addNotification({
      title: "Success",
      subtitle: "You have successfully added book to cart",
      message: "For buy go to the cart",
      theme: "light",
      closeButton: "X",
      backgroundTop: "green",
      backgroundBottom: "yellowgreen",
    })
  }

  const addToCartHandler = () => {
    // props.history.push(`/cart/${props.match.params.id}?qty=${qty}`);
    addBookToCart(props.match.params.id,qty);
    buttonOnClick();
  };

  const addBookToCart = (pId, q) => {
    const addPositionRequestBody = {
      bookId:  pId,
      count:  q
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

  const createProductReviewHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReviewAction({
        productId: props.match.params.id,
        ratingValue: rating,
        reviewMessage: reviewMessage
      })
    );
  };

  return (
    <>
      <Link className='btn btn-dark my-3' to='/'>
        Go Back
      </Link>

      {error ? (
        <Message variant='danger'></Message>
      ) : product ? (
        <>
          <Row>
            <Col md={6}>
                  <Card.Img
                      src={`${BACKEND_API_GATEWAY_URL}/images/${product?.image}`}
                      variant='top'
                      style={{height: '250px'}}
                  ></Card.Img>
            </Col>
            <Col md={3} style={{ borderLeft: '1px solid #eee' }}>
              <ListGroup variant='flush'>
                <ListGroupItem>
                  <h4>{product.name}</h4>
                </ListGroupItem>
                <ListGroupItem>
                  <Rating value={product.averageRating} text={`${product.noOfRatings} reviews`}></Rating>
                </ListGroupItem>
                <ListGroupItem>Price : ${product.price}</ListGroupItem>
                <ListGroupItem>Description : {product.description}</ListGroupItem>
                <ListGroupItem>Authors : {product.authors.map(author=>author.fullName)}</ListGroupItem>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroupItem>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroupItem>

                  <ListGroupItem>
                    <Row>
                      <Col>Status:</Col>
                      <Col>{product.count > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                    </Row>
                  </ListGroupItem>

                  {product.count > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                            {
                              [...Array(product.count).keys()].map((x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                ))
                            }
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <Notifications />
                  <ListGroupItem>

                    <Button onClick={addToCartHandler} className='btn-block' type='button' disabled={product.count <= 0}>
                      Add to Cart
                    </Button>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      ) : null}
      <Notifications />
      {loading && <FullPageLoader></FullPageLoader>}
    </>
  );
};

export default BookScreen;
