import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: [],
};

export const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    //Actions
    addCustomers: (state, action) => {
      state.customers = { ...state.customers, ...action.payload };
    },
    createCustomer: (state, action) => {
      state.customers = { ...state.customers, customers: action.payload };
    },
    deleteCustomer: (state, action) => {
      let newList = [...state.customers];
      let filtered = newList.filter((item) => {
        if (item.xID != action.payload.xID) {
          return true;
        }
      });
      state.customers = filtered;
    },
  },
});

export const { addCustomers, createCustomer, deleteCustomer } =
  customersSlice.actions;

//Selectors - this is how we pull information from the global store slice
export const customers = (state) => state.customers;

export default customersSlice.reducer;
