import React, { useEffect } from 'react';
import { BACKEND_API_GATEWAY_URL } from '../constants/appConstants';
import {useDispatch, useSelector} from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { removeFromCartAction } from '../actions/cartActions.js';
import {getBookApi, getProductDetailApi} from '../service/RestApiCalls.js';
import FullPageLoader from './FullPageLoader.js';
import Message from '../components/Message';
import { useState } from 'react';
import { getErrorMessage } from '../service/CommonUtils';

const CartItem = ({ item, updateItemCart ,props}) => {
  const [product, setProduct] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(async () => {
    try {
      console.log("Get data", item);
      const productDetail = await getBookApi(item.book.id);
      setProduct(productDetail);
      setLoading(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [item]);

  const removeFromCartHandler = async (positionId) => {
    dispatch(removeFromCartAction(positionId,userInfo.id));
    props.history.push('/cart');
    window.location.reload();
  };

  return (
    <>
      {error ? (
        <Message variant='danger'> {JSON.stringify(error.message)}</Message>
      ) : (
        <ListGroup.Item key={item.productId}>
          <Row>
            <Col md={2}>
              <Image
                  src={`${BACKEND_API_GATEWAY_URL}/images/${product?.image}`}
                  alt={item.productName}
                  style={{width: '100%'}}
                  fluid
                  rounded
              ></Image>
            </Col>
            <Col md={2} className='pt-3'>
              <Link to={`/book/${item.book.id}`}>{item.book.name}</Link>
            </Col>
            <Col md={2} className='pt-4'>
              {product?.authors?.map((author) => (author.fullName)).join(", ")}
            </Col>
            <Col md={1} className='pt-4'>
              ${item.book.price}
            </Col>
            <Col md={2} className='pt-3'>
              {product && (
                <>
                  <Form.Control as='select' value={item.count} onChange={(e) => updateItemCart(item.id, e.target.value)}>
                    {
                      [...Array(item.book.count).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))
                    }
                  </Form.Control>
                </>
              )}
            </Col>
            <Col md={1} className='pt-4'>
              Subtotal: ${item.price}
            </Col>
            <Col md={2} className='pt-3 pl-5'>
              <Button type='button' variant='light' onClick={() => removeFromCartHandler(item.id)}>
                <i className='fas fa-trash'></i>
              </Button>
            </Col>
          </Row>
        </ListGroup.Item>
      )}
      {/* {loading && <FullPageLoader></FullPageLoader>} */}
    </>
  );
};

export default CartItem;
