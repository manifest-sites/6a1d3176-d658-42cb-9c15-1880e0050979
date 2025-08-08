import { createEntityClient } from "../utils/entityWrapper";
import schema from "./Game.json";
export const Game = createEntityClient("Game", schema);
