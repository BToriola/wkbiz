import axios from "axios";
import { getIdToken } from "firebase/auth";
import { BASE_URL } from "../../utils/constants";
import { FBauth } from "../../configs/firebase-config";

export const getIDtoken = async () => {
  const { currentUser } = FBauth;
  if (!currentUser) return;
  const token = await getIdToken(currentUser, true);
  return token;
};

export const createCustomer = async (customerData) => {
  const token = await getIDtoken();
  const myUID = localStorage.getItem("userID");
  if (!token) {
    alert("User cannot cannot be authenticated");
  }

  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}/customer`,
      data: {
        myUID,
        idToken: token,
        action: "addCustomer",
        organizationID: "i0OAsUwlAPnbV5JvnDJX",
        ...customerData,
        representativeProfileID: myUID,
      },
    })
  } catch (error) {
    alert(error.response.data.debug)
  }
};

export const updateCustomer = async (customerData) => {
  const token = await getIDtoken();
  const myUID = localStorage.getItem("userID");
  if (!token) {
    alert("User can't be authenticated");
  }

  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}/customer`,
      data: {
        myUID,
        idToken: token,
        action: "editCustomer",
        organizationID: "i0OAsUwlAPnbV5JvnDJX",
        ...customerData,
        customerID: customerData.xID
      },
    })
  } catch (error) {
    alert(error.response.data.debug)
  }
};