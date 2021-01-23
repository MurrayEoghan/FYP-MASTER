const initState = [
  {
    id: 0,
    username: "",
  },
];

const userReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "USER_LOGIN":
      return [{ id: payload.id, username: payload.username }];
    default:
      return state;
  }

  return state;
};

export default userReducer;
