import { FC, useContext } from "react";
import styles from "./Header.module.scss";
import { Button, Typography } from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";

interface HeaderProps {
  isAuthPage?: boolean;
}

const Header: FC<HeaderProps> = ({ isAuthPage = false }) => {
  const { logout } = useContext(AuthContext);

  return (
    <header className={styles.Header}>
      <h3 className={styles.logo}>HireLens</h3>
      {!isAuthPage && (
        <Button
          variant="contained"
          color="primary"
          className={styles.logoutButton}
          onClick={logout}
        >
          Log Out
        </Button>
      )}
    </header>
  );
};

export default Header;
