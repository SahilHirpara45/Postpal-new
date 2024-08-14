export function getNextPackageId(currentId) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let carry = true;
    let nextId = "";

    for (let i = currentId.length - 1; i >= 0; i--) {
      const index = letters.indexOf(currentId[i]);
      if (index === -1) {
        throw new Error("Invalid package ID");
      }

      if (carry) {
        if (index === letters.length - 1) {
          nextId = "A" + nextId;
        } else {
          nextId = letters[index + 1] + nextId;
          carry = false;
        }
      } else {
        nextId = currentId[i] + nextId;
      }
    }

    if (carry) {
      nextId = "A" + nextId;
    }

    return nextId;
  }