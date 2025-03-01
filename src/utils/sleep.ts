// TODO: 理解する
export const sleep = (second: number) => {
  return new Promise((resolve) => setTimeout(resolve, second * 1000));
};
