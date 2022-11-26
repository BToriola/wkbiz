export function reminder(state, action) {
  switch (action.type) {
    case "FETCH_ALL_REMINDERS":
      return { ...state, tasks: action.payload };
    default:
      return state;
  }
}
