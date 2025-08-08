import { createEntityClient } from "../utils/entityWrapper";
import schema from "./Item.json";
export const Item = createEntityClient("Item", schema);
