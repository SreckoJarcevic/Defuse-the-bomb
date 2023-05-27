import Lottie from "react-lottie";
import explosionData from "../assets/explosion.json";

const explosionOptions = {
  loop: false,
  autoplay: true,
  animationData: explosionData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Explosion = () => (
  <span className="explosion">
    <Lottie options={explosionOptions} height={600} width={600} />
    <p>Time has run out, you must improve your skills...</p>
  </span>
);

export default Explosion;
