export const authHeaderToken = () => {
    const token = localStorage.getItem('Token');
    if (token) {
        return { 'x-access-token': token };
    } else {
        return {};
    }
};
