import { motion } from "framer-motion";
import { pageTransition } from "../animations";
import ChatBox from "../components/ChatBox";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Chat() {
  return (
    <motion.div {...pageTransition} className="flex-1 p-4 relative">
      <AnimatedBackground />
      <ChatBox />
    </motion.div>
  );
}
