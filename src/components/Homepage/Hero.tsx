import React, { type ReactNode } from "react";
import { Button } from "react-infima";
import Link from "@docusaurus/Link";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import "@site/src/css/slick.css";
import "@site/src/css/slick-theme.css";

const LogoSlider = ({ children }: { children: ReactNode[] }) => {
  const settings: Settings = {
    className: "center",
    centerMode: true,
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 5000,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnFocus: false,
    pauseOnHover: false,
    variableWidth: true,
  };

  return <Slider {...settings}>{children}</Slider>;
};

export default function Hero() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
      <h1 className="mx-auto max-w-4xl font-display text-4xl font-medium tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
        A blazing fast & ready to use{" "}
        <span className="relative whitespace-nowrap text-primary">
          <svg
            aria-hidden="true"
            viewBox="0 0 418 42"
            className="absolute top-2/3 left-0 h-[0.58em] w-full fill-primary-50/60"
            preserveAspectRatio="none"
          >
            <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
          </svg>
          <span className="relative">Headless PWA Frontend</span>
        </span>{" "}
        solution
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700 dark:text-slate-300">
        Keeping. Change. Simple.
      </p>
      <div className="mt-10 flex justify-center gap-x-6 group">
        <Link to={`/docs/${siteConfig.customFields.LAST_VERSION}/welcome`}>
          <Button theme="primary" className="py-2 sm:py-4">
            Get Started &nbsp;&nbsp;→
          </Button>
        </Link>
      </div>
      <div className="mt-24 md:mt-36 lg:mt-44">
        <p className="font-display text-base text-slate-900 dark:text-slate-100">
          Trusted by these companies
        </p>
        <div className="mt-8">
          <LogoSlider>
            {[
              { name: "AIMS Interactive", logo: "/img/logos/aims.png" },
              { name: "Antadis", logo: "/img/logos/antadis.png" },
              { name: "Clever Age", logo: "/img/logos/cleverage.png" },
              { name: "Diglin", logo: "/img/logos/diglin.png" },
              { name: "Emakina", logo: "/img/logos/emakina.png" },
              { name: "Occitech", logo: "/img/logos/occitech.png" },
              { name: "PH2M", logo: "/img/logos/ph2m.png" },
              { name: "Smile", logo: "/img/logos/smile.png" },
              { name: "WEBQAM", logo: "/img/logos/webqam.png" },
              { name: "TBD Group", logo: "/img/logos/tbd.svg" },
              { name: "Zento", logo: "/img/logos/zento.png" },
            ].map((company) => (
              <div key={company.name} className="px-10 text-center">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="invert dark:invert-0 mx-auto h-[50px] w-auto"
                  style={{
                    filter: "var(--tw-invert)", // fixes FC-1211
                  }}
                />
              </div>
            ))}
          </LogoSlider>
        </div>
      </div>
    </div>
  );
}
