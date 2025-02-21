export class File {
  constructor({ name, device, path, status }) {
    this.name = name;
    this.device = device;
    this.path = path;
    this.status = status;
  }

  toString() {
    return `Name: ${this.name} Device: ${this.device} Path: ${this.path}`;
  }
}
