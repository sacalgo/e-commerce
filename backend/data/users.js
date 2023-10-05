import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Sac Top",
    email: "sac@gmail.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Sourav Roy",
    email: "sourav@gmail.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;