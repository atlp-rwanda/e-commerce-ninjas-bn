// user repositories
import Users from "../../../databases/models/users";


// Function to get single user
const getSingleUserFx = async (id: number) => {
  return await Users.findOne({
    where: {
      id: id
    }
  });
};

// Function to update the user role
const updateUserRoleFx = async (id: number, role: string) => {
  return await Users.update(
    {
      role: role
    },
    {
      where: {
        id: id
      }
    }
  );
};

export default { getSingleUserFx, updateUserRoleFx };
