export type Avatar = { type: "boy" | "girl"; url: string };

export let avatars: Avatar[] = [];

for (let i = 1; i <= 10; i++) {
  avatars.push({ url: `/static/avatars/boys/${i}.png`, type: "boy" });
  avatars.push({ url: `/static/avatars/girls/${i}.png`, type: "girl" });
}
