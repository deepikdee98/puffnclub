import { motion } from "framer-motion";

// Fade Up Animation
export const FadeUpOnScroll = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.9 }}
  >
    {children}
  </motion.div>
);

// Fade Down Animation
export const FadeDownOnScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.9 }}
  >
    {children}
  </motion.div>
);

// Fade Left Animation
export const FadeLeftOnScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.9 }}
  >
    {children}
  </motion.div>
);

// Fade Right Animation
export const FadeRightOnScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.9 }}
  >
    {children}
  </motion.div>
);

// Zoom In Animation
export const ZoomInOnScroll = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.9 }}
  >
    {children}
  </motion.div>
);

// Zoom Out Animation
export const ZoomOutOnScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 1.3 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.9 }}
  >
    {children}
  </motion.div>
);

// Flip X Animation
export const FlipXOnScroll = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, rotateX: 90 }}
    whileInView={{ opacity: 1, rotateX: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.9 }}
    style={{ transformStyle: "preserve-3d" }}
  >
    {children}
  </motion.div>
);

// Flip Y Animation
export const FlipYOnScroll = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, rotateY: 90 }}
    whileInView={{ opacity: 1, rotateY: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.9 }}
    style={{ transformStyle: "preserve-3d" }}
  >
    {children}
  </motion.div>
);

// Slide Up Animation
export const SlideUpOnScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ y: 80, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Slide Down Animation
export const SlideDownOnScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ y: -80, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Slide Left Animation
export const SlideLeftOnScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ x: -80, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Slide Right Animation
export const SlideRightOnScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ x: 80, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Rotate Animation
export const RotateOnScroll = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ rotate: 90, opacity: 0 }}
    whileInView={{ rotate: 0, opacity: 1 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Bounce Animation
export const BounceOnScroll = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: [0, -20, 0], opacity: 1 }}
    transition={{ repeat: Infinity, duration: 1.5 }}
  >
    {children}
  </motion.div>
);
