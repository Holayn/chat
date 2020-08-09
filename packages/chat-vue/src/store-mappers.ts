export function mapGetters(items: string[]) {
  return items.reduce((acc: any, item: string) => {
    acc[item] = (state: any) => {
      return state[item];
    }
    return acc;
  }, {} as Record<string, any>);
}

export function mapMutations(items: string[]) {
  return items.reduce((acc: any, item: string) => {
    acc[item] = (state: any, value: any) => {
      state[item] = value;
    }
    return acc;
  }, {} as Record<string, any>);
}
