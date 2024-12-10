/* Animations */
import { motion, useAnimate } from "framer-motion";

/* Hooks */
import { useEffect } from "react";

export const AccessLoading = () => {
  const text = "● ● ● L O U D R E ● ● ●";
  const characters = text.split("");

  const fontSize = "18px";
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const animateLoader = async () => {
      const letterAnimation = [];
      characters.forEach((_, i) => {
        letterAnimation.push([
          `.letter-${i}`,
          { opacity: 1 },
          { duration: 0.3, at: i === 0 ? "+0.8" : "-0.28" },
        ]);
      });
      characters.forEach((_, i) => {
        letterAnimation.push([
          `.letter-${i}`,
          { opacity: 0 },
          { duration: 0.3, at: i === 0 ? "+0.8" : "-0.28" },
        ]);
      });
      animate(letterAnimation, {
        ease: "linear",
        repeat: Infinity,
      });
    };
    animateLoader();
  }, []);

  return (
    <motion.div ref={scope}>
      <p aria-label={text} />
      <p aria-hidden="true">
        {characters.map((ch, i) => (
          <motion.span
            key={i}
            className={`letter letter-${i}`}
            style={{
              fontSize,
              opacity: 0, // Ocultar inicialmente
            }}
          >
            {ch}
          </motion.span>
        ))}
      </p>
    </motion.div>
  );
};
