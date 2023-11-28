import jwtDecode from 'jwt-decode';

export const getErrorMessage = (error) => {
    return error
        ? error.response
            ? error.response.data
                ? error.response.data.message
                // ? error.response.data.error_description
                // // : error.response.data.errors.length > 0
                // // ? error.response.data.errors[0].message
                // : error.message
                : error.response.data.message
            : error.message
        : 'Something went wrong';
};

export const isAdmin = () => {
    const userInfoLocalStorage = localStorage.getItem('userInfo');
    if (userInfoLocalStorage) {
        const token = JSON.parse(userInfoLocalStorage).token;
        let decodedToken = jwtDecode(token);
        return decodedToken.resource_access["my-client"].roles.includes('ROLE_ADMIN');
    }
    return false;
};
