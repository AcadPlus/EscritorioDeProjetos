# Estágio de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos de manifesto de pacote e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Constrói a aplicação para produção
RUN npm run build

# Estágio de produção
FROM node:18-alpine

WORKDIR /app

# Define o ambiente como produção
ENV NODE_ENV=production

# Copia os artefatos de build do estágio anterior
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Cria um usuário de sistema para rodar a aplicação com menos privilégios
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
USER nextjs

# Expõe a porta que o Next.js usa
EXPOSE 3000

# Comando para iniciar o servidor Next.js em produção
CMD ["npm", "start"] 