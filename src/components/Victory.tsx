import Lottie from "react-lottie";
import congratsData from "../assets/congrats.json";

const congratsOptions = {
  loop: false,
  autoplay: true,
  animationData: congratsData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Victory = () => (
  <div className="victory">
    <Lottie options={congratsOptions} height={300} width={300} />
    <h1 className="title">The bomb has been defused! Congratulations!</h1>
    <p className="text-victory">Well done, you are safe...</p>
    <p className="text-victory"> ...for now...</p>
  </div>
);

export default Victory;
