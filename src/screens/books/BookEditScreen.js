import React, {useEffect, useState} from 'react';
import {BACKEND_API_GATEWAY_URL} from '../../constants/appConstants';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {PRODUCT_UPDATE_RESET} from '../../constants/productConstants';
import {addImageToBook, getBookApi, uploadImageApi} from '../../service/RestApiCalls';
import {getBookAction, updateBookAction} from "../../actions/booksActions";

const BookEditScreen = ({match, history}) => {
    const bookId = match.params.id;

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [imageId, setImageId] = useState('');
    const [count, setCount] = useState(0);
    const [uploading, setUploading] = useState(false);

    const dispatch = useDispatch();

    let bookDetails = useSelector((state) => state.productDetails);
    let {loading, error, product} = bookDetails;

    // let file = match.target.files[0];

    const productUpdate = useSelector((state) => state.productUpdate);
    const {loading: loadingUpdate, error: errorUpdate, success: successUpdate} = productUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({type: PRODUCT_UPDATE_RESET});
            history.push('/admin/books');
        } else {
            if (!product?.name) {
                dispatch(getBookAction(bookId));
            } else {
                setName(product.name);
                setPrice(product.price);
                setCount(product.count);
                setImageId(product.image);
            }
        }
    }, [dispatch, history, bookId, product, successUpdate]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            const imageId = await uploadImageApi(config, formData);
            setImageId(imageId);
            setUploading(false);

            if (imageId) {
                await addImageToBook(imageId, bookId);
            }
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const submitHandler = (e) => {
        dispatch(
            updateBookAction({
                id: bookId,
                name,
                price,
                count
            })
        );
    };

    return (
        <>
            <Link to='/admin/books' className='btn btn-dark my-3'>
                Go Back
            </Link>
            <h1>Edit Book</h1>
            <hr></hr>
            {loadingUpdate && <Loader/>}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loading ? (
                <Loader/>
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <>
                    <Row>
                        <Col md={4}>
                            <Row>
                                <Form.Group controlId='image'>
                                    <img
                                        src={`${BACKEND_API_GATEWAY_URL}/images/${imageId}`}
                                        alt={imageId}
                                        style={{width: '350px'}}
                                        fluid
                                        rounded
                                    ></img>
                                    {uploading && <Loader/>}
                                </Form.Group>
                                <Form.File className='mr-4' id='image-file' label='Choose File' custom
                                           onChange={uploadFileHandler}></Form.File>
                            </Row>
                        </Col>
                        <Col>
                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type='name'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='price'>
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='count'>
                                <Form.Label>Count</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter count'
                                    value={count}
                                    onChange={(e) => setCount(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className='m-5 justify-content-md-center'>
                        <Button type='submit' variant='primary' onClick={submitHandler}>
                            Update
                        </Button>
                    </Row>
                </>
            )}
        </>
    );
};

export default BookEditScreen;
