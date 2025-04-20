import { NextResponse } from "next/server";
import { startGameLoop } from "@utils/backend/gameLoop";

let started = false;

export async function GET() {
  if (!started) {
    startGameLoop();
    started = true;
  }
  return NextResponse.json({ status: "Game loop started" });
}
