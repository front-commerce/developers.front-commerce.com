import React from "react";

interface DescriptionProps {
  value: string;
}

export default function Description(props: DescriptionProps) {
  const formatValue = (value: string): string => {
    return value.replace(/`([^`]+)`/g, "<code>$1</code>");
  };

  return <div dangerouslySetInnerHTML={{ __html: formatValue(props.value) }} />;
}
