import React, {useEffect, useState} from 'react';
import {BACKEND_API_GATEWAY_URL} from '../../constants/appConstants';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {PRODUCT_UPDATE_RESET} from '../../constants/productConstants';
import {getBookAction, updateBookAction} from "../../actions/booksActions";
import {getAuthorAction, updateAuthorAction} from "../../actions/authorsActions";
import {TextField} from "@material-ui/core";

const AuthorsEditScreen = ({match, history}) => {
    const authorId = match.params.id;

    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [country, setCountry] = useState('');

    const dispatch = useDispatch();

    let authorDetails = useSelector((state) => state.productDetails);
    let {loading, error, product} = authorDetails;

    // let file = match.target.files[0];

    const productUpdate = useSelector((state) => state.productUpdate);
    const {loading: loadingUpdate, error: errorUpdate, success: successUpdate} = productUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({type: PRODUCT_UPDATE_RESET});
            history.push('/admin/authors');
        } else {
            if (!product?.fullName) {
                dispatch(getAuthorAction(authorId));
            } else {
                setFullName(product.fullName);
                setDateOfBirth(product.dateOfBirth);
                setCountry(product.country);
            }
        }
    }, [dispatch, history, authorId, product, successUpdate]);

    const submitHandler = (e) => {
        dispatch(
            updateAuthorAction({
                id: authorId,
                fullName,
                country,
                dateOfBirth
            })
        );
    };

    return (
        <>
            <Link to='/admin/authors' className='btn btn-dark my-3'>
                Go Back
            </Link>
            <h1>Edit Author</h1>
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
                        <Col>
                            <Form.Group controlId='fullName'>
                                <Form.Label>Full name</Form.Label>
                                <Form.Control
                                    type='fullName'
                                    placeholder='Enter full name'
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='dateOfBirth'>
                                <Form.Label>Date of birth</Form.Label>
                                <div >
                                    <TextField
                                        id="date"
                                        type="date"
                                        defaultValue="2017-05-24"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group controlId='country'>
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                    type='country'
                                    placeholder='Enter country'
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
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

export default AuthorsEditScreen;
