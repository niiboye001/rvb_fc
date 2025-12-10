import { Id } from "./_generated/dataModel";

export type CardType = "yellow" | "second_yellow" | "red";

export interface AddBookingArgs {
  matchId: Id<"matches">;
  playerId: Id<"players">;
  teamId: Id<"teams">;
  cardType: CardType;
}

export interface Booking {
  _id: Id<"bookings">;
  matchId: Id<"matches">;
  playerId: Id<"players">;
  teamId: Id<"teams">;
  cardType: "yellow" | "second_yellow" | "red";
}
