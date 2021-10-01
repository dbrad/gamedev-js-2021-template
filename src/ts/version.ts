import { doc } from "./screen";

export let VERSION = doc.querySelector('meta[name="version"]')?.getAttribute("content") || "0.0.0";