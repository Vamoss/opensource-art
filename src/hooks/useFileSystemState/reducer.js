import { initialState } from "./initialState";

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "update_files":
      return {
        ...state,
        files: action.payload,
      };
    case "update_code":
      return {
        ...state,
        code: action.payload,
      };
    case "update_state":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
