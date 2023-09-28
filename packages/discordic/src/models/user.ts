import { Client } from "../client";
import { ImageURLOptions } from "../types/images";

export class User {
  /**
   * The client that initialized this user.
   */
  public client: Client;

  /**
   * The ID of this user.
   */
  public id!: string;

  /**
   * The username of this user.
   */
  public username!: string;

  /**
   * The discriminator of this user (if any).
   */
  public discriminator!: string;

  /**
   * The global name/display name of this user.
   */
  public globalName!: string;

  /**
   * The avatar {@link https://discord.com/developers/docs/reference#image-formatting hash} of this user.
   */
  public avatar!: string | null;

  /**
   * The banner {@link https://discord.com/developers/docs/reference#image-formatting hash} of this user.
   */
  public banner!: string | null;

  /**
   * The accent color of this user encoded as an integer representation of hexadecimal color code.
   */
  public accentColor!: string | null;

  /**
   * Whether this user belongs to an OAuth2 application.
   */
  public bot!: boolean;

  /**
   * Whether this user is an official Discord System user (part of the urgent message system).
   */
  public system!: boolean;

  /**
   * The {@link https://discord.com/developers/docs/resources/user#user-object-user-flags flags} of this user.
   */
  public flags!: string[];

  /**
   * The public {@link https://discord.com/developers/docs/resources/user#user-object-user-flags flags} of this user.
   */
  public publicFlags!: string[];

  constructor(client: Client, data: any) {
    this.client = client;
    this._patch(data);
  }

  private _patch(data: any) {
    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.globalName = data.global_name;
    this.avatar = data.avatar;
    this.banner = data.banner;
    this.accentColor = data.accent_color;
    this.bot = !!data.bot;
    this.system = !!data.system;
    this.flags = data.flags;
    this.publicFlags = data.public_flags;
  }

  public get tag() {
    if (!this.bot)
      process.emitWarning("Tags should not be used for users.", {
        code: "USER_TAG_WARNING",
        detail: 'Use "username" instead.',
      });
    return `${this.username}#${this.discriminator}`;
  }

  /**
   * The avatar URL of this user.
   */
  public displayAvatarURL(options?: ImageURLOptions) {
    if (!this.avatar) {
      let index = 0;
      if (this.discriminator === "0") {
        index = (parseInt(this.id) >> 22) % 6;
      } else {
        index = parseInt(this.discriminator) % 5;
      }

      return this.client.cdn.defaultAvatar(index);
    } else return this.client.cdn.avatar(this.id, this.avatar, options);
  }

  /**
   * The banner URL of this user.
   */
  public bannerURL(options?: ImageURLOptions) {
    if (!this.banner) return null;
    return this.client.cdn.banner(this.id, this.banner, options);
  }
}