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
import {countriesAction} from "../../actions/countriesActions";
import {addBookToAuthorApi, removeBookToAuthorApi, uploadImageApi} from "../../service/RestApiCalls";

const AuthorsEditScreen = ({match, history}) => {
    const authorId = match.params.id;

    const [open, setOpen] = React.useState(false);

    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [country, setCountry] = useState('');
    let [books, setBooks] = useState([]);
    const [bookId, setBookId] = useState('');

    const dispatch = useDispatch();

    const countryList = useSelector((state) => state.countryList);
    const {loading1, error1, countries: countries} = countryList;


    let authorDetails = useSelector((state) => state.productDetails);
    let {loading, error, product} = authorDetails;

    // product.fullName = undefined;

    // let file = match.target.files[0];

    console.log("---->0")

    const productUpdate = useSelector((state) => state.productUpdate);
    const {loading: loadingUpdate, error: errorUpdate, success: successUpdate} = productUpdate;

    useEffect(() => {
        dispatch(countriesAction())
        if (successUpdate) {
            dispatch({type: PRODUCT_UPDATE_RESET});
            history.push('/admin/authors');
        } else {
            console.log("---->1")
            console.log("!product?.fullName ", product?.fullName)
            if (!product?.fullName) {
                console.log("---->2")
                // window.location.reload();
                dispatch(getAuthorAction(authorId));
            } else {
                setFullName(product.fullName);
                setDateOfBirth(product.dateOfBirth);
                setCountry(product.country);
                setBooks(product.books.map(book => book.id))
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

    const addBookHandler = async (e) => {
        await addBookToAuthorApi(authorId, bookId);
        window.location.reload()
    };

    const removeBookHandler = async (e) => {
        await removeBookToAuthorApi(authorId, bookId);
        window.location.reload()
    };

    const handleOpen = () => {
        setOpen(!open);
    };

    function handleChange(e) {
        this.setState({selectValue: e.target.value});
    }

    return (
        <>
            <Link to='/admin/authors' className='btn btn-dark my-3'
                  onClick={(e) => {
                      product.fullName = undefined;
                      return e;
                  }
            }>
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
                                <div>
                                    <TextField
                                        id="date"
                                        type="date"
                                        value={dateOfBirth}
                                        defaultValue={dateOfBirth}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group controlId='country'>
                                <Form.Label>Country : </Form.Label>
                                <select onChange={(e) => setCountry(e.target.value)}>
                                    {countries.map((country, index) => (
                                        <option value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className='m-5 justify-content-md-center'>
                        <Button type='submit' variant='primary' onClick={submitHandler}>
                            Update
                        </Button>
                    </Row>

                    <Form.Group controlId='books'>
                        <Form.Label>Books</Form.Label>
                        <Form.Control
                            type='books'
                            placeholder='Nothing'
                            value={books}
                            readOnly={true}
                        ></Form.Control>
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group controlId='bookId'>
                                <Form.Label>Book</Form.Label>
                                <Form.Control
                                    type='bookId'
                                    placeholder='Enter bookId'
                                    value={bookId}
                                    onChange={(e) => setBookId(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className='m-5 justify-content-md-center'>
                        <Button type='submit' variant='primary' onClick={addBookHandler}>
                            Add book
                        </Button>
                        <Button type='submit' variant='primary' onClick={removeBookHandler}>
                            Remove book
                        </Button>
                    </Row>
                </>
            )}
        </>
    );
};

export default AuthorsEditScreen;
