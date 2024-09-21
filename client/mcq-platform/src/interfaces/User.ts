export interface User {
  _id: string;
  userName: string;
  email: string;
  role: "user" | "admin"; // Define roles here
  createdAt: string;
  updatedAt: string;
}
