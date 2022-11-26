import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
// import { userID } from "./userSlices";
import { getAllTasks, deleteTask, createTask } from "../../pages/api/taskApi";

// Initial state
const initialState = {
  tasks: {
    isLoading: true,
    status: "idle",
    data: [],
    error: "",
  },
  tasksByMe: [],
};

export const fetchAllTasks = createAsyncThunk("tasks/fetchAlltasks", async (thunkAPI) => {
  const response = await getAllTasks();
  return response.data;
});
export const createOneTask = createAsyncThunk("tasks/createOneTask", async ({ title, assigneeProfileID, dueDateMillis }, thunkAPI) => {
  try {
    const response = await createTask({ title, assigneeProfileID, dueDateMillis });
    return response.data;
  } catch (err) {
  }
});
export const deleteOneTask = createAsyncThunk("tasks/deleteOneTask", async (taskID, thunkAPI) => {
  try {
    const response = deleteTask(taskID);
    return response.data;
  } catch (err) {
  }
});

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    //Actions
    addTask: (state, action) => {
      state.tasks = { ...state.tasks, ...action.payload };
    },
    editTask: (state, action) => {
      state.tasks = { ...state.tasks, tasks: action.payload };
    },
    getAllTasksByMe: (state, action) => {
      const profileID = localStorage.getItem("profileID");
      if (!action.payload || !Array.isArray(action.payload) || action.payload.length == 0) return;
      let newList = [...action.payload];
      let filtered = newList.filter((item) => {
        if (item.assignerProfileID == profileID) {
          return true;
        }
      });
      state.tasksByMe = filtered;
    },
  },
  // Async reducers

  extraReducers(builder) {
    // Pending
    builder
      .addCase(fetchAllTasks.pending, (state, action) => {
        state.tasks = { ...state.tasks, isLoading: true, status: "busy", error: "" };
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.tasks = {
          isLoading: false,
          status: "idle",
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.tasks.error = "Something wewnt wrong fetching tasks";
        state.tasks.isLoading = false;
        state.tasks.status = "idle";
      })
      .addCase(createOneTask.pending, (state, action) => {
        state.tasks.isLoading = true;
        (state.tasks.status = "busy"), (state.tasks.error = "");
      })
      .addCase(createOneTask.rejected, (state, action) => {
        state.tasks.isLoading = false;
        (state.tasks.status = "idle"), (state.tasks.error = "Something went wrong creating your task");
      })
      .addCase(createOneTask.fulfilled, (state, action) => {
        state.tasks = {
          isLoading: false,
          status: "idle",
          data: action.payload,
          error: "",
        };
      })
      .addCase(deleteOneTask.fulfilled, (state, action) => {
        state.tasks = {
          isLoading: false,
          status: "idle",
          data: action.payload,
          error: "",
        };
      })
      .addCase(deleteOneTask.pending, (state, action) => {
        state.tasks.isLoading = true;
        (state.tasks.status = "busy"), (state.tasks.error = "");
      })
      .addCase(deleteOneTask.rejected, (state, action) => {
        state.tasks.isLoading = false;
        (state.tasks.status = "idle"), (state.tasks.error = "couldn't delete the task");
      });
  },
});

export const { addTask, editTask, getAllTasksByMe } = tasksSlice.actions;

//Selectors - this is how we pull information from the global store slice
// export const tasks = (state) => state.tasks;
export const taskState = (state) => state.tasks;
export const taskStateByMe = (state) => state.tasksByMe;

export default tasksSlice.reducer;
