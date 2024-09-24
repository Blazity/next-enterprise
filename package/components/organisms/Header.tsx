import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  sx?: object;
  onToggleButtonPanel: () => void;
}

const Header: React.FC<HeaderProps> = ({ sx, onToggleButtonPanel }) => {
  const { t } = useTranslation();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const formattedTime = currentDateTime.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card sx={{ ...sx, p: 0 }}>
      <CardContent sx={{ padding: "1px 8px" }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: "bold" }}>
              Generic user
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add Member
            </Typography>
          </Grid>

          <Grid>
            <Typography variant="body2" color="text.secondary">
              {formattedDate} - {formattedTime}
            </Typography>
          </Grid>

          <Grid>
            <Typography variant="body2" color="text.secondary">
              {t("lbl_Store")}: <strong>8004</strong> | {t("lbl_register")}: <strong>317</strong>
            </Typography>
          </Grid>

          <Grid>
            <Grid container alignItems="center">
              <PersonIcon sx={{ color: "text.secondary", fontSize: "18px", mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {t("lbl_associate")} <strong>2</strong>
              </Typography>
            </Grid>
          </Grid>

          <Grid>
            <IconButton size="small" onClick={onToggleButtonPanel}>
              <MoreVertIcon color="action" sx={{ fontSize: "18px" }} />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Header;
