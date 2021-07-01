import { Auth } from "aws-amplify";
import { toast } from "react-toastify";
import { defaultConnect } from "./config";
export const login = () => {
  const tkst = localStorage.getItem("tk");
  if (tkst) {
    const tkn = JSON.parse();
    //checks if user is logged in, if so then set the user object
    if (tkn) {
      return tkn;
    }
  }
};

//logs out the current user, reloads page
export const logout = async () => {
  try {
    await Auth.signOut({ global: true });
    localStorage.removeItem("tk");
    window.location.reload();
  } catch (error) {
    toast(error);
  }
};
