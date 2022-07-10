import React, { useLayoutEffect, useRef, useState } from "react";
import styles from "./SVGParticlesGenWrapper.module.css";

const getRandomColor = () => {
  const val = Math.random();

  if (val < 0.2) {
    return "#F8A438";
  }

  if (val < 0.4) {
    return "#EAE452";
  }

  if (val < 0.6) {
    return "#8E254E";
  }

  return "#6AAB99";
};

const SVGParticlesGenWrapper = ({ SVGComponent }) => {
  const [isHover, setIsHover] = useState(false);
  const svgEl = useRef(null);

  useLayoutEffect(() => {
    let anim = false;
    if (isHover && svgEl.current !== null) {
      const svg = svgEl.current,
        NS = svg.getAttribute("xmlns"),
        paths = svg.querySelectorAll("path"),
        particles = [],
        particlesAmout = 100,
        particleMoveDist = 3;

      anim = true;

      paths.forEach((path) => {
        path.setAttribute("opacity", 0);
        const pathLength = Math.floor(path.getTotalLength());

        for (let i = 0; i < particlesAmout; i++) {
          const percent = (i * pathLength) / particlesAmout;
          const point = path.getPointAtLength(percent);

          const cX = Math.round(point.x),
            cY = Math.round(point.y),
            circle = document.createElementNS(NS, "circle"),
            color = getRandomColor();

          circle.setAttribute("cx", cX);
          circle.setAttribute("cy", cY);
          circle.setAttribute("data:cx", cX);
          circle.setAttribute("data:cy", cY);
          circle.setAttribute("fill", color);
          circle.setAttribute("stroke", color);
          circle.setAttribute("r", 1);

          svg.appendChild(circle);

          particles.push(circle);
        }
      });

      const update = () => {
        window.requestAnimationFrame(() => {
          particles.forEach((particle) => {
            const cY = particle.getAttribute("data:cy");
            const cX = particle.getAttribute("data:cx");
            const xMod =
              Math.random() * particleMoveDist - particleMoveDist / 2;
            const yMod =
              Math.random() * particleMoveDist - particleMoveDist / 2;

            particle.setAttribute("cx", parseInt(cX) + xMod);
            particle.setAttribute("cy", parseInt(cY) + yMod);
          });

          if (anim) {
            update();
          }
        });
      };

      update();

      return () => {
        anim = false;
        particles.forEach((particle) => {
          svg.removeChild(particle);
        });
        paths.forEach((path) => {
          path.setAttribute("opacity", 1);
        });
      };
    }
  }, [isHover]);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={styles.wrapper}
    >
      <SVGComponent ref={svgEl} />
    </div>
  );
};

export default SVGParticlesGenWrapper;
