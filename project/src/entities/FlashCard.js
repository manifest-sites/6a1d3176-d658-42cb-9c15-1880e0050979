import { createEntityClient } from "../utils/entityWrapper";
import schema from "./FlashCard.json";
export const FlashCard = createEntityClient("FlashCard", schema);
