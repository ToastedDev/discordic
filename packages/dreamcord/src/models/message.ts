import { Client } from "../client";
import { If } from "../types/if";
import { MessageOptions } from "../types/message";
import { Channel } from "./channel";
import { Emoji } from "./emoji";
import { Guild } from "./guild";
import { User } from "./user";

export class Message<InGuild extends boolean = boolean> {
  /**
   * The client that initialized this message.
   */
  public client: Client;

  /**
   * The ID of this message.
   */
  public id!: string;

  /**
   * The content of this message. Requires the MessageContent intent.
   * @requires Intents.MessageContent
   */
  public content!: string;

  /**
   * The author of this message.
   */
  public author!: User;

  /**
   * The author ID of this message.
   */
  public authorId!: string;

  /**
   * The guild ID this message was sent in.
   */
  public guildId!: If<InGuild, string>;

  /**
   * The channel this message was sent in.
   */
  public channel!: Channel;

  public readonly cacheType: InGuild = Boolean(this.guildId) as InGuild;

  constructor(client: Client, data: any) {
    this.client = client;
    this._patch(data);
  }

  private _patch(data: any) {
    this.id = data.id;
    this.content = data.content;
    this.guildId = data.guild_id ?? null;
    this.authorId = data.author.id;

    let user = this.client.users.get(data.author.id);
    this.author = user!;

    let channel = this.client.channels.get(data.channel_id);
    this.channel = channel!;
  }

  /**
   * Whether this message was sent in a guild.
   */
  public inGuild(): this is Message<true> {
    return Boolean(this.guildId);
  }

  /**
   * The guild this message was sent in if it was sent in a guild.
   */
  public get guild(): If<InGuild, Guild> {
    return (
      this.guildId ? this.client.guilds.get(this.guildId) ?? null : null
    ) as If<InGuild, Guild>;
  }

  /**
   * Reply to this message.
   * @see https://support.discord.com/hc/en-us/articles/360057382374-Replies-FAQ
   */
  public reply(options: string | MessageOptions) {
    let data: any;

    if (typeof options === "string") {
      data = {
        content: options,
      };
    } else {
      data = options;
    }

    data.message_reference = {
      message_id: this.id,
    };

    return this.channel.send(data);
  }

  /**
   * Edit this message.
   */
  public async edit(options: string | MessageOptions) {
    let data: any;

    if (typeof options === "string") {
      data = {
        content: options,
      };
    } else {
      data = options;
    }

    const response = await this.client.rest.editMessage(
      data,
      this.channel.id,
      this.id
    );
    if (this.guildId) response.guild_id = this.guildId;
    return new Message(this.client, response);
  }

  /**
   * Delete this message.
   */
  public async delete() {
    await this.client.rest.deleteMessage(this.channel.id, this.id);
    return this;
  }

  /**
   * React to this message.
   */
  public async react(emoji: string | Emoji) {
    let reaction: string;

    if (typeof emoji === "string") {
      reaction = emoji;
    } else {
      reaction = `${emoji.name}:${emoji.id}`;
    }

    await this.client.rest.createReaction(this.channel.id, this.id, reaction);
    return this;
  }

  /**
   * Pin this message.
   */
  public async pin() {
    await this.client.rest.pinMessage(this.channel.id, this.id);
    return this;
  }

  /**
   * Unpin this message.
   */
  public async unpin() {
    await this.client.rest.unpinMessage(this.channel.id, this.id);
    return this;
  }
}