import React, {useEffect, useState} from 'react';
import {BACKEND_API_GATEWAY_URL} from '../constants/appConstants';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {addImageToBook, createBookApi, uploadImageApi} from '../service/RestApiCalls';
import {createBookAction} from "../actions/booksActions";

const BookCreateScreen = ({match, history}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [count, setCount] = useState(0);
    const [imageId, setImageId] = useState('');
    const [uploading, setUploading] = useState(false);

    const dispatch = useDispatch();

    const bookCreate = useSelector((state) => state.productCreate);
    const {loading, error, success, product: bookId} = bookCreate;

    useEffect(async () => {
    }, [dispatch, history]);

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
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const submitHandler = async () => {
        // await dispatch(
        //     createBookAction({
        //         name,
        //         price,
        //         count
        //     })
        // )
        const bookId = await createBookApi({
            name,
            price,
            count
        });
        if (imageId) {
            await addImageToBook(imageId, bookId);
        }
        history.push('/admin/books');
    };

    return (
        <>
            <Link to='/admin/books' className='btn btn-dark my-3'>
                Go Back
            </Link>

            <h1>Create Book</h1>
            <hr></hr>
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
                                <Form.File className='mt-5 mr-4' id='image-file' label='Choose File' custom
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
                    <Row className='m-5 justify-content-md-center' onClick={submitHandler}>
                        <Button type='submit' variant='primary'>
                            Create Book
                        </Button>
                    </Row>
                </>
            )}
        </>
    );
};

export default BookCreateScreen;
