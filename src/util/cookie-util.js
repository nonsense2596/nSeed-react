import Cookies from "js-cookie";

export const getApplicationCookies = () => {
    const jwtToken = Cookies.get('jwtToken');
    const jwtTokenExp = Cookies.get('jwtTokenExp');
    const refreshToken = Cookies.get('refreshToken');
    const refreshTokenExp = Cookies.get('refreshTokenExp');
    return {jwtToken, jwtTokenExp, refreshToken, refreshTokenExp};
}

export const setApplicationCookies = (jwtTokenString, refreshTokenString) => {
    Cookies.set('jwtToken', jwtTokenString, { expires: new Date('9999-12-31') });
    Cookies.set('jwtTokenExp', new Date(new Date().getTime() + 1 * 60 * 1000), { expires: new Date('9999-12-31') });
    Cookies.set('refreshToken', refreshTokenString, { expires: new Date('9999-12-31') });
    Cookies.set('refreshTokenExp', new Date(new Date().getTime() + 24 * 60 * 60 * 1000), { expires: new Date('9999-12-31') });
}