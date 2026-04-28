import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function SmsPolicy() {
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
              SMS Messaging Policy
            </h1>
            <p className="font-inter text-white/80 text-lg max-w-2xl mx-auto">
              How we use text messaging to keep you informed about our programs and enrollment.
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
                Program &amp; Consent Description
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed">
                By providing your phone number on the American Seekers Academy contact form, you consent to receive SMS text messages from American Seekers Academy. These messages are sent to help you stay informed about our educational programs, enrollment opportunities, and important academy updates.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Types of Messages
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-3">
                You may receive SMS messages from us regarding:
              </p>
              <ul className="font-inter text-muted-foreground space-y-2 list-disc list-inside">
                <li>Program updates and announcements</li>
                <li>Enrollment information and application status</li>
                <li>Event and session reminders</li>
                <li>Responses to inquiries you have submitted</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Message Frequency
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed">
                Message frequency varies depending on your level of interaction and enrollment status. You may receive occasional messages related to your inquiry or program participation. We will not send unsolicited marketing messages in bulk.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Message &amp; Data Rates
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed">
                Message and data rates may apply. The cost of receiving and sending SMS messages is determined by your mobile carrier and plan. American Seekers Academy does not charge any fees for participating in our SMS program.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                How to Opt Out
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-3">
                You may opt out of receiving SMS messages from American Seekers Academy at any time by replying with any of the following keywords:
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {["STOP", "CANCEL", "QUIT", "END", "UNSUBSCRIBE"].map((kw) => (
                  <span
                    key={kw}
                    className="font-inter font-semibold text-sm px-3 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <p className="font-inter text-muted-foreground leading-relaxed">
                After opting out, you will receive a one-time confirmation message and will no longer receive SMS messages from us unless you re-enroll.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                How to Get Help
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-3">
                If you need assistance with our SMS messaging program, reply with any of the following keywords:
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {["HELP", "INFO"].map((kw) => (
                  <span
                    key={kw}
                    className="font-inter font-semibold text-sm px-3 py-1 rounded-full bg-accent/10 text-accent"
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <p className="font-inter text-muted-foreground leading-relaxed">
                We will respond with information about the program and how to reach our support team.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-3">
                Contact &amp; Support
              </h2>
              <p className="font-inter text-muted-foreground leading-relaxed mb-4">
                If you have any questions about this SMS policy or need support, please reach out to us directly:
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
