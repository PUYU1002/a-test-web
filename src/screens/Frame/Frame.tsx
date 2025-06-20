import React from "react";
import { Card, CardContent } from "../../components/ui/card";

export const Frame = (): JSX.Element => {
  // Define the vector images data for easier mapping
  const vectorImages = [
    {
      src: "/vector-4.svg",
      alt: "Vector",
      className: "absolute w-[159px] h-[91px] top-[527px] left-0",
    },
    {
      src: "/vector-2.svg",
      alt: "Vector",
      className: "absolute w-[82px] h-[649px] top-0 left-[139px]",
    },
    {
      src: "/vector-1.svg",
      alt: "Vector",
      className: "absolute w-[370px] h-[74px] top-[177px] left-0",
    },
    {
      src: "/ellipse-1.svg",
      alt: "Ellipse",
      className: "absolute w-[254px] h-[259px] top-11 left-[62px]",
    },
    {
      src: "/vector-5.svg",
      alt: "Vector",
      className: "absolute w-[52px] h-11 top-[514px] left-[52px]",
    },
    {
      src: "/vector-6.svg",
      alt: "Vector",
      className: "absolute w-[215px] h-[103px] top-[539px] left-[88px]",
    },
    {
      src: "/vector-7.svg",
      alt: "Vector",
      className: "absolute w-[125px] h-[82px] top-[619px] left-[203px]",
    },
  ];

  return (
    <main className="bg-white flex flex-row justify-center w-full">
      <Card className="bg-white overflow-hidden w-[500px] h-[700px] border-none">
        <CardContent className="p-0">
          <div className="relative w-[370px] h-[701px] top-1.5 left-20">
            {vectorImages.map((image, index) => (
              <img
                key={index}
                className={image.className}
                alt={image.alt}
                src={image.src}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};
