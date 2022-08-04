import React from "react";

interface LoomVideoProps {
  url: string;
}

export default function LoomVideo({ url }: LoomVideoProps) {
  return (
    <div className="relative pb-[62.5%] h-0 rounded-lg overflow-hidden">
      <iframe
        src={url}
        frameBorder="0"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded overflow-hidden"
      ></iframe>
    </div>
  );
}
