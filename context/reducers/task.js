import { createTask } from "../../pages/api/taskApi";

export async function task(state, action) {
  switch (action.type) {
    case "FETCH_ALL_TASKS":
      return { ...state, tasks: action.payload };
    case "CREATE_TASK":
      // return { ...state, tasks: [...state.tasks, { ...action.payload }] };
      return { ...state, tasks: await createTask(action.payload) };
    default:
      return state;
  }
}
