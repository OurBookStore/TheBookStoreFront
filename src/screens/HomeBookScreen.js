import Paginate from '../components/Paginate';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Product from '../components/Product';
import Message from '../components/Message';
import {Button, Col, Form, Row} from 'react-bootstrap';

import FullPageLoader from '../components/FullPageLoader';
import ReactPaginate from 'react-paginate';
import {BACKEND_API_GATEWAY_URL} from "../constants/appConstants";
import {
    getDefaultsDatesAction,
    listBooksActionWithPaginate,
    searchBooksAction
} from "../actions/booksActions";
import Loader from "../components/Loader";
import {TextField} from "@material-ui/core";

const BOOK_PER_PAGE = 3;

const HomeBookScreen = () => {

    const [searchText, setSearchText] = useState('');
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');

    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    const {loading, error, products, pageResponse} = productList;

    const datesDetails = useSelector((state) => state.productDetails);
    const {loading1, error1, product: dates} = datesDetails;

    useEffect(() => {
        // dispatch(listBooksActionWithPaginate(0));
        if (!dates?.dateOfBirthMin || !dates?.dateOfBirthMax) {
            dispatch(getDefaultsDatesAction());
        } else {
            setMinDate(dates.dateOfBirthMin);
            setMaxDate(dates.dateOfBirthMax);
            dispatch(searchBooksAction({
                searchText,
                pageNumber: 0,
                bookPerPage: BOOK_PER_PAGE,
                dateOfBirthFrom: dates.dateOfBirthMin,
                dateOfBirthTo: dates.dateOfBirthMax
            }));
        }
    }, [dispatch, dates]);

    const handlePageClick = (data) => {
        console.log("data.selected ", data.selected)
        let selected = data.selected;
        dispatch(searchBooksAction({
            searchText,
            pageNumber: selected,
            bookPerPage: BOOK_PER_PAGE,
            dateOfBirthFrom: minDate,
            dateOfBirthTo: maxDate
        }));
    };

    const searchBooks = () => {
        console.log("111")
        if (searchText.length < 3) {
            setSearchText("");
        }
        dispatch(searchBooksAction({
            searchText,
            pageNumber: 0,
            bookPerPage: BOOK_PER_PAGE,
            dateOfBirthFrom: minDate,
            dateOfBirthTo: maxDate
        }));
    };

    return (
        <>
            {
                error ? (
                    <Message variant='danger'></Message>
                ) : (
                    <>
                        <Row>
                            <Col md={2}>
                                <h2>Filters</h2>
                                <Row>
                                    <Form.Group controlId='minDate'>
                                        <Form.Label>minimum date of birthday</Form.Label>
                                        <div>
                                            <TextField
                                                id="minDate"
                                                type="date"
                                                value={minDate}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                onChange={(e) => setMinDate(e.target.value)}
                                            />
                                        </div>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group controlId='maxDate'>
                                        <Form.Label>maximum date of birthday</Form.Label>
                                        <div>
                                            <TextField
                                                id="maxDate"
                                                type="date"
                                                value={maxDate}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                onChange={(e) => setMaxDate(e.target.value)}
                                            />
                                        </div>
                                    </Form.Group>
                                </Row>
                            </Col>
                            <Col>
                                <h1>Books</h1>
                                <Form.Group controlId='search'>
                                    <Row>
                                        <Col md={10}>
                                            <Form.Control
                                                type='search'
                                                placeholder='Enter name of book or name of author'
                                                value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if(e.key === "Enter") {
                                                        searchBooks()
                                                    }
                                                }
                                            }
                                            >
                                            </Form.Control>
                                        </Col>
                                        <Col md={2}>
                                            <Button
                                                type='submit'
                                                variant='primary'
                                                onClick={searchBooks}
                                            >
                                                Search
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Row>
                                    {
                                        products?.books?.map((product) => (
                                                <Col key={product.id} sm={12} md={6} lg={4} xl={4}>
                                                    <Product key={product.id} product={product}></Product>
                                                </Col>
                                            )
                                        )
                                    }
                                </Row>
                                {/* pageResponse?.pageable?.pageNumber */}
                                <Row className='m-5 justify-content-md-center'>
                                    <ReactPaginate
                                        previousLabel={'Previous'}
                                        nextLabel={'Next'}
                                        breakLabel={'...'}
                                        breakClassName={'break-me'}
                                        pageCount={pageResponse}
                                        marginPagesDisplayed={50}
                                        pageRangeDisplayed={10}
                                        onPageChange={(e) => handlePageClick(e)}
                                        containerClassName={'pagination'}
                                        activeClassName={'page-item active'}
                                        pageLinkClassName={'page-link'}
                                        previousClassName={'page-link'}
                                        nextClassName={'page-link'}
                                    />
                                </Row>
                            </Col>
                        </Row>
                    </>
                )}
            {loading && <FullPageLoader></FullPageLoader>}
        </>
    );
};

export default HomeBookScreen;
