import React, { HTMLAttributes } from "react";
//@ts-ignore

import ReactStars from "react-rating-stars-component";

type RatingBarType = React.DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Partial<{
    starCount: number;
    color: string;
    activeColor: string;
    isEditable: boolean;
    value: number;
    size: number;
  }>;
const RatingBar = ({
  children,
  className,
  starCount = 5,
  color = "grey",
  activeColor = "red",
  isEditable = false,
  ...restProps
}: RatingBarType) => {
  return (
    <>
      <ReactStars
        edit={isEditable}
        classNames={className}
        count={starCount}
        isHalf={true}
        // color="black"
        activeColor="rgb(227 160 8)"
        {...restProps}
        key={restProps.value || 1}
      />
      {children}
    </>
  );
};

export { RatingBar };