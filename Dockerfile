FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Define o ambiente para produção
ENV NODE_ENV=production

# Constrói a aplicação
RUN npm run build

# Expõe a porta que o Next.js usa
EXPOSE 3000

# Comando para iniciar o servidor Next.js em produção
CMD ["npm", "start"] 