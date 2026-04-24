import { Invitation } from "@/types/invitation";
import { Rsvp } from "@/types/rsvp";
import React from "react";

export interface InvitationTemplateProps {
  invitation: Invitation;
  guestName: string;
  isOpened: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  galleryImages: string[];
  rsvps: Rsvp[];
  rsvpForm: {
    guest_name: string;
    attendance_status: string;
    message: string;
  };
  rsvpLoading: boolean;
  rsvpSuccess: string;
  rsvpError: string;
  handleOpenInvitation: () => void;
  handleRsvpChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmitRsvp: (e: React.FormEvent) => void;
}