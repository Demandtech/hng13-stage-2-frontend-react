"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import WaveBackground from "@/components/waveBackground";
import DecorativeCircle from "@/components/decorativeCircle";

import { Ticket, CheckCircle, Clock, AlertCircle } from "@/components/icons";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Index = () => {
  const router = useRouter();

  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
  };

  const cardContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
        <DecorativeCircle
          size="lg"
          position="top-right"
          color="secondary"
          opacity={1}
        />
        <DecorativeCircle
          size="md"
          position="bottom-left"
          color="secondary"
          opacity={1}
        />

        <div className="mx-auto max-w-[1440px] px-4 py-24 md:py-32 md:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-b from-white to-muted-foreground bg-clip-text text-transparent"
              initial="hidden"
              animate="visible"
              variants={headingVariants}
            >
              Manage Your Tickets Like a Pro
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl mb-8 text-primary-foreground/90"
              initial="hidden"
              animate="visible"
              variants={paragraphVariants}
            >
              Simple, powerful, and efficient ticket management system. Create,
              track, and resolve tickets with ease.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="solid"
                size="lg"
                onPress={() => router.push("/auth/signup")}
                className="text-lg"
                color="primary"
              >
                Get Started
              </Button>
              <Button
                variant="bordered"
                size="lg"
                onClick={() => router.push("/auth/login")}
                className="text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-2"
              >
                Login
              </Button>
            </div>
          </div>
        </div>

        <WaveBackground />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Ticket Manager?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage tickets efficiently in one place
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={cardContainer}
          >
            <motion.div variants={cardVariants}>
              <Card className="relative overflow-hidden shadow-none transition-all duration-300 border-2 border-border">
                <CardHeader className="flex-col items-start">
                  <div className="w-12 h-12 rounded-lg bg-status-open-bg border-2 border-status-open-border flex items-center justify-center mb-4">
                    <Ticket className="w-6 h-6 text-status-open" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Easy Ticket Creation
                    </h3>
                    <p className="text-muted-foreground">
                      Create and organize tickets in seconds with our intuitive
                      interface
                    </p>
                  </div>
                </CardHeader>
                <CardBody className="overflow-hidden">
                  <DecorativeCircle
                    size="sm"
                    position="center"
                    color="accent"
                    opacity={0.8}
                  />
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-status-open mt-0.5 flex-shrink-0" />
                      <span>Quick ticket creation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-status-open mt-0.5 flex-shrink-0" />
                      <span>Custom fields and priorities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-status-open mt-0.5 flex-shrink-0" />
                      <span>Rich text descriptions</span>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="relative overflow-hidden shadow-none border-2 border-border">
                <CardHeader className="items-start flex-col">
                  <div className="w-12 h-12 rounded-lg bg-status-progress-bg border-2 border-status-progress-border flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-status-progress" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Real-Time Tracking
                    </h3>
                    <p className="text-muted-foreground">
                      Track ticket status and progress in real-time with live
                      updates
                    </p>
                  </div>
                </CardHeader>
                <CardBody className="overflow-hidden">
                  <DecorativeCircle
                    size="sm"
                    position="center"
                    color="accent"
                    opacity={0.8}
                  />
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-status-progress mt-0.5 flex-shrink-0" />
                      <span>Live status updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-status-progress mt-0.5 flex-shrink-0" />
                      <span>Progress indicators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-status-progress mt-0.5 flex-shrink-0" />
                      <span>Activity timeline</span>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="relative overflow-hidden shadow-none border-2 border-border">
                <CardHeader className="flex-col items-start">
                  <div className="w-12 h-12 rounded-lg bg-accent border-2 border-accent-foreground/20 flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">Smart Analytics</h3>
                  <p className="text-muted-foreground">
                    Get insights with comprehensive dashboards and reports
                  </p>
                </CardHeader>
                <CardBody className="overflow-hidden">
                  <DecorativeCircle
                    size="sm"
                    position="center"
                    color="accent"
                    opacity={0.8}
                  />
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                      <span>Visual dashboards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                      <span>Performance metrics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                      <span>Custom reports</span>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-accent/30 w-full ">
        <div className="mx-auto px-4 md:px-8 max-w-[1440px]">
          <Card className="shadow-none border-2 overflow-hidden border-border">
            <CardBody className="p-8 md:p-12 text-center relative overflow-hidden">
              <DecorativeCircle
                size="sm"
                position="top-left"
                color="primary"
                opacity={0.9}
              />
              <DecorativeCircle
                size="sm"
                position="bottom-right"
                color="accent"
                opacity={0.8}
              />

              <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto relative z-10">
                Join thousands of teams already using Ticket Manager to
                streamline their workflow
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Button
                  variant="solid"
                  color="primary"
                  size="md"
                  onPress={() => router.push("/auth/signup")}
                >
                  Create Free Account
                </Button>
                <Button
                  variant="bordered"
                  size="md"
                  onPress={() => router.push("/auth/login")}
                >
                  Sign In
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
