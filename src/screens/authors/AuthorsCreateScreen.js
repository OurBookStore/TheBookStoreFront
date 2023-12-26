import React, {useEffect, useState} from 'react';
import {BACKEND_API_GATEWAY_URL} from '../../constants/appConstants';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {addImageToBook, createAuthorApi, createBookApi, getCountries, uploadImageApi} from '../../service/RestApiCalls';
import {TextField} from "@material-ui/core";

const AuthorsCreateScreen = ({match, history}) => {
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [country, setCountry] = useState('');

    const dispatch = useDispatch();

    const authorCreate = useSelector((state) => state.productCreate);
    const {loading, error, success, product: id} = authorCreate;
    let countries = getCountries();

    useEffect(async () => {
        countries = await getCountries();
        console.log(countries)
    }, [dispatch, history]);

    const submitHandler = async () => {
        const id = await createAuthorApi({
            fullName,
            dateOfBirth,
            country
        });
        history.push('/admin/authors');
    };

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <>
            <Link to='/admin/authors' className='btn btn-dark my-3'>
                Go Back
            </Link>

            <h1>Create Author</h1>
            <hr></hr>
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
                    <Row className='m-5 justify-content-md-center' onClick={submitHandler}>
                        <Button type='submit' variant='primary'>
                            Create Author
                        </Button>
                    </Row>
                </>
            )}
        </>
    );
};

export default AuthorsCreateScreen;
