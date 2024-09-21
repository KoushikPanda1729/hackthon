import { FC } from "react";
import styles from "./AdminPage.module.scss";
import { Typography } from "@mui/material";

interface AdminPageProps {}

const AdminPage: FC<AdminPageProps> = () => (
  <div className={styles.AdminPage}>
    <div>
      <Typography>Admin Page</Typography>
    </div>
  </div>
);

export default AdminPage;
