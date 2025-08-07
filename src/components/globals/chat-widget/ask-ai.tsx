/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

interface AskAIProps {
  messages: any[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
  reload: () => void;
  error: Error | null;
  scrollRef: React.RefObject<HTMLDivElement>;
}

const AskAi = ({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  reload,
  error,
  scrollRef,
}: AskAIProps) => {
  return <div>AskAi</div>;
};

export default AskAi;
