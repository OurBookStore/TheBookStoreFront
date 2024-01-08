import { Container } from 'react-bootstrap';
import React, { Component }  from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import Footer from './components/Footer';
import Header from './components/Header';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import BookListScreen from './screens/books/BookListScreen';
import BookEditScreen from './screens/books/BookEditScreen';
import BookCreateScreen from './screens/books/BookCreateScreen';
import { createBrowserHistory } from 'history';
import OrderListScreen from './screens/OrderListScreen';
import BookScreen from "./screens/books/BookScreen";
import HomeBookScreen from "./screens/HomeBookScreen";
import AuthorsListScreen from "./screens/authors/AuthorsListScreen";
import AuthorsCreateScreen from "./screens/authors/AuthorsCreateScreen";
import AuthorsEditScreen from "./screens/authors/AuthorsEditScreen";

export const history = createBrowserHistory();

function App() {
  return (
    <BrowserRouter history={history}>
      <Header></Header>
      <main className='py-3'>
        <Container>
          <Route path='/order/:id' component={OrderScreen} />
          <Route path='/login' component={LoginScreen}></Route>
          <Route path='/payment' component={PaymentScreen}></Route>
          <Route path='/placeOrder' component={PlaceOrderScreen}></Route>
          <Route path='/shipping' component={ShippingScreen}></Route>
          <Route path='/userProfile' component={ProfileScreen} />
          <Route path='/register' component={RegisterScreen}></Route>
          {/*<Route path='/product/:id' component={ProductScreen}></Route>*/}
          <Route path='/book/:id' component={BookScreen}></Route>
          <Route path='/cart/:id?' component={CartScreen}></Route>

          <Route path='/admin/userlist' component={UserListScreen} />
          <Route path='/admin/user/:id/edit' component={UserEditScreen} />

          <Route path='/admin/books' component={BookListScreen} exact />
          <Route path='/admin/book/create' component={BookCreateScreen} />
          <Route path='/admin/book/:id/edit' component={BookEditScreen} />

          {/*<Route path='/admin/productlist/:pageNumber' component={ProductListScreen} exact />*/}

          <Route path='/admin/authors' component={AuthorsListScreen} exact />
          <Route path='/admin/author/create' component={AuthorsCreateScreen} />
          <Route path='/admin/author/:id/edit' component={AuthorsEditScreen} />

          <Route path='/admin/orderlist' component={OrderListScreen} />

          <Route path='/' component={HomeBookScreen} exact></Route>
        </Container>
      </main>
      <Footer> </Footer>
    </BrowserRouter>
  );
}

export default App;
