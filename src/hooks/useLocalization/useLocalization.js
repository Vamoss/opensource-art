import { useContext } from "react";
import { LocalizationContext } from "./LocalizationContext";

export const useLocalization = () => useContext(LocalizationContext);
