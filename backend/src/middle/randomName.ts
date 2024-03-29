import { randomFirst, randomLast } from "./randomNameList";
import getRandomElement from "./random";
import { code } from "../../../frontend/src/model/data";
import { banpickData } from "./dataClass";

export class randomName {
  firstToNum: { [x: string]: number } = {};
  lastToNum: { [x: string]: number } = {};
  data: {
    [first: number]: {
      [last: number]: code;
    };
  } = {};
  constructor() {
    randomFirst.map((str, idx) => {
      this.firstToNum[str] = idx;
      this.data[idx] = {};
    });
    randomLast.map((str, idx) => {
      this.lastToNum[str] = idx;
      randomFirst.map((sstr, iidx) => {
        this.data[iidx][idx] = {
          team: "OBSERVER",
          id: "",
        };
      });
    });
  }

  getRandomCode(code: code) {
    while (true) {
      const firstStr = getRandomElement(randomFirst);
      const lastStr = getRandomElement(randomLast);
      const firstNum = this.firstToNum[firstStr];
      const lastNum = this.lastToNum[lastStr];
      if (this.data[firstNum][lastNum].id === "") {
        this.data[firstNum][lastNum] = code;
        return {
          firstStr,
          lastStr,
          answer: `${firstStr} ${lastStr}`,
        };
      }
    }
  }
  codeToId(code: string) {
    const lis = code.split(" ");
    if (lis.length !== 2) {
      return {
        err: "띄어쓰기가 잘못됐습니다. 코드 형식은 수식어와 챔피언 이름 두 단어입니다.",
      };
    }
    const firstStr = lis[0];
    const lastStr = lis[1];
    if (!(firstStr in this.firstToNum) || !(lastStr in this.lastToNum)) {
      return {
        err: "존재하지 않는 코드 단어입니다.",
      };
    }
    const firstNum = this.firstToNum[firstStr];
    const lastNum = this.lastToNum[lastStr];
    const answer = this.data[firstNum][lastNum];
    if (answer.id === "") {
      return {
        err: "존재하지 않는 코드입니다.",
      };
    }
    return {
      ans: answer,
    };
  }
  randomClean(instance: banpickData) {
    randomFirst.map((firstString) => {
      const firstNum = this.firstToNum[firstString];
      const firstData = this.data[firstNum];
      randomLast.map((lastString) => {
        const lastNum = this.lastToNum[lastString];
        const data = firstData[lastNum];
        const { id } = data;
        if (id !== "") {
          const isExist = instance.checkGame(id);
          if (!isExist) {
            data.id = "";
            //console.log(`${firstString} ${lastString} ${id} 삭제`);
          } //else console.log(`${firstString} ${lastString} ${id} 유지`);
        }
      });
    });
  }
}
