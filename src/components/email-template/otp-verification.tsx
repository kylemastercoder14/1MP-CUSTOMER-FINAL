/* eslint-disable react/no-unescaped-entities */
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  render,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OtpVerificationProps {
  otpCode: string;
  userEmail: string;
}

export const OtpVerification = ({
  otpCode,
  userEmail
}: OtpVerificationProps) => (
  <Html>
	<Head />
	<Preview>Verify your email address - Your OTP code expires in 10 minutes</Preview>
	<Body style={main}>
	  <Container style={container}>
		<Section style={coverSection}>
		  {/* Header Section */}
		  <Section style={headerSection}>
			<Img
			  src="https://utqpspeicywesqihyelg.supabase.co/storage/v1/object/public/assets//logo_maroon_transparent.png"
			  width="80"
			  height="80"
			  alt={`1 Market Philippines Logo`}
			  style={logo}
			/>
			<Heading style={h1}>Verify Your Email Address</Heading>
			<Text style={greetingText}>Hello, {userEmail},</Text>
		  </Section>

		  {/* OTP Section */}
		  <Section style={otpSection}>
			<Text style={otpLabel}>Your Verification Code</Text>
			<Section style={otpContainer}>
			  <Text style={otpCodeStyle}>{otpCode}</Text>
			</Section>

			{/* Validity Warning */}
			<Section style={validitySection}>
			  <Text style={validityText}>
				⏰ This code expires in <strong>10 minutes</strong>
			  </Text>
			</Section>
		  </Section>

		  {/* Content Section */}
		  <Section style={contentSection}>
			<Text style={paragraph}>
			  Thank you for starting your 1 Market Philippines account creation process.
			  We need to verify that this email address belongs to you.
			</Text>
			<Text style={paragraph}>
			  Please enter the verification code above when prompted. If you didn't
			  request this verification, you can safely ignore this email.
			</Text>
		  </Section>

		  {/* Signature */}
		  <Section style={signatureSection}>
			<Text style={signatureText}>
			  Best regards,<br />
			  The 1 Market Philippines Team
			</Text>
		  </Section>

		  <Hr style={divider} />

		  {/* Security Notice */}
		  <Section style={securitySection}>
			<Text style={securityTitle}>🔒 Security Notice</Text>
			<Text style={securityText}>
			  1 Market Philippines will never ask you to disclose or verify your password,
			  credit card, or banking information via email. If you have concerns
			  about this email, please contact us at{" "}
			  <Link href={`mailto:support@onemarketphilippines.com`} style={link}>
				support@onemarketphilippines.com
			  </Link>
			</Text>
		  </Section>
		</Section>

		{/* Footer */}
		<Section style={footerSection}>
		  <Text style={footerText}>
			This message was sent by 1 Market Philippines. © 2025 All rights reserved.
			<br />
			1 Market Philippines is a registered trademark of{" "}
			<Link href="https://one-market-philippines-production.vercel.app" target="_blank" style={link}>
			  onemarketphilippines.com
			</Link>
		  </Text>
		  <Text style={footerText}>
			<Link href="https://one-market-philippines-production.vercel.app/privacy-policy" target="_blank" style={link}>
			  Privacy Policy
			</Link>
			{" • "}
			<Link href={`https://one-market-philippines-production.vercel.app/terms`} target="_blank" style={link}>
			  Terms of Service
			</Link>
			{" • "}
			<Link href={`mailto:support@onemarketphilippines.com`} style={link}>
			  Contact Support
			</Link>
		  </Text>
		  {userEmail && (
			<Text style={footerText}>
			  This email was sent to {userEmail}
			</Text>
		  )}
		</Section>
	  </Container>
	</Body>
  </Html>
);

export const OtpVerificationHTML = (props: OtpVerificationProps) =>
  render(<OtpVerification {...props} />, {
	pretty: true,
  });

// Enhanced Styles
const main = {
  backgroundColor: "#f8fafc",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
};

const coverSection = {
  backgroundColor: "#ffffff",
};

const headerSection = {
  backgroundColor: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
  padding: "40px 32px",
  textAlign: "center" as const,
};

const logo = {
  display: "block",
  margin: "0 auto 24px auto",
  borderRadius: "12px",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  padding: "12px",
};

const h1 = {
  color: "#111",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 8px 0",
  textAlign: "center" as const,
};

const greetingText = {
  color: "#111",
  fontSize: "16px",
  margin: "0",
  textAlign: "center" as const,
};

const otpSection = {
  padding: "40px 32px",
  textAlign: "center" as const,
  backgroundColor: "#ffffff",
};

const otpLabel = {
  color: "#374151",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 16px 0",
  textAlign: "center" as const,
};

const otpContainer = {
  border: "2px dashed #800020",
  borderRadius: "12px",
  padding: "24px",
  margin: "0 auto 24px auto",
  maxWidth: "280px",
};

const otpCodeStyle = {
  color: "#800020",
  fontSize: "48px",
  fontWeight: "800",
  letterSpacing: "8px",
  margin: "0",
  textAlign: "center" as const,
};

const validitySection = {
  backgroundColor: "#fef3c7",
  border: "1px solid #f59e0b",
  borderRadius: "8px",
  padding: "12px 16px",
  margin: "0 auto",
  maxWidth: "320px",
};

const validityText = {
  color: "#92400e",
  fontSize: "14px",
  margin: "0",
  textAlign: "center" as const,
  fontWeight: "500",
};

const contentSection = {
  padding: "0 32px 32px 32px",
};

const paragraph = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px 0",
};

const signatureSection = {
  padding: "0 32px 32px 32px",
};

const signatureText = {
  color: "#374151",
  fontSize: "16px",
  margin: "0",
};

const divider = {
  border: "none",
  borderTop: "1px solid #e5e7eb",
  margin: "0 32px",
};

const securitySection = {
  backgroundColor: "#f0f9ff",
  padding: "24px 32px",
  margin: "32px 0 0 0",
};

const securityTitle = {
  color: "#0369a1",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px 0",
};

const securityText = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const footerSection = {
  backgroundColor: "#f8fafc",
  padding: "32px",
  borderTop: "1px solid #e5e7eb",
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "0 0 8px 0",
  textAlign: "center" as const,
};

const link = {
  color: "#800020",
  textDecoration: "underline",
  fontWeight: "500",
};
