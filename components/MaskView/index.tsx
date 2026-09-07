export enum MaskPatternType {
  NAME,
  MOBILE_NUMBER,
}

export interface MaskViewProps {
  text: string;
  maskPattern?: MaskPatternType;
}

function MaskView({ text, maskPattern }: MaskViewProps) {
  switch (maskPattern) {
    case MaskPatternType.NAME:
      return text
        .split(" ")
        .map((part) => part[0] + "*".repeat(Math.max(0, part.length - 1)))
        .join(" ");
    case MaskPatternType.MOBILE_NUMBER:
      const visibleDigits = 4;
      return "*".repeat(Math.max(0, text.length - visibleDigits)) + text.slice(-visibleDigits);
    default:
      return text;
  }
}

export default MaskView;
