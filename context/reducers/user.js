export function user(state, action) {
  switch (action.type) {
    case "MY_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}
