// app-desktop/src/types.ts
export type ChatMessage = {
  type: "message";
  author: string;
  text: string;
  ts?: number;
};
