import { CURRENCY_FORMAT, FORMAT_LOCALE } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat(FORMAT_LOCALE, {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(date));

export const formatNumber = (number: number,
  style: Intl.NumberFormatOptions["style"] = "decimal",
  currency: Intl.NumberFormatOptions["currency"] = CURRENCY_FORMAT,
  minFraction = 2, 
  maxFraction = 2,
) =>
  new Intl.NumberFormat(FORMAT_LOCALE, {
    style,
    currency,
    minimumFractionDigits: minFraction,
    maximumFractionDigits: maxFraction
  }).format(number);
