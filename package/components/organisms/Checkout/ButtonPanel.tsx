import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import BackspaceIcon from "@mui/icons-material/Backspace"
import CreditCardIcon from "@mui/icons-material/CreditCard"
import DeleteIcon from "@mui/icons-material/Delete"
import DiscountIcon from "@mui/icons-material/Discount"
import LockIcon from "@mui/icons-material/Lock"
import PercentIcon from "@mui/icons-material/Percent"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import ReceiptIcon from "@mui/icons-material/Receipt"
import RedeemIcon from "@mui/icons-material/Redeem"
import ReplayIcon from "@mui/icons-material/Replay"
import SearchIcon from "@mui/icons-material/Search"
import SettingsIcon from "@mui/icons-material/Settings"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import StorefrontIcon from "@mui/icons-material/Storefront"
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation"
import { Box, Card, CardContent } from "@mui/material"
import Grid from "@mui/material/Grid2"
import React from "react"
import { useTranslation } from "react-i18next"
import Button from "@atoms/Button"
import { Tooltip } from "@atoms/Tooltip"
import ThemeToggle from "@styles/ThemeToggle"


const ButtonPanel: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <ThemeToggle />

        <Grid container spacing={1}>
          <Grid size={{ xs: 4 }}>
            <Tooltip explainer="Anula la orden actual" side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label="Void Order"
                  onClick={() => {}}
                  variant="danger"
                  className="full-size-button"
                  startIcon={<ShoppingCartIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Tooltip explainer="Void Last" side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label="Void Last"
                  onClick={() => {}}
                  variant="danger"
                  className="full-size-button"
                  startIcon={<BackspaceIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_resume_previously_suspended_order")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label="Resume"
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<PlayArrowIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_transfer_Order_another_station")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label={t("lbl_transfer_order")}
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<TransferWithinAStationIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_generate_resale")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label={t("lbl_resale")}
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<StorefrontIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_generate_refund")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label={t("lbl_returns")}
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<ReplayIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_add_receipt")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label={t("lbl_add_receipt")}
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<ReceiptIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_manage_coupons")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label={t("lbl_coupons")}
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<RedeemIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_manage_discount_percentage")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label={t("lbl_discount_percentage")}
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<PercentIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_manage_amount_discount")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label={t("lbl_amount_discount")}
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<DiscountIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_bag_fee")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label= {t("lbl_bag_fee")}
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<ShoppingBagIcon />}
                  
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_bag_credit_management")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label={t("lbl_bag_credit")}
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<ShoppingBasketIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_bottle_refund_management")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label={t("lbl_bottle_refund")}
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<DeleteIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_tax_exemption_management")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label={t("lbl_tax_exempt")}
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<CreditCardIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_delete_tax_exception")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label={t("lbl_clear_exempt")}
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<CreditCardIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Tooltip explainer={t("msj_query_search_article")} side="top" withArrow>
              <Box sx={{ width: "100%" }}>
                <Button
                  label={t("lbl_item_inquiry")}
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<SearchIcon />}
                />
              </Box>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 12 }} container spacing={1} justifyContent="center">
            <Grid size={{ xs: 4 }}>
              <Box sx={{ width: "100%" }}>
                <Button
                  label=""
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<SettingsIcon />}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 4 }}>
              <Box sx={{ width: "100%" }}>
                <Button
                  label=""
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<AccountBalanceWalletIcon />}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 4 }}>
              <Box sx={{ width: "100%" }}>
                <Button
                  label=""
                  onClick={() => {}}
                  variant="primary"
                  className="full-size-button"
                  startIcon={<SearchIcon />}
                />
              </Box>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ width: "100%" }}>
              <Button
                label=""
                onClick={() => {}}
                variant="warning"
                className="full-size-button"
                startIcon={<LockIcon />}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ButtonPanel
