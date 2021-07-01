import jwtDecode, { JwtPayload } from "jwt-decode";
import { defaultConnect } from "./config";
import { usrCreds } from "./interfaces";

export const login = (): Promise<usrCreds> => {
    const tkn = JSON.parse(localStorage.getItem("tk"));
    //checks if user is logged in, if so then set the user object
    if (tkn) {
        const jwt = jwtDecode(tkn.token) as JwtPayload; //searches local storage for jwt key
        if ((jwt.exp || 0) * 1000 < Date.now()) {
            logout();
            return null;
        }
        return defaultConnect
            .post(("/user/getprof"), {
                token: jwt
            })
            .then((itm) => itm.data);
    }
};

//logs out the current user, reloads page
export const logout = () => {
    localStorage.removeItem("tk");
    window.location.reload();
}