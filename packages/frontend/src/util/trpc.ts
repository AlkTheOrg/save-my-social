import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "sms-api";

export const trpc = createTRPCReact<AppRouter>();
