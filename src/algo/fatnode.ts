function indexForVersion(version: number, versions: number[]): number {
  return indexForVersionHelper(version, versions, 0, versions.length - 1);
}

function indexForVersionHelper(version: number, versions: number[], lo: number, hi: number): number {
  if (lo > hi) {
    return lo - 1;
  } else {
    const mid = Math.floor(lo + (hi - lo) / 2);
    const v = versions[mid];
    if (v == version) {
      return mid;
    } else if (v < version) {
      return indexForVersionHelper(version, versions, mid + 1, hi);
    } else {
      return indexForVersionHelper(version, versions, lo, mid - 1);
    }
  }
}

function BST(): BST {
  const roots: [number, FatNode][] = [];
  let version = -1;

  function currentVersion(): number {
    return version;
  }

  function rootsVersions(): number[] {
    return roots.map((r) => r[0]);
  }

  function rootAtVersion(version: number): FatNode {
    const i = indexForVersion(version, rootsVersions());
    if (i == -1) {
      return null;
    } else {
      return roots[i][1];
    }
  }

  function insert(value: number): boolean {
    version = version + 1;
    if (roots.length == 0 || roots[roots.length - 1][1] == null) {
      const root = FatNode(version, value, 1);
      roots.push([version, root]);
      return true;
    } else {
      const root = roots[roots.length - 1][1];
      const inserted = root.insert(version, value);
      if (!inserted) {
        version = version - 1;
      }
      return inserted;
    }
  }

  function remove(value: number): boolean {
    if (roots.length > 0) {
      version = version + 1;
      const root = roots[roots.length - 1][1];
      const [removed, newRoot] = root.remove(version, value);
      if (!removed) {
        version = version - 1;
      } else {
        if (newRoot != root) {
          roots.push([version, newRoot]);
        }
      }
      return removed;
    } else {
      return false;
    }
  }

  function find(version: number, value: number): boolean {
    const root = rootAtVersion(version);
    if (root) {
      return root.find(version, value);
    } else {
      return false;
    }
  }

  function atVersion(version: number): EphemeralNode {
    const root = rootAtVersion(version);

    if (root) {
      return root.atVersion(version);
    } else {
      return null;
    }
  }

  return { roots, insert, remove, find, currentVersion, atVersion };
}

function FatNode(initTime: number, initValue: number, d: number): FatNode {
  const lefts: [number, FatNode][] = [],
    rights: [number, FatNode][] = [],
    values: [number, number][] = [[initTime, initValue]],
    depth: number = d;

  function Repr(): FatNode[] {
    let nodes = [this];
    for (const left of lefts) {
      if (left[1] != null) {
        nodes = nodes.concat(left[1].Repr());
      }
    }

    for (const right of rights) {
      if (right[1] != null) {
        nodes = nodes.concat(right[1].Repr());
      }
    }

    return nodes;
  }

  function atVersion(version: number): EphemeralNode {
    const l = leftAtVersion(version),
      r = rightAtVersion(version);

    return {
      value: valueAtVersion(version),
      left: l ? l.atVersion(version) : null,
      right: r ? r.atVersion(version) : null,
    };
  }

  function left(): FatNode {
    if (lefts.length > 0) {
      return lefts[lefts.length - 1][1];
    } else {
      return null;
    }
  }

  function right(): FatNode {
    if (rights.length > 0) {
      return rights[rights.length - 1][1];
    } else {
      return null;
    }
  }

  function value(): number {
    return values[values.length - 1][1];
  }

  function valuesVersions(): number[] {
    return values.map((v) => v[0]);
  }

  function leftsVersions(): number[] {
    return lefts.map((l) => l[0]);
  }

  function rightsVersions(): number[] {
    return rights.map((r) => r[0]);
  }

  function valueAtVersion(version: number): undefined | number {
    const i = indexForVersion(version, valuesVersions());
    if (i == -1) {
      return undefined;
    } else {
      return values[i][1];
    }
  }

  function leftAtVersion(version: number): FatNode {
    const i = indexForVersion(version, leftsVersions());
    if (i == -1) {
      return null;
    } else {
      return lefts[i][1];
    }
  }

  function rightAtVersion(version: number): FatNode {
    const i = indexForVersion(version, rightsVersions());
    if (i == -1) {
      return null;
    } else {
      return rights[i][1];
    }
  }

  function find(version: number, value: number): boolean {
    const x = valueAtVersion(version);
    if (x != undefined) {
      if (x > value) {
        const left = leftAtVersion(version);
        if (left == null) {
          return false;
        } else {
          return left.find(version, value);
        }
      } else if (x < value) {
        const right = rightAtVersion(version);
        if (right == null) {
          return null;
        } else {
          return right.find(version, value);
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  function insert(version: number, x: number): boolean {
    const v = value();

    if (v < x) {
      const r = right();
      if (r == null) {
        const node = FatNode(version, x, depth + 1);
        rights.push([version, node]);
        return true;
      } else {
        const inserted = r.insert(version, x);
        if (inserted) {
          return true;
        } else {
          return false;
        }
      }
    } else if (v > x) {
      const l = left();
      if (l == null) {
        const node = FatNode(version, x, depth + 1);
        lefts.push([version, node]);
        return true;
      } else {
        const inserted = l.insert(version, x);
        if (inserted) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  function removeMin(version: number, x: number, parent: FatNode): number {
    const l = left(),
      v = value();
    if (l == null) {
      parent.lefts.push([version, null]);
      return v;
    } else {
      return l.removeMin(version, x, this);
    }
  }

  function remove(version: number, x: number): [boolean, FatNode] {
    const v = value();
    if (v < x) {
      const r = right();
      if (r == null) {
        return [false, this];
      } else {
        const [removed, node] = r.remove(version, x);
        if (removed) {
          if (node != r) {
            rights.push([version, node]);
          }
          return [true, this];
        } else {
          return [false, this];
        }
      }
    } else if (v > x) {
      const l = left();
      if (l == null) {
        return [false, this];
      } else {
        const [removed, node] = l.remove(version, x);
        if (removed) {
          if (node != l) {
            lefts.push([version, node]);
          }
          return [true, this];
        } else {
          return [false, this];
        }
      }
    } else {
      const r = right();
      const l = left();
      if (l == null && r == null) {
        return [true, null];
      } else if (r == null) {
        const value = l.removeMin(version, x, this);
        values.push([version, value]);
        return [true, this];
      } else {
        const l = r.left();
        if (l == null) {
          rights.push([version, r.right()]);
          values.push([version, r.value()]);
        } else {
          const value = r.removeMin(version, x, this);
          values.push([version, value]);
        }
        return [true, this];
      }
    }
  }

  return { values, value, depth, lefts, left, rights, right, find, insert, remove, removeMin, Repr, atVersion };
}

const tree = BST();

export default tree;
