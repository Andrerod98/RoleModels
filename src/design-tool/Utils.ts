export class Utils {
  static jsonToString = (json: any) => {
    return JSON.stringify(json, null, "\t");
  };

  static stringToJson = (str: string) => {
    if (str === "") str = "{}";

    try {
      return JSON.parse(str);
    } catch (e) {
      return undefined;
    }
  };
}
