import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllReminders } from "../../pages/api/reminderApi";

const initialState = {
  reminders: [],
};

export const fetchAllReminders = createAsyncThunk(
  "tasks/getAllReminders",
  async (thunkAPI) => {
    const response = await getAllReminders();
    return response.data;
  }
);


export const remindersSlice = createSlice({
  name: "reminders",
  initialState,
  reducers: {
    //Actions
    addReminder: (state, action) => {
      state.reminders = { ...state.reminders, ...action.payload };
    },
    editReminder: (state, action) => {
      state.reminders = { ...state.reminders, reminders: action.payload };
    },
    deleteReminder: (state, action) => {
      let newList = [...state.reminders];
      let filtered = newList.filter((item) => {
        if (item.xID != action.payload.xID) {
          return true;
        }
      });
      state.reminders = filtered;
    },
  },
});

export const { addReminder, editReminder, deleteReminder } =
  remindersSlice.actions;

//Selectors - this is how we pull information from the global store slice
export const reminders = (state) => state.reminders;

export default remindersSlice.reducer;
