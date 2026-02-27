# Avaliação de conhecimentos em Desenvolvimento de Software

Aplicação fullstack **serverless** para compartilhamento seguro de senhas/segredos via **links temporários**, com **expiração automática** (TTL) e **limite de visualizações**.

##  Por que existe?
Para enviar credenciais com segurança, evitando exposição em canais inseguros (e-mail, SMS, Slack, prints).
O segredo fica **criptografado em repouso** e é **destruído automaticamente** após expirar ou atingir o limite de acessos.

---

## ✅ Funcionalidades
- Criar segredo com:
  - senha digitada pelo usuário **ou**
  - senha gerada automaticamente por política (frontend ou backend)
- Definir:
  - tempo de expiração (segundos/minutos/dias)
  - limite máximo de visualizações (1–100)
- Gerar URL de compartilhamento: `/visualizar/{pwdId}`
- Consumir segredo via link:
  - valida expiração
  - valida limite de views
  - incrementa view **atomicamente**
  - **deleta** ao atingir o limite
- UI amigável:
  - modo **Create** (gerar/criar link)
  - modo **View** (colar token/URL e abrir)
  - modal de link criado + copiar para clipboard
  - página de visualização com copiar segredo + “sair com segurança”

---

## 🧱 Arquitetura
**Frontend**
- Next.js (App Router) + TypeScript
- CSS Modules
- Web Crypto API (para geração de senha no browser)

**Backend**
- AWS Lambda (Python 3.11+) + API Gateway
- DynamoDB (com TTL via atributo `expires_at`)
- Criptografia: `cryptography` (Fernet) + HMAC (integridade/autenticidade)
- Token: `secrets.token_urlsafe(32)` (base64url, ~43 chars)
- Armazenamento do token no banco: **SHA-256 do token** (`token_hash`)

**Fluxo geral**
1. `POST /pwd` cria um `pwdId` (token) e salva segredo criptografado no DynamoDB.
2. Frontend monta a URL: `.../visualizar/{pwdId}`
3. `GET /pwd/{pwdId}`:
   - faz hash do token
   - consome 1 visualização (update atômico com ConditionExpression)
   - descriptografa e retorna o segredo
   - deleta se atingiu o limite
   - expira por tempo (bloqueio lógico + TTL do DynamoDB)

---

## 📁 Estrutura de pastas (referência)
```txt
backend/
  handlers/        # Lambdas (create/get/health/options)
  usecases/        # regras de negócio (create_secret/get_secret)
  infra/           # crypto, generator, repository DynamoDB
  utils/           # http/security/time
  tests/           # pytest
  serverless.yml
  requirements.txt

frontend/
  src/app/         # Next.js pages (create/view + /visualizar/[pwdId])
  src/components/  # modais e cards
  src/lib/         # api client + utils (token/time/password)