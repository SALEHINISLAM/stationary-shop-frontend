import { SyntheticEvent } from "react";
import defaultImage from "../assets/card-photo.avif";

export const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = defaultImage; // Set default image on error
  };