import CheckoutScreen from "@app/selfcheckout/CheckoutScreen"
import LoyaltyProgramScreen from "@app/selfcheckout/LoyaltyProgramScreen"
import PreCheckoutScreen from "@app/selfcheckout/PreCheckoutScreen"
import React from "react"

const HomeAfterLogin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <LoyaltyProgramScreen />
    </div>
  )
}

export default HomeAfterLogin
