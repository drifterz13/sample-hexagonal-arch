export class GenId {
  #id: string;

  constructor(id?: string) {
    this.#id = id || crypto.randomUUID();
  }

  get value(): string {
    return this.#id;
  }
}
