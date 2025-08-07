/* eslint-disable react/no-unescaped-entities */
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  render,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderConfirmationEmailProps {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  shippingAddress: {
    homeAddress: string;
    zip: string;
  };
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  shippingCost: number;
  total: number;
}

export const OrderConfirmationEmail = ({
  orderNumber,
  orderDate,
  customerName,
  shippingAddress,
  items,
  subtotal,
  discountAmount,
  shippingCost,
  total,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Thank You for Your Order #{orderNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header Section */}
        <Section style={headerSection}>
          <Img
            src="https://one-market-phil.s3.us-east-1.amazonaws.com/logo.png"
            width="40"
            height="40"
            alt="1 Market Philippines Logo"
            style={logo}
          />
          <Text style={headerText}>1 Market Philippines</Text>

          <Text style={thankYouText}>Thank You for Order</Text>

          <Text style={orderStatusText}>
            Thank you for your order. We're getting it ready for shipment and
            will keep you updated once it's dispatched.
          </Text>

          <Link href="#track" style={trackButton}>
            Track Your Order
          </Link>

          <Text style={smallText}>
            Please allow 24 hours to track your order.
          </Text>
        </Section>

        {/* Order Summary & Shipping Address in a more compact layout */}
        <Section style={infoBoxesContainer}>
          <div style={infoBoxLeft}>
            <Text style={infoBoxTitle}>Summary</Text>
            <Text style={infoBoxContent}>
              Order Place
              <br />#{orderNumber}
              <br />
              {orderDate}
              <br />₱{total.toFixed(2)}
            </Text>
          </div>

          <div style={infoBoxRight}>
            <Text style={infoBoxTitle}>Shipping Address</Text>
            <Text style={infoBoxContent}>
              {customerName}
              <br />
              {shippingAddress.homeAddress}
              <br />
              Philippines, {shippingAddress.zip}
            </Text>
          </div>
        </Section>

        {/* Simple divider replacing zigzag */}
        <div style={simpleDivider}></div>

        {/* Order Items Section - More compact */}
        <Section style={orderItemsSection}>
          <Text style={orderItemsTitle}>Your item in this order</Text>
          <Text style={orderNumberText}>Order number: #{orderNumber}</Text>

          {items.map((item, index) => (
            <div key={index} style={orderItemContainer}>
              <div style={itemImagePlaceholder}>
                <Img
                  src={item.image}
                  width="60"
                  height="60"
                  alt={item.name}
                  style={{ borderRadius: "5px" }}
                />
              </div>
              <div style={itemDetails}>
                <Text style={itemName}>{item.name}</Text>
                <Text style={itemDescription}>x{item.quantity}</Text>
                <Text style={itemPrice}>₱{item.price.toFixed(2)}</Text>
              </div>
            </div>
          ))}

          {/* Order Summary - Improved spacing and alignment */}
          <div style={summaryContainer}>
            <div style={summaryRow}>
              <Text style={summaryLabel}>Subtotal</Text>
              <Text style={summaryValue}>₱{subtotal.toFixed(2)}</Text>
            </div>

            <div style={summaryRow}>
              <Text style={summaryLabel}>Discount</Text>
              <Text style={discountAmount ? discountValue : summaryValue}>
                {discountAmount ? `-₱${discountAmount.toFixed(2)}` : "₱ 0.00"}
              </Text>
            </div>

            <div style={summaryRow}>
              <Text style={summaryLabel}>Standard Delivery</Text>
              <Text style={summaryValue}>₱{shippingCost.toFixed(2)}</Text>
            </div>

            <div style={totalRow}>
              <Text style={totalLabel}>Total:</Text>
              <Text style={totalValue}>₱{total.toFixed(2)}</Text>
            </div>
          </div>
        </Section>

        {/* Business Section - More compact */}
        <Section style={businessSection}>
          <Text style={businessTitle}>Want to talk business with us?</Text>
          <Text style={businessText}>
            Feel free to reach out to us at{" "}
            <Link
              href="mailto:onemarketphilippines2025@gmail.com"
              style={emailLink}
            >
              onemarketphilippines2025@gmail.com
            </Link>
            <br />
            We open opportunities for all forms of business collaboration
          </Text>
        </Section>

        {/* Simple footer divider */}
        <div style={footerDivider}></div>
      </Container>
    </Body>
  </Html>
);

export const OrderConfirmationEmailHTML = (
  props: OrderConfirmationEmailProps
) =>
  render(<OrderConfirmationEmail {...props} />, {
    pretty: true,
  });

// Styles
const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  color: "#212121",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "0",
};

