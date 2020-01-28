export default AttrList;
declare class AttrList {
    static parseAttrList(input: any): {};
    constructor(attrs: any);
    decimalInteger(attrName: any): number;
    hexadecimalInteger(attrName: any): Uint8Array;
    hexadecimalIntegerAsNumber(attrName: any): number;
    decimalFloatingPoint(attrName: any): number;
    enumeratedString(attrName: any): any;
    decimalResolution(attrName: any): {
        width: number;
        height: number;
    };
}
