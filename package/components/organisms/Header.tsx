import MoreVertIcon from "@mui/icons-material/MoreVert"
import PersonIcon from "@mui/icons-material/Person"
import { Card, CardContent, CardHeader, IconButton, Typography } from "@mui/material"
import Grid from "@mui/material/Grid2"
import React from "react"
import { useTranslation } from "react-i18next"

interface HeaderProps {
  sx?: object
}

const Header: React.FC<HeaderProps> = ({ sx }) => {
  const { t } = useTranslation()
  return (
    <Card sx={{ ...sx, p: 0.1 }}>
      <CardHeader
        title="Generic userd"
        subheader="Add Member"
        titleTypographyProps={{ color: "text.primary", fontWeight: "bold", fontSize: "1rem" }}
        subheaderTypographyProps={{ color: "text.secondary", fontSize: "0.75rem" }} 
        sx={{ paddingBottom: 0 }}
      />
      <CardContent sx={{ paddingTop: 0.2 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="body2" color="text.secondary">
              Fri, 13 Sept
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body2" color="text.secondary">
              9:36 am
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body2" color="text.secondary">
              {t('lbl_Store')}: <strong>8004</strong>
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body2" color="text.secondary">
              {t('lbl_register')}: <strong>317</strong>
            </Typography>
          </Grid>
          <Grid container alignItems="center">
            <PersonIcon sx={{ color: "text.secondary", fontSize: "18px", mr: 0.9 }} /> {/* Icono más pequeño */}
            <Typography variant="body2" color="text.secondary">
              {t('lbl_associate')} <strong>2</strong>
            </Typography>
          </Grid>
          <Grid>
            <IconButton size="small">
              <MoreVertIcon color="action" sx={{ fontSize: "18px" }} />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Header
