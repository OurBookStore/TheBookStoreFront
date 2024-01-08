import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { listMyOrdersAction } from '../actions/orderActions';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import FullPageLoader from '../components/FullPageLoader';
import Message from '../components/Message';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

const ProfileScreen = ({ history }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { error: errorUserDetails, loading: loadingUserDetails, user } = userDetails;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { error: errorUpdateUserDetails, loading: loadingUpdateUserDetails, success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { error: errorOrderListMy, loading: loadingOrderListMy, orders } = orderListMy;



  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user || !user.nickname) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails(userInfo.id));
      } else {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
      }
    }
    dispatch(listMyOrdersAction(userInfo.id));
  }, [dispatch, history, userInfo, user]);

  const userProfileUpdateHandler = (e) => {
    e.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      let id = userInfo.id;
      dispatch(updateUserProfile({ id ,nickname, email, password }));
    }
  };

  const getStatusOptions = (order,statusName) => {
    return order.orderStatusHistories.find( status => status.status === statusName);
  };

  const isContainsStatus = ( order, statusName) => {
    return order.orderStatusHistories.includes( status => {
      return status.status === statusName;
    })
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant='danger'>{message}</Message>}
        {success && <Message variant='success'>Profile Updated</Message>}
        {(errorUserDetails || errorUpdateUserDetails) && <Message variant='danger'>{errorUserDetails || errorUpdateUserDetails}</Message>}
        <Form onSubmit={userProfileUpdateHandler}>
          <Form.Group controlId='firstName'>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type='nickname'
              placeholder='Enter nickname'
              value={nickname}
              onChange={(e) => setNickName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          {/*<Form.Group controlId='lastName'>*/}
          {/*  <Form.Label>Last Name</Form.Label>*/}
          {/*  <Form.Control*/}
          {/*    type='lastName'*/}
          {/*    placeholder='Enter Last Name'*/}
          {/*    value={lastName}*/}
          {/*    onChange={(e) => setLastName(e.target.value)}*/}
          {/*  ></Form.Control>*/}
          {/*</Form.Group>*/}

          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {errorOrderListMy ? (
          <Message variant='danger'>{errorOrderListMy}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE AND TIME</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{getStatusOptions(order,'CREATED').actualFrom}</td>
                  <td>{order.totalPrice}</td>

                  <td>{isContainsStatus(order,'DELIVERING') ? getStatusOptions(order,'DELIVERING').actualFrom : <i className='fas fa-times' style={{ color: 'red' }}></i>}</td>
                  <td>
                    {isContainsStatus(order,'DONE') ? getStatusOptions(order,'DONE').actualFrom : <i className='fas fa-times' style={{ color: 'red' }}></i>}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order.id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
      {(loadingUserDetails || loadingUpdateUserDetails || loadingOrderListMy) && <FullPageLoader />}
    </Row>
  );
};

export default ProfileScreen;
