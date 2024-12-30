// Utility to parse cookies from the request header
const parseCookies = (cookieHeader) => {
    if (!cookieHeader) return {};
    return cookieHeader.split(';').reduce((cookies, cookie) => {
        const [key, value] = cookie.trim().split('=');
        cookies[key] = value;
        return cookies;
    }, {});
};

// Validate function (stub)
const validate = (token) => {
    console.log("Token:", token);
    const isValidToken = true; // Replace with actual validation logic
    if (!token || !isValidToken) return false;
    return true;
};

// Middleware to extract and validate token from cookies
export const authMiddleware = (req) => {
    // Get the 'Cookie' header from the request
    const cookieHeader = req?.headers?.get('Cookie');
    console.log(cookieHeader,"cookieHeader ");
    const cookies = parseCookies(cookieHeader);

    // Extract the token (e.g., 'authToken' key)
    const token = cookies['authToken'];
    console.log("Extracted Token:", token);

    // Validate the token
    return { isValid: validate(token) };
};
