import type { ReviewRequestTopic } from "./types";

export const reviewRequestTopics = [
  { value: "new-facility", label: "New facility planning" },
  { value: "expansion", label: "Expansion or capacity" },
  { value: "capital", label: "Capital budget and funding" },
  { value: "approvals", label: "Approvals and compliance" },
  { value: "other", label: "Something else" },
] as const satisfies ReadonlyArray<{
  value: ReviewRequestTopic;
  label: string;
}>;

export type ReviewRequestField =
  | "name"
  | "email"
  | "facility"
  | "topic"
  | "message";

export interface ReviewRequestFormState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<ReviewRequestField, string>>;
}

export const initialReviewRequestFormState: ReviewRequestFormState = {
  status: "idle",
  message: "",
};
