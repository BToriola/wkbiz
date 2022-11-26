export function profile(state, action) {
  switch (action.type) {
    case "MY_PROFILE_RECORD":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}
