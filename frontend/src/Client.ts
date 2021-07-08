const apiUrl = process.env.REACT_APP_API_URL as string;
export class Client {
  constructor(private apiUrl: string) {
    const length = this.apiUrl.length;

    let i = length - 1;
    for (; 0 <= i; --i) {
      if (this.apiUrl[i] === "/") continue;
      break;
    }
    if (0 <= i) {
      this.apiUrl = this.apiUrl.substr(0, i + 1);
    }

    this.apiUrl = this.apiUrl + "/";
  }

  async getCsv(): Promise<string> {
    const url = this.apiUrl;
    const response = await fetch(url);

    if (!response.ok) throw new Error("CSV の取得に失敗しました");

    const csv = await response.text();
    return csv;
  }
}

const client = new Client(apiUrl);
export default client;
