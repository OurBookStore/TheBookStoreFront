import React, { useEffect } from 'react';
import { BACKEND_API_GATEWAY_URL } from '../constants/appConstants';
import { Col, Image, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from './Message';
import { getProductDetailApi } from '../service/RestApiCalls.js';
import { useState } from 'react';
import { getErrorMessage } from '../service/CommonUtils';
import Loader from './Loader';

const OrderItem = ({ item }) => {
  const [product, setProduct] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    try {
      // const productDetail = await getProductDetailApi(item.productId);
      // setProduct(productDetail);
      // setLoading(false);
      setProduct(item.book);
      setLoading(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [item]);

  return (
    <>
      {error && <Message variant='danger'> {JSON.stringify(error.message)}</Message>}
      {loading ? (
        <Loader></Loader>
      ) : (
        <ListGroup.Item key={item.productId}>
          <Row>
            <Col md={2}>
              <Image src={`${BACKEND_API_GATEWAY_URL}/images/${product?.image}`} alt={product.name} fluid rounded></Image>
            </Col>
            <Col md={3} className='pt-4'>
              <Link to={`/book/${product.id}`}>{product.name}</Link>
            </Col>
            <Col md={2} className='pt-4'>
              ${item.price}
            </Col>
            <Col md={2} className='pt-4'>
              {item.count}
            </Col>
            {/*<Col md={1} className='pt-4'>*/}
            {/*  ${item.orderExtendedPrice}*/}
            {/*</Col>*/}
          </Row>
        </ListGroup.Item>
      )}
    </>
  );
};

export default OrderItem;
