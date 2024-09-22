import { FC, useContext } from "react";
import styles from "./Header.module.scss";
import { Button, Typography } from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";

interface HeaderProps {
  isAuthPage?: boolean;
  isAdminPage?: boolean;
}

const Header: FC<HeaderProps> = ({
  isAuthPage = false,
  isAdminPage = false,
}) => {
  const { logout } = useContext(AuthContext);

  if (isAdminPage) {
    return (
      <header className={styles.Header}>
        <div className={styles.headerWrap}>
          <h3 className={styles.logo}>HireLens </h3>
          <h4>Admin DashBoard</h4>
          <Button
            variant="contained"
            color="primary"
            className={styles.logoutButton}
            onClick={logout}
            startIcon={<LogoutIcon />}
          >
            Log Out
          </Button>
        </div>
      </header>
    );
  } else {
    return (
      <header className={styles.Header}>
        <div className={styles.headerWrap}>
          <h3 className={styles.logo}>HireLens</h3>
          {!isAuthPage && (
            <Button
              variant="contained"
              color="primary"
              className={styles.logoutButton}
              onClick={logout}
              startIcon={<LogoutIcon />}
            >
              Log Out
            </Button>
          )}
        </div>
      </header>
    );
  }
};

export default Header;
