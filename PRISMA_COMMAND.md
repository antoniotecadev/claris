npx prisma init: inicializa o Prisma no projecto, criando a pasta prisma e o arquivo schema.prisma
npx prisma migrate dev --name <nome-da-migracao>: cria uma nova migração com o nome especificado e aplica as migrações ao banco de dados
npx prisma migrate dev: (sem nome) cria migração com nome automático
npx prisma migrate reset: apaga toda a base de dados e reaplica todas as migrações
npx prisma db push: empurra as alterações diretamente (sem criar migração - útil em protótipos)
npx prisma generate: só gera o client (sem migrar)
npx prisma migrate deploy: usado em produção
npx prisma db pull: puxa o estado actual do banco de dados para o schema.prisma (útil quando o banco é actualizado por outros meios)

dev: serve para desenvolvimento, aplicando migrações e gerando o client
deploy: usado em produção, apenas aplicando migrações já criadas (sem criar novas migrações)
reset: apaga e recria o banco de dados, útil para desenvolvimento, mas perigoso para produção
push: empurra alterações sem criar migração, útil para protótipos, mas não recomendado para produção
generate: apenas gera o client, sem tocar no banco de dados, útil para quando você já tem o banco actualizado e só precisa do client actualizado.