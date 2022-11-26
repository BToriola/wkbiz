export function userID(state, action) {
  switch (action.type) {
    case "SET_USERID":
      return { ...state, userID: action.payload };
    case "CLEAR_USERID":
      return { ...state, userID: "" };
    default:
      return state;
  }
}
