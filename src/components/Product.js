import React from 'react';
import {BACKEND_API_GATEWAY_URL} from '../constants/appConstants';
import {Card, Form} from 'react-bootstrap';
import Rating from './Rating';
import {Link} from 'react-router-dom';
import Loader from "./Loader";

const Product = (props) => {
    const product = props.product;
    return (
        <>
            <Card className='my-3 rounded' style={{height: '350px'}}>
                <Link to={`/book/${product.id}`}>
                    <Card.Img
                        src={`${BACKEND_API_GATEWAY_URL}/images/${product?.image}`}
                        variant='top'
                        style={{width: '100%'}}
                    ></Card.Img>
                </Link>
                <Card.Body>
                    <Link to={`/book/${product.id}`}>
                        <Card.Title as='div'>
                            <strong>{product.name}</strong>
                        </Card.Title>
                    </Link>

                    {/*<Card.Text as='div'>*/}
                    {/*  <Rating value={product.averageRating} text={`${product.noOfRatings} reviews`}></Rating>*/}
                    {/*</Card.Text>*/}

                    <Card.Text as='div' className='my-3'>
                        <p>${product.price}</p>
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    );
};

export default Product;
