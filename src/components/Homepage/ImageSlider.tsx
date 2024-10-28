import Slider from "react-slick";
import type { Settings } from "react-slick";
import "@site/src/css/slick-theme.css";
import "@site/src/css/slick.css";
import useBreakpoint from "use-breakpoint";
interface ImageSliderProps {
  images: { alt: string; src: string }[];
  settings?: Settings;
}

const BREAKPOINTS = { mobile: 0, tablet: 768, desktop: 1280 };

export const ImageSlider = (props: ImageSliderProps) => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, "tablet");

  const ROWS = props.settings?.rows ?? (breakpoint === "desktop" ? 2 : 1);
  const SPEED = ROWS * 10000;
  return (
    <Slider
      {...{
        className: "center",
        centerMode: true,
        dots: false,
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        speed: SPEED,
        autoplaySpeed: 0,
        cssEase: "linear",
        arrows: false,
        pauseOnFocus: false,
        pauseOnHover: false,
        variableWidth: true,
        rows: ROWS,
        slidesPerRow: ROWS,
        ...props.settings,
      }}
    >
      {props.images.map((company) => (
        <div key={company.alt} className="px-10 text-center">
          <img
            src={company.src}
            alt={company.alt}
            className="invert dark:invert-0 mx-auto h-[50px] w-auto object-contain pointer-events-none mb-2"
            style={{
              filter: "var(--tw-invert)", // fixes FC-1211
            }}
          />
        </div>
      ))}
    </Slider>
  );
};