const headerSection = {
  backgroundColor: "#f9f5eb",
  color: "#111",
  padding: "25px 20px",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
  display: "block",
};

const headerText = {
  fontSize: "22px",
  fontWeight: "bold" as const,
  margin: "5px 0 15px",
  color: "#800020",
};

const thankYouText = {
  fontSize: "28px",
  fontWeight: "bold" as const,
  margin: "15px 0",
  color: "#111",
};

const orderStatusText = {
  fontSize: "16px",
  lineHeight: "24px",
  margin: "15px 0",
  color: "#111",
};

const trackButton = {
  backgroundColor: "#f0be4d",
  borderRadius: "30px",
  color: "#800020",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold" as const,
  padding: "12px 30px",
  textDecoration: "none",
  margin: "15px 0",
};

const smallText = {
  fontSize: "14px",
  color: "#111",
  margin: "10px 0",
};

const infoBoxesContainer = {
  display: "flex",
  flexDirection: "row" as const,
  margin: "0",
  backgroundColor: "#f9f5eb",
  padding: "0 20px 15px",
};

const infoBoxLeft = {
  width: "50%",
  padding: "12px",
  boxSizing: "border-box" as const,
};

const infoBoxRight = {
  width: "50%",
  padding: "12px",
  boxSizing: "border-box" as const,
};

const infoBoxTitle = {
  fontSize: "16px",
  fontWeight: "bold" as const,
  color: "#f0be4d",
  margin: "0 0 8px",
};

const infoBoxContent = {
  fontSize: "14px",
  color: "#111",
  lineHeight: "22px",
};

// Simple divider instead of zigzag
const simpleDivider = {
  height: "6px",
  backgroundColor: "#f0be4d",
};

const orderItemsSection = {
  backgroundColor: "#fff",
  padding: "25px 20px",
};

const orderItemsTitle = {
  fontSize: "22px",
  fontWeight: "bold" as const,
  margin: "0 0 5px",
  textAlign: "center" as const,
};

const orderNumberText = {
  fontSize: "14px",
  color: "#666",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const orderItemContainer = {
  display: "flex",
  margin: "15px 0",
  padding: "10px",
  backgroundColor: "#f9f5eb",
  borderRadius: "10px",
};

const itemImagePlaceholder = {
  width: "60px",
  height: "60px",
  backgroundColor: "#eee",
  borderRadius: "5px",
};

const itemDetails = {
  marginLeft: "15px",
  flex: "1",
};

const itemName = {
  fontSize: "16px",
  fontWeight: "bold" as const,
  margin: "0 0 5px",
};

const itemDescription = {
  fontSize: "14px",
  color: "#666",
  margin: "0 0 5px",
};

const itemPrice = {
  fontSize: "16px",
  fontWeight: "bold" as const,
  color: "#800020",
  margin: "0",
};

const summaryContainer = {
  margin: "10px 0 0",
  borderTop: "1px solid #eee",
  paddingTop: "10px",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between" as const,
  alignItems: "center" as const,
  margin: "8px 0",
};

const summaryLabel = {
  fontSize: "14px",
  color: "#666",
  width: "50%" as const,
  textAlign: "left" as const,
};

const summaryValue = {
  fontSize: "14px",
  fontWeight: "bold" as const,
  width: "50%" as const,
  textAlign: "right" as const,
};

const discountValue = {
  fontSize: "14px",
  fontWeight: "bold" as const,
  color: "#4caf50",
  width: "50%" as const,
  textAlign: "right" as const,
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between" as const,
  alignItems: "center" as const,
  margin: "15px 0 0",
  paddingTop: "10px",
  borderTop: "1px solid #eee",
};

const totalLabel = {
  fontSize: "16px",
  fontWeight: "bold" as const,
  width: "50%" as const,
  textAlign: "left" as const,
};

const totalValue = {
  fontSize: "18px",
  fontWeight: "bold" as const,
  width: "50%" as const,
  textAlign: "right" as const,
  color: "#800020",
};

const businessSection = {
  padding: "20px",
  backgroundColor: "#f9f5eb",
  margin: "15px 0",
  borderRadius: "10px",
};

const businessTitle = {
  fontSize: "18px",
  fontWeight: "bold" as const,
  margin: "0 0 10px",
};

const businessText = {
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
};

const emailLink = {
  color: "#800020",
  fontWeight: "bold" as const,
  textDecoration: "none",
};

// Simple footer divider
const footerDivider = {
  height: "6px",
  backgroundColor: "#b85f5f",
};
