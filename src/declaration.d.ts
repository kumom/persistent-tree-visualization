declare module "*.css"

interface BST {
    currentVersion: () => number;
    roots: [number, FatNode][];
    find: (time: number, value: number) => boolean;
    insert: (value: number) => boolean;
    remove: (value: number) => boolean;
    atVersion: (version: number) => EphemeralNode;
}

interface FatNode {
    lefts: [number, FatNode][];
    left: () => FatNode;
    rights: [number,FatNode][];
    right: () => FatNode;
    values: [number, number][];
    value: () => number;
    atVersion: (version: number) => EphemeralNode;
    find: (time: number, value: number) => boolean;
    insert: (time: number, value: number) => boolean;
    removeMin: (time: number, value: number, parent: FatNode) => number;
    remove: (time: number, value: number) => [boolean, FatNode];
    Repr: () => FatNode[];
    depth: number;
}

interface EphemeralNode {
    left: EphemeralNode;
    right: EphemeralNode;
    value: number;
}

interface HistoryOps {
    op: "i" | "d";
    version: number;
    value: number;
}