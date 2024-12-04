/* eslint-disable no-var */
declare global {
  var mongoose: {
    conn: typeof import('mongoose') | null
    promise: Promise<typeof import('mongoose')> | null
  }
}

// Export vazio para tornar este módulo um módulo TypeScript
export {}
