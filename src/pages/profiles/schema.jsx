import { z } from "zod";

export const profileSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }).min(2),
  source: z.string({
    required_error: "Source is required",
    invalid_type_error: "Source must be a string",
  })
});