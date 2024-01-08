import React, {useEffect} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Table, Button, Row, Col} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {isAdmin} from '../../service/CommonUtils';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { listBooksActionWithPaginate, deleteBookAction, listBooksAction } from '../../actions/booksActions';
import {PRODUCT_CREATE_RESET} from '../../constants/productConstants';
import ReactPaginate from 'react-paginate';
import {BACKEND_API_GATEWAY_URL} from "../../constants/appConstants";

const BookListScreen = ({history, match}) => {
    console.log("---------> 1")
    const dispatch = useDispatch();

    const bookList = useSelector((state) => state.bookAdminList);
    const {loading, error, products: books, pageResponse} = bookList;

    const bookDelete = useSelector((state) => state.productDelete);
    const {loading: loadingDelete, error: errorDelete, success: successDelete} = bookDelete;

    const bookCreate = useSelector((state) => state.productCreate);
    const {loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct} = bookCreate;

    const userLogin = useSelector((state) => state.userLogin);
    const {userInfo} = userLogin;
    console.log("---------> 2")
    useEffect(async () => {
        console.log("---------> 3")
        dispatch({type: PRODUCT_CREATE_RESET});

        if (!userInfo || !isAdmin()) {
            history.push('/login');
        }
        console.log("---------> 4")
        await dispatch(listBooksAction());
    }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure')) {
            dispatch(deleteBookAction(id));
        }
    };

    const createHandler = () => {
        history.push('/admin/book/create');
    };

    const handlePageClick = (data) => {
        let selected = data.selected;
        dispatch(listBooksActionWithPaginate(selected));
    };

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Books</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createHandler}>
                        <i className='fas fa-plus'></i> Create Book
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader/>}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {loadingCreate && <Loader/>}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            {loading ? (
                <Loader/>
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <>
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>COUNT</th>
                            <th>IMAGE ID</th>
                            <th>IMAGE</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {books?.sort((a, b) => a.id - b.id).map((book) => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.name}</td>
                                <td>${book.price}</td>
                                <td>{book.count}</td>
                                <td>{book.image}</td>
                                <td>
                                    <img
                                        src={`${BACKEND_API_GATEWAY_URL}/images/${book.image}`}
                                        alt={book.image}
                                        style={{width: '50px'}}
                                        // fluid
                                        // rounded
                                    ></img>
                                </td>
                                <td>
                                    <LinkContainer to={`/admin/book/${book.id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm'
                                            onClick={() => deleteHandler(book.id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </>
            )}
        </>
    );
};

export default BookListScreen;
