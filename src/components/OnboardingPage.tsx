export type ChildProfile = {
  name: string;
  age: number;
};

export type TabKey = "abc"|"123"|"colors"|"shapes"|"animals"|"story"|"spell"|"count"|"math"|"rhyme"|"sight"|"phonics"|"memory"|"body"|"emotions"|"weather"|"trace"|"match"|"quiz"|"color"|"rewards";

export function getTabsForAge(age: number): TabKey[] {
  const all: TabKey[] = ["abc","123","colors","shapes","animals","story","spell","count","math","rhyme","sight","phonics","memory","body","emotions","weather","trace","match","quiz","color","rewards"];
  if (age <= 3) {
    return ["abc","123","colors","shapes","animals","story","memory","body","emotions","color","rewards"];
  }
  if (age <= 5) {
    return ["abc","123","colors","shapes","animals","story","spell","count","rhyme","sight","phonics","memory","body","emotions","weather","trace","match","quiz","color","rewards"];
  }
  return all;
}
