import React, {useEffect} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Table, Button, Row, Col} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {isAdmin} from '../../service/CommonUtils';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {PRODUCT_CREATE_RESET} from '../../constants/productConstants';
import {deleteAuthorAction, getAllAuthorAction} from "../../actions/authorsActions";

const AuthorsListScreen = ({history, match}) => {
    console.log("---------> 1")
    const dispatch = useDispatch();

    const authorList = useSelector((state) => state.authorAdminList);
    const {loading, error, products: authors, pageResponse} = authorList;

    const authorDelete = useSelector((state) => state.productDelete);
    const {loading: loadingDelete, error: errorDelete, success: successDelete} = authorDelete;

    const authorCreate = useSelector((state) => state.productCreate);
    const {loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct} = authorCreate;

    const userLogin = useSelector((state) => state.userLogin);
    const {userInfo} = userLogin;
    useEffect(async () => {
        dispatch({type: PRODUCT_CREATE_RESET});

        if (!userInfo || !isAdmin()) {
            history.push('/login');
        }
        await dispatch(getAllAuthorAction());
    }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure')) {
            dispatch(deleteAuthorAction(id));
        }
    };

    const createHandler = () => {
        history.push('/admin/author/create');
    };

    const handlePageClick = (data) => {
        let selected = data.selected;
        dispatch(getAllAuthorAction(selected));
    };

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Authors</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createHandler}>
                        <i className='fas fa-plus'></i> Create Author
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
                            <th>DATE OF BIRTH</th>
                            <th>COUNTRY</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {authors?.sort((a, b) => a.id - b.id)?.map((author) => (
                            <tr key={author.id}>
                                <td>{author.id}</td>
                                <td>{author.fullName}</td>
                                <td>{author.dateOfBirth}</td>
                                <td>{author.country}</td>
                                <td>
                                    <LinkContainer to={`/admin/author/${author.id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm'
                                            onClick={() => deleteHandler(author.id)}>
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

export default AuthorsListScreen;
