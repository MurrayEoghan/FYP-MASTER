const initState = [
  {
    id: 0,
    username: "",
    following: [],
    followers: [],
  },
];

const userReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "USER_LOGIN":
      return [
        {
          id: payload.id,
          username: payload.username,
          following: payload.following,
          followers: payload.followers,
        },
      ];
    default:
      return state;
  }
};

export default userReducer;
