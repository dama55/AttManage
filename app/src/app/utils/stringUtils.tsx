
// 'YYYY-MM-DD HH:MM:SS GMT+0900' -> 'YYYY-MM-DDTHH:MM:SS+09:00' に変換する関数
export const convertToISOFormat = (dateString: string) => {
    return dateString.replace('GMT+0900', '+09:00');
};

//文字列どうしの比較
export const arraysEqual = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((value, index) => value === sortedB[index]);
};