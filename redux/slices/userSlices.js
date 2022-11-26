import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Router from "next/router";
import { FBauth } from "../../configs/firebase-config";
import { AuthenticateUser } from "../../utils/functions";

const initialState = {
  user: {
    loading: true,
    profileID: "",
    userID: "",
    userData: null,
    organizationIDs:[],
    organizationName:'',
    profileData: null,
    error: null,
  },
};

const logout = async () => {
  FBauth.signOut().then(
    function () {
      localStorage.removeItem("userID");
      localStorage.removeItem("profileID");
      localStorage.removeItem("pictureURL");
      localStorage.removeItem("userName");
      // Router.push("/signin");
      const user = AuthenticateUser();
    },
    function (error) {
      console.error("Sign Out Error", error);
    }
  );
};

export const logOutUser = createAsyncThunk("user/logout", async (thunkAPI) => {
  const response = await logout();
  return response.data;
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //Actions
    addUserData: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    addUserID: (state, action) => {
      state.user = { ...state.user, userID: action.payload };
    },
    addUserProfileID: (state, action) => {
      state.user = { ...state.user, profileID: action.payload };
    },
    addUserProfileData: (state, action) => {
      state.user = { ...state.user, profileData: action.payload };
    },
    addUserError: (state, action) => {
      state.user = { ...state.user, error: action.payload };
    },
    setUserLoading: (state, action) => {
      state.user = { ...state.user, loading: action.payload };
    },
    
    // removeFromCart: (state, action) => {
    //   const index = state.items.findIndex((cartItem) => cartItem.id === action.payload.id);
    //   let newCart = [...state.items];
    //   if (index >= 0) {
    //     //the item exists in order; remove it
    //     newCart.splice(index, 1); //(position, number of item to delete)
    //   } else {
    //     console.warn(`cant remove item(id: ${action.payload.id}) as its not in order`);
    //   }
    //   state.items = newCart;
    // },

    //some other actions....
  },
  extraReducers: {
    // Pending
    [logOutUser.pending.type]: (state) => {
      state.user = {
        loading: true,
        profileID: "",
        userID: "",
        userData: null,
        profileData: null,
        error: null,
      };
    },
    // Fulfilled
    [logOutUser.fulfilled.type]: (state, action) => {
      state.user = {
        loading: false,
        profileID: "",
        userID: "",
        userData: null,
        profileData: null,
        error: null,
      };
    },
    // Rejected
    [logOutUser.rejected.type]: (state, action) => {
      state.user = {
        loading: false,
        profileID: "",
        userID: "",
        userData: null,
        profileData: null,
        error: action.payload,
      };
    },
  },
});

export const {
  addUserData,
  addUserID,
  addUserProfileID,
  addUserProfileData,
  addUserError,
  setUserLoading,
} = userSlice.actions;

//Selectors - this is how we pull information from the global store slice
export const userID = (state) => state.user.userID;
export const userData = (state) => state.user.userData;
export const userProfileData = (state) => state.user.profileData;
export const userProfileID = (state) => state.user.profileID;
export const userLoading = (state) => state.user.userData;
export const organizationIDs = (state) => state.user.userData;
export const userError = (state) => state.user.error;
export const userState = (state) => state.user;

export default userSlice.reducer;
