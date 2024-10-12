export function generateSlug(title: string): string {
  return title
    .toLowerCase() // Converte para letras minúsculas
    .trim() // Remove espaços no início e no final
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hifens
    .replace(/-+/g, '-') // Remove hifens repetidos
}
