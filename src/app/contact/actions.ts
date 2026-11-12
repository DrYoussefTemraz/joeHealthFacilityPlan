"use server";

import { createReviewRequest } from "@/lib/data";
import {
  reviewRequestTopics,
  type ReviewRequestField,
  type ReviewRequestFormState,
} from "@/lib/review-request";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: 120,
  email: 254,
  facility: 160,
  message: 4_000,
} as const;

const MIN_MESSAGE_LENGTH = 10;

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitReviewRequest(
  _previousState: ReviewRequestFormState,
  formData: FormData,
): Promise<ReviewRequestFormState> {
  // Honeypot: real users never fill this hidden field. Return success without
  // writing so bots do not learn that the submission was rejected.
  if (readText(formData, "website")) {
    return {
      status: "success",
      message: "Thanks — your request has been received.",
    };
  }

  const name = readText(formData, "name");
  const email = readText(formData, "email");
  const facility = readText(formData, "facility");
  const rawTopic = readText(formData, "topic");
  const message = readText(formData, "message");

  const topic = reviewRequestTopics.find(
    (option) => option.value === rawTopic,
  )?.value;

  const fieldErrors: Partial<Record<ReviewRequestField, string>> = {};

  if (!name) {
    fieldErrors.name = "Enter your full name.";
  } else if (name.length > LIMITS.name) {
    fieldErrors.name = `Keep your name under ${LIMITS.name} characters.`;
  }

  if (!email) {
    fieldErrors.email = "Enter your email address.";
  } else if (email.length > LIMITS.email) {
    fieldErrors.email = `Keep your email under ${LIMITS.email} characters.`;
  } else if (!EMAIL_PATTERN.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (facility.length > LIMITS.facility) {
    fieldErrors.facility = `Keep the facility name under ${LIMITS.facility} characters.`;
  }

  if (!topic) {
    fieldErrors.topic = "Choose what this request is about.";
  }

  if (!message) {
    fieldErrors.message = "Tell us what you need help with.";
  } else if (message.length < MIN_MESSAGE_LENGTH) {
    fieldErrors.message = `Add at least ${MIN_MESSAGE_LENGTH} characters of detail.`;
  } else if (message.length > LIMITS.message) {
    fieldErrors.message = `Keep your message under ${LIMITS.message} characters.`;
  }

  if (!topic || Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  try {
    await createReviewRequest({
      name,
      email,
      facility: facility || null,
      topic,
      message,
    });
  } catch (error) {
    console.error("Failed to save review request:", error);
    return {
      status: "error",
      message:
        "Something went wrong while saving your request. Please try again.",
    };
  }

  return {
    status: "success",
    message:
      "Thanks — your request has been received. The planning office will be in touch.",
  };
}
