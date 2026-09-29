import Dexie from 'dexie'

export const db = new Dexie('black-hole')

db.version(1).stores({
  thoughts: '++id, createdAt'
})

export async function yeetThought(text) {
  const cleaned = text.trim()

  if (!cleaned) return

  await db.thoughts.add({
    text: cleaned,
    createdAt: Date.now()
  })
}

export async function getThoughts() {
  return await db.thoughts
    .orderBy('createdAt')
    .toArray()
}