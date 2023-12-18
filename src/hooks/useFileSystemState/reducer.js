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
    case "allow_run_sketch":
      return {
        ...state,
        canRunSketch: true,
      };
    default:
      return state;
  }
};
