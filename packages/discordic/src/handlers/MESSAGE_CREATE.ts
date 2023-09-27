import { Client } from "../client";
import { Message } from "../models/message";
import { User } from "../models/user";
import { Payload } from "../types/payload";

export default async (client: Client, payload: Payload) => {
  let user = client.users.get(payload.d.author.id);
  if (!user) {
    const fetchedUser = await client.rest.fetchUser(payload.d.author.id);
    user = new User(client, fetchedUser);
    client.users.set(payload.d.author.id, user);
  }
  client.emit("messageCreate", new Message(client, payload.d));
};
