/* eslint-disable guard-for-in */
export default class Utils {
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
  static getURLHashParts(hash: string): string[] {
    return hash.split("&").reduce(function (res, item) {
      const parts = item.split("=");
      res[parts[0]] = parts[1];
      return res;
    }, {}) as string[];
  }

  static async runAsync(promise: () => any) {
    try {
      const data = await promise();
      return [data, null];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  }

  static validURL(str) {
    const pattern = new RegExp(
      "(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})"
    ); // fragment locator
    return str.match(pattern);
  }

  static getCombinations(
    array1: string[],
    array2: string[]
  ): { [role: string]: string }[] {
    if (array1.length == 0 || array2.length == 0) return;

    const permutations = function* (elements) {
      if (elements.length === 1) {
        yield elements;
      } else {
        const [first, ...rest] = elements;
        for (const perm of permutations(rest)) {
          for (let i = 0; i < elements.length; i++) {
            const start = perm.slice(0, i);
            const rest = perm.slice(i);
            yield [...start, first, ...rest];
          }
        }
      }
    };

    const myPermutations = permutations(array2);
    const result: { [role: string]: string }[] = [];
    let done = false;
    while (!done) {
      const next = myPermutations.next();
      if (!(done = next.done)) {
        const output: { [role: string]: string } = {};
        for (let i = 0; i < next.value.length; i++) {
          if (array1[i] === undefined) continue;
          output[array1[i]] = next.value[i];
        }
        // output.push([array1[i], next.value[i]]);
        result.push(output);
        // console.log(output);
      }
    }

    return result;
  }
}
