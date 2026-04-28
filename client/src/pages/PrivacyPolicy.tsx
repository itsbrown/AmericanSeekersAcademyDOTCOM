import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <div className="navy-gradient text-white py-16 md:py-24">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="font-inter text-white/80 text-lg max-w-2xl mx-auto">
              How American Seekers Academy collects, uses, and protects your personal information.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="section-divider mt-0 mb-0" />

      <div className="container-custom py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Overview
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed">
                American Seekers Academy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or interact with our programs. Please read this policy carefully. If you disagree with its terms, please discontinue use of our site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Information We Collect
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-3">
                We may collect the following types of information when you interact with us:
              </p>
              <ul className="font-inter text-muted-foreground space-y-2 list-disc list-inside">
                <li><span className="font-medium text-foreground">Contact information</span> — name, email address, and phone number submitted through our contact or enrollment forms</li>
                <li><span className="font-medium text-foreground">Program interest</span> — the programs, age groups, or locations you express interest in</li>
                <li><span className="font-medium text-foreground">Communications</span> — messages, inquiries, or feedback you send to us</li>
                <li><span className="font-medium text-foreground">Usage data</span> — pages visited, time spent on the site, and referring URLs collected automatically through cookies and analytics tools</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                How We Use Your Information
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="font-inter text-muted-foreground space-y-2 list-disc list-inside">
                <li>Respond to your inquiries and provide program information</li>
                <li>Send enrollment updates, event reminders, and academy announcements</li>
                <li>Send SMS text messages if you have provided your phone number and consented to receive them (see our <a href="/sms-policy" className="text-accent underline hover:opacity-80 transition-opacity">SMS Policy</a>)</li>
                <li>Improve our website and better understand how visitors engage with our content</li>
                <li>Comply with applicable laws and regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Third-Party Sharing
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-3">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following limited circumstances:
              </p>
              <ul className="font-inter text-muted-foreground space-y-2 list-disc list-inside">
                <li><span className="font-medium text-foreground">Service providers</span> — trusted vendors who assist us in operating our website, sending communications, or administering our programs, under strict confidentiality agreements</li>
                <li><span className="font-medium text-foreground">Legal obligations</span> — when required by law, court order, or government authority</li>
                <li><span className="font-medium text-foreground">Safety</span> — to protect the rights, property, or safety of American Seekers Academy, our students, or the public</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Cookies &amp; Analytics
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-3">
                Our website uses cookies and similar tracking technologies to enhance your browsing experience and understand site usage. We may use analytics tools (such as Google Analytics) that collect anonymized usage data. You can control cookie preferences through your browser settings; however, disabling cookies may affect certain site functionality.
              </p>
              <p className="font-inter text-muted-foreground leading-relaxed">
                We do not use cookies to serve targeted advertising.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Data Retention &amp; Security
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed">
                We retain your personal information only as long as necessary to fulfill the purposes described in this policy or as required by law. We implement reasonable administrative, technical, and physical safeguards to protect your information from unauthorized access, loss, or misuse. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Your Rights
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-3">
                Depending on your location, you may have the right to:
              </p>
              <ul className="font-inter text-muted-foreground space-y-2 list-disc list-inside">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate or incomplete data</li>
                <li>Request deletion of your personal information, subject to legal obligations</li>
                <li>Opt out of SMS communications at any time by replying STOP to any message</li>
                <li>Opt out of email communications by using the unsubscribe link included in our emails</li>
              </ul>
              <p className="font-inter text-muted-foreground leading-relaxed mt-3">
                To exercise any of these rights, please contact us using the information below.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Children's Privacy
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed">
                Our programs serve children, but our website and data collection are directed at parents and guardians. We do not knowingly collect personal information directly from children under the age of 13. If you believe we have inadvertently collected such information, please contact us and we will promptly delete it.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Changes to This Policy
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. When we do, we will revise the effective date at the top of this page. We encourage you to review this policy periodically to stay informed about how we are protecting your information. Your continued use of our site after any changes constitutes your acceptance of the updated policy.
              </p>
              <p className="font-inter text-muted-foreground leading-relaxed mt-3">
                <span className="font-medium text-foreground">Effective Date:</span> April 28, 2026
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Contact Us
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:
              </p>
              <div className="font-inter space-y-2">
                <p>
                  <span className="font-medium text-foreground">Email: </span>
                  <a
                    href="mailto:contact@americanseekersacademy.com"
                    className="text-accent underline hover:opacity-80 transition-opacity"
                  >
                    contact@americanseekersacademy.com
                  </a>
                </p>
                <p>
                  <span className="font-medium text-foreground">Phone: </span>
                  <a
                    href="tel:+15852102021"
                    className="text-accent underline hover:opacity-80 transition-opacity"
                  >
                    (585) 210-2021
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
