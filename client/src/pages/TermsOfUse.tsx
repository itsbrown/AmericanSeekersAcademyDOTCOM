import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsOfUse() {
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
              Terms of Use
            </h1>
            <p className="font-inter text-white/80 text-lg max-w-2xl mx-auto">
              Please read these terms carefully before using the American Seekers Academy website.
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
                Acceptance of Terms
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed">
                By accessing or using the American Seekers Academy website (the "Site"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree with any part of these Terms, please discontinue use of the Site immediately. These Terms apply to all visitors, users, and others who access or use the Site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Permitted Use
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-3">
                You may use the Site for lawful, personal, and non-commercial purposes only. By using the Site, you agree that you will not:
              </p>
              <ul className="font-inter text-muted-foreground space-y-2 list-disc list-inside">
                <li>Use the Site in any way that violates applicable local, state, national, or international laws or regulations</li>
                <li>Transmit any unsolicited or unauthorized advertising, promotional materials, or spam</li>
                <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity</li>
                <li>Interfere with or disrupt the integrity or performance of the Site or its related systems</li>
                <li>Attempt to gain unauthorized access to any part of the Site or its related infrastructure</li>
                <li>Harvest, collect, or store personal information about other users without their consent</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Intellectual Property
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-3">
                All content on the Site — including but not limited to text, graphics, logos, images, audio clips, and software — is the property of American Seekers Academy or its content suppliers and is protected by applicable copyright, trademark, and other intellectual property laws.
              </p>
              <p className="font-inter text-muted-foreground leading-relaxed">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content from the Site without our prior written permission. Personal, non-commercial viewing and sharing of publicly accessible content is permitted provided all copyright and proprietary notices are retained.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Disclaimers
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-3">
                The Site and all content, materials, and information provided on it are offered on an "as is" and "as available" basis without warranties of any kind, either express or implied. American Seekers Academy makes no representations or warranties regarding the accuracy, completeness, or suitability of any information on the Site.
              </p>
              <p className="font-inter text-muted-foreground leading-relaxed">
                We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components. Program descriptions, schedules, tuition details, and location information are subject to change without notice and should be confirmed directly with us before enrollment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Limitation of Liability
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-3">
                To the fullest extent permitted by applicable law, American Seekers Academy and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including but not limited to loss of data, loss of revenue, or loss of goodwill — arising out of or in connection with your access to or use of the Site.
              </p>
              <p className="font-inter text-muted-foreground leading-relaxed">
                In no event shall our total aggregate liability to you for all claims arising from or related to the Site exceed one hundred U.S. dollars ($100.00), regardless of the theory of liability or the form of action.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Third-Party Links
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed">
                The Site may contain links to third-party websites or resources. These links are provided for your convenience only. American Seekers Academy has no control over the content, privacy practices, or policies of those sites and accepts no responsibility for them. Accessing any third-party website linked from our Site is at your own risk.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Governing Law
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed">
                These Terms and any dispute arising out of or related to your use of the Site shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be brought exclusively in the courts located in Monroe County, New York, and you hereby consent to personal jurisdiction and venue in those courts.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Changes to These Terms
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed">
                We reserve the right to update or modify these Terms at any time. When we do, we will revise the effective date shown below. Your continued use of the Site after any changes constitutes your acceptance of the updated Terms. We encourage you to review these Terms periodically.
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
                If you have questions or concerns about these Terms of Use, please contact us:
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
